const {promisify} = require('util');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    
};

// sign in helper function 
const createSendToken = (user, statusCode, req, res, rememberMe) => {
    const token = signToken(user._id);
    
    // persistent login
    let maxAge;
    if (rememberMe) {
        maxAge = process.env.JWT_COOKIE_EXPIRES_IN *4*24*60*60*1000;
    } else maxAge = process.env.JWT_COOKIE_EXPIRES_IN * 60*1000

    const cookieOptions = {
        expires: new Date(Date.now() + maxAge),
        httpOnly: true,
        // secure : req.secure  || req.headers('x-forward-proto') === 'https',
        sameSite: 'strict',
        path: '/'
    };
 
    res.cookie('jwt', token, cookieOptions)
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        message: 'Token was sent via cookie',
        token,
        data: {
            user
        }
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        privileges: req.body.privileges,
        
        connected: true
    });
    const url = `${req.protocol}://${req.get('host')}/user-profile`;
    await new Email(newUser, url).sendWelcome()

    if (!newUser) return next(new AppError('Unable to create account!', 401));
    // errors for existing users with email/name
    // password do not match

    createSendToken(newUser, 201, req, res);
    
})

exports.login = catchAsync(async (req, res, next) => {
    const {email, password, rememberMe} = req.body;
    
    // 1. Check if email/password exist
    if (!email || !password) {
        return next(new AppError('Please enter your email and password!', 400)) 
    }
    // 2. Check if user exists && password matches
    const user = await User.findOne({email}).select('+password');
    // to set connected users status to true on login 
    await User.findByIdAndUpdate(user.id, {connected: true})

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password!', 401))
    }

    // 3.If everything is ok, send jwt to client via cookie
    createSendToken(user, 200, req,  res, rememberMe);
    
});
// sending same name cookie with no token to replace to login one
exports.logout = async (req, res) => {
    // set connected user to false
    const decoded = await promisify(jwt.verify)(
        req.cookies.jwt, 
        process.env.JWT_SECRET
    )
    const loggedInUser = await User.findById(decoded.id)
    await User.findByIdAndUpdate(loggedInUser.id, {connected: false})
    
    res.cookie('jwt', 'logged-out', {
        expires: new Date(Date.now()+ 1 * 200),
        httpOnly: true      
    });
    res.json({status: 'logged-out'})
}

// Middleware to protect routes against non-logged/non-privileged users
exports.protect = catchAsync ( async (req, res, next) =>{
    // 1.Getting token and check if it exists
    let token;
    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')) {  
        token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in for permission.', 401))
    }
    // 2.Verifiy the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
   
    // 3.Check if user still exists
   const loggedInUser = await User.findById(decoded.id);
   if (!loggedInUser) return next(new AppError('User no longer exists!'));

    // 4.Check if users changed passwords after the token was issued at (iat)
     if (loggedInUser.changedPasswordAfter(decoded.iat)) {
         return next( new AppError('User password was recently changed. Please relog!', 401))
     }
    //  Grants access to protected route
    // puts user data on the req
    req.user =loggedInUser;
    next()
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) =>{

    if (req.cookies.jwt) {
        try {
            // 1.Verifiy the token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt, 
                process.env.JWT_SECRET
            )
            
            // 2.Check if user still exists
            const loggedInUser = await User.findById(decoded.id);
            
            if (!loggedInUser) return next();

            // 3.Check if users changed passwords after the token was issued at (iat)
            if (loggedInUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }
            //  There is a logged in user
            // res.locals.user = loggedInUser;
            req.user = loggedInUser;
            // console.log(`User: ${loggedInUser.username} is logged in`);
            return next(); 
        } catch(err) {
            return next();
        }   
    }
    next();
};

// user role restriction mw
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.privileges)) {
            return next(new AppError('You do not have permission!', 403))
        }
        next()
    }
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
//  1. Get user by email
    const user = await User.findOne({email: req.body.email});
    
    if (!user) return next(new AppError('User does not exist!', 404))
    

// 2. Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});

// 3.Send it to the user's email
    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/resetPassword/${resetToken}`;
    // const url = `${req.protocol}://${req.get('host')}/password-reset`;
    try {
        await new Email(user, resetURL).sendResetPassword();
        res.json({
            status: 'success',
            message: 'Token sent to email!'
        })
    } catch(err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false})
        console.log('Error', err);
        return next(new AppError('Could not send reset password email. Try again later!', 500))
    }
})

exports.resetPassword = catchAsync( async (req, res, next) => {

    // 1. Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex')

    const user = await User.findOne({
        passwordResetToken: hashedToken, 
        passwordResetExpires: {$gt: Date.now()}
    });
    

    // 2. If token not expired, user exists, set new pass.
    if (!user) {
        return next(new AppError('Reset token is invalid or has expired!', 400))
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save()
    
    // 3. Update changePasswordAt property for the user
    // through middleware located in userModel

    // 4.Log the user in, send JWT
    createSendToken(user, 200, req, res);
});

// loggedIn user changing password
exports.updatePassword = catchAsync( async (req, res, next) => {
    // 1. Get user from collection   check id if errors!!
    const user = await User.findById(req.user.id).select('+password');
    // console.log(`User ${user}`)

    // 2.Check if POSTed current pass is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong!', 401));
    }

    // 3. If so, update pass
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save()

    // 4. Log user in, send JWT.
    createSendToken(user, 200, req, res);
})