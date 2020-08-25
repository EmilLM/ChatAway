const Room = require('../models/roomModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getAllRooms = factory.getAll(Room);
exports.createRoom = factory.createOne(Room);
exports.getRoom = factory.getOne(Room);
exports.updateRoom = factory.updateOne(Room);
exports.deleteRoom = factory.deleteOne(Room);

exports.getRoomUsers = catchAsync(async (req, res, next) => {
    // for nested routing see s8/ video 12
    // if (!req.body.room) req.body.room = req.params.roomId;
    // if (!req.body.user) req.body.user = req.user.id;


    // my method
    const room = await Room.findById(req.params.roomId);
    const roomUsers =room.users.map(el => el.username)
    

    if (!req.params.roomId) {
       return next(new AppError('No Room found with that id', 404));
    }
    // guide method
    // let filter = {};
    // if (req.param.roomId) filter = {roomId : req.params.roomId}
    // const users = await User.find(filter);

    // if (!users) {
    //     return next(new AppError('This room has no users!', 404))
    // }
    res.json({ 
        status: "success",
        data: {
            roomUsers
        }     
    })
});
exports.getRoomMessages = catchAsync ( async (req, res, next) => {
    const room = await Room.findById(req.params.roomId);
    const roomMessages = room.messages
    if (!req.params.roomId) {
        return next(new AppError('No Room found with that id', 404));
    }
    res.json({
        roomMessages
    })
})

// 
exports.joinRoom  = factory.addToModel(Room);
exports.leaveRoom  = factory.removeFromModel(Room);
exports.addMessageToRoom  = factory.addToModel(Room);
exports.removeMessageFroMRoom = factory.removeFromModel(Room);