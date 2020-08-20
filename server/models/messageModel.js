const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema ({
    text: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    room : [{
        type: mongoose.Schema.ObjectId,
        ref: 'Room'
    }],
    userAvatar: String,
    delivered : Boolean,
    read : Boolean,
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

messageSchema.pre(/^find/, function(next) {
    this.populate({path: 'room'})
    next()
})

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;