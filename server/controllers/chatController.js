const Chat = require('../models/chatModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');


exports.getAllChats = factory.getAll(Chat);
exports.createChat = factory.createOne(Chat);
exports.getChat = factory.getOne(Chat);
exports.updateChat = factory.updateOne(Chat);
exports.deleteChat = factory.deleteOne(Chat);

exports.addToChat = factory.addToModel(Chat);
exports.removeFromChat = factory.removeFromModel(Chat);


exports.friendChat = catchAsync( async (req, res, next) => {
    const loggedInName = req.user.username;
    const targetName = req.params.name
    if (loggedInName === targetName) return next(new AppError("Can't chat with yourself!"))
    const chat = await Chat.findOne({name: loggedInName + '--' + targetName});
    // if (!chat) return next(new AppError('No chat found!', 404));
    res.json({
        status: 'success',
        chat: chat? chat: "No chat history"
    })
})


exports.getChatMessages = catchAsync ( async (req, res, next) => {
    const chat = await Chat.findById(req.params.chatId);
    const chatMessages = chat.messages
    if (!req.params.chatId) {
        return next(new AppError('No Chat found with that id', 404));
    }
    res.json({
        chatMessages
    })
})