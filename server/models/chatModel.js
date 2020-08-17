const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    messages: [{
        text: String,
        user: String,
        userAvatar: String,
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }],
    participants: Array,
    activeUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    name: String,
    timestamps: Date
});

chatSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'activeUsers',
        select: '-chats'
    })
    // this.populate({path: 'messages'});
    // this.populate({path: 'participants'});
    next();
})

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;