const mongoose = require('mongoose');
const validator = require('validator');

const roomsSchema = new mongoose.Schema ({
    name: {
        type: String, 
        unique: true,
        required: [true, 'Room requires a name'],
        maxlength: [20, 'Room name must have max 30 characters'],
        minlength: [3, 'Room name must be longer than 3 characters'],
        // validate: [validator.isAlphanumeric, "Room name must only contain letters and numbers"]
    },
    users: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    messages: [{
        text: String,
        user: String,
        userAvatar: String,
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }],
    description: {
        type: String,
        maxlength: [200, 'Description must be max 200 characters!']
    },
    isPrivate: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
        // to show or not
    },
});
// query mw, this points to query
roomsSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'users',
        select: '-__v -passwordChangedAt'
    });
    // this.populate({path: 'messages'})
    next();
})
const Room = mongoose.model('Room', roomsSchema);

module.exports = Room;