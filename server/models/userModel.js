const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');


const usersSchema =  new mongoose.Schema({
    username: {
        type: String, 
        unique: [true, "Name must be unique"],
        maxlength: [30, 'Username must have max 15 characters'],
        minlength: [2, 'Username must be longer than 2 characters'],
        validate: [validator.isAlphanumeric, "Username must only contain letters and numbers"]
    },
    email : {
        type: String,
        // required: [true , 'Must enter a valid email'],
        unique: true,
        lowercase: true,
        // validate: [validator.isEmail, "Email is not valid"]
    },
    password: {
        type: String,
        required: [true, "Must enter password"],
        minlength: [6, "Password must be longer than 6 characters"],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            // this only works on create/save! not update methods
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords do not match!'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    avatar: {
        type: String,
        default: 'default.jpg'
    },
    privileges: {
        type: String,
        default: 'user',
        enum : {
            values: ['user', 'room-admin', 'admin'],
            message: 'Select user privileges: user, room-admin, admin'
        }
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  
    }],
    availableRooms: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Room',
    }],
    joinedRooms: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Room',
    }],
    // many to many referencing
    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
    }],
    createdAt: {
        type: Date,
        default: Date.now(),
        // select: false
        // to show or not
    },
    connected: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    // ?duplicated id for some reason
    // id : {
    //     type: String,
    //     select: false,
    // },

    slug: String,

    // secretUser : {
    //     type: Boolean,
    //     default: false
    // },
    // Custom validators example

    // price: Number,
    // priceDiscount: {
    //     type: Number,
    //     validate: {
    //         validator: function(val) {
        // does not work on update : this references the new doc.
    //             return val < this.price
    //         },
    //         message: 'Discount ({VALUE}) must be lower than price'
    //     }
    // }
}, 
// {
//     // schema options object for virtual property;
//     toJSON: {virtuals: true},
//     toObject: {virtuals: true}
// }
);

// create index / or check compass
// usersSchema.index({friends: 1,privileges: 1});
// usersSchema.index({slug: 1});

// VIRTUAL SCHEMA
// usersSchema.virtual('durationWeeks').get(function () {
//     return this.duration / 7;
// })

// DOCUMENT MIDDLEWARE: runs before .save()/.create() (hooks)
usersSchema.pre('save', function(next) {
    this.slug = slugify(this.username, {lower: true});
    next();
})
// usersSchema.pre('save', function(next){
//     console.log('Will save doucment');
//     next();
// })
// usersSchema.post('save', function(doc, next) {
//     console.log(doc);
//     next();
// })

// QUERY MIDDLEWARE 
// works for every query that starts with find
// usersSchema.pre(/^find/, function(next){
//     this.find({secretUser: {$ne: true}});
//     this.start= Date.now();
//     next();
// })
// usersSchema.post(/^find/, function(docs, next) {
//     console.log(`Query took: ${Date.now() - this.start} ms`);
//     next()
// });

// query mw to remove inactive users from queries
usersSchema.pre(/^find/, function(next) {
    // this points to the current query
    this.find({active: {$ne: false}})
    next();
});

usersSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'availableRooms',
        select: '-users'
    });
    this.populate({
        path: 'friends',
        select: '-friends'
    })
    this.populate({
        path: 'chats',
        select: '-activeUsers'
    })
    next()
})


// capitalize + whitespace removal
usersSchema.pre("save", function(next) {
    this.username = this.username.trim()[0].toUpperCase() 
                    + this.username.slice(1).toLowerCase();
    next();
});
// AGGREGATION MIDDLEWARE
// removes secretUser from aggregate route
// usersSchema.pre('aggregate', function(next) {
//     this.pipeline().unshift({ $match: { secretUser: {$ne: true} } })
//     next();
// })

// password encryption mw
usersSchema.pre('save', async function(next) {
    // Runs if password was modified
    if (!this.isModified('password')) return next();
    // Hash the pass with cost of 12(cpu intensive)
    this.password = await bcrypt.hash(this.password, 12);
    // Delete passConfirm field
    this.passwordConfirm = undefined;
});

// updating the changedPasswordAt prop mw
usersSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
    // token must be created after the password has been changed
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

// Instance method: hashing login password to compare with signup password
// method of all docs(>user)
usersSchema.methods.correctPassword = async function(loginPassword, userPassword) {
    return await bcrypt.compare(loginPassword, userPassword);
}


// Compares the time when the password changed with when the token was issued
usersSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt( this.passwordChangedAt.getTime() /1000, 10);

        return JWTTimestamp < changedTimestamp;
    }
    // False = password wasnt changed
    return false;
};

usersSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

        // console.log({resetToken}, this.passwordResetToken)
    this.passwordResetExpires = Date.now() + 10 * 60 *1000;

    return resetToken;
}
const User = mongoose.model('User', usersSchema);

module.exports = User;