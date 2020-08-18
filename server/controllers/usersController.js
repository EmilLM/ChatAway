const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/uploads/userAvatars')
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
//     }
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true) 
    } else {
        cb(new AppError('Not an image! Please only upload images', 400), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadAvatar = upload.single('avatar');

exports.resizeAvatar = (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpg`;
    sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public/uploads/userAvatars/${req.file.filename}`)
    next()
}


exports.getAllUsers = factory.getAll(User);
exports.createUser = factory.createOne(User);

// Alias routes, aka shortcut links
// exports.aliasMostFriends = (req, res, next) => {
//     req.query.limit = '3';
//     req.query.sort = 'friends';
//     req.query.fields = 'username, friends, privileges';
//     next()
// };


//  helper function for filtering the re.body object for fields allowed to be changed by logged user
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] =obj[el]
    })
    return newObj;
};
// mw that runs b4 factory.getOne(getUser)
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}

exports.updateMe = catchAsync( async (req, res, next)=> {
    // 1. Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) { 
        return next(
            new AppError(
                'This route is not for changing the password.', 
                400
            )
        )
    }
    // 3. Filtered out allowed changes so users cant change their own privileges
    const allowedChanges = filterObj(req.body, 'username', 'email');
    if (req.file) allowedChanges.avatar = req.file.filename;
    // conditions that prevent updating user info with blanks when inputs are empty
    if (!req.body.email) allowedChanges.email = req.user.email;
    if (!req.body.username) allowedChanges.username = req.user.username;
    // if (!req.file) allowedChanges.avatar = req.user.avatar;
    // 4.Update user document  
    const updatedUser= await User.findByIdAndUpdate(req.user.id, allowedChanges, {
        new: true,
        runValidators: true
    });

    res.json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
});

exports.deleteMe = catchAsync(async (req, res, next)=> {
    await User.findByIdAndUpdate(req.user.id, {active:false})
    res.status(204).json({
        status: "success",
        data: null
    })
})

exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.addToUser  = factory.addToModel(User);
exports.removeFromUser = factory.removeFromModel(User)


// Mongo aggregation pipeline
// exports.userFriendstats = catchAsync(async (req, res, next) => {
//     const stats = await User.aggregate([
//         {
//             $match: {friends: {$gte: 0} }
//         },
//         {
//             $group: {
//                 _id: {$toUpper: '$privileges'},
//                 numUsers: {$sum: 1},
//                 numFriends: {$sum: '$friends'},
//                 avgFriends: {$avg: '$friends'}
//             },       
//         },
//         {
//             $sort: {numFriends: 1}
//         }
//         // {
//         //     $match: {_id : {$ne: 'USER'}}
//         // }
//     ]);
//     res.json({ 
//         status: "success",
//         data: {
//             stats
//         }     
//     })
   
// })