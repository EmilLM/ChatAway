const express = require('express');
const roomsController = require('../controllers/roomsController');
const authController = require('../controllers/authController');


const {getAllRooms, createRoom, getRoom, updateRoom, 
    deleteRoom, joinRoom, leaveRoom, addMessageToRoom} = roomsController;
    
// route: /api/rooms/
const router = express.Router();

//  getAllRooms must be unprotected to avoid serverSideProps error
router
    .route('/')
    .get(getAllRooms)

router.use(authController.protect);

// nested route
router
    .route('/:roomId/users')
    .get(authController.protect, roomsController.getRoomUsers);

router
    .route('/:roomId/room-messages')
    .get(authController.protect, roomsController.getRoomMessages)

router.use(authController.restrictTo('user','room-admin', 'admin'))

router
    .route('/')
    // .get(getAllRooms)
    .post(createRoom)
router
    .route('/:id')
    .get(getRoom)
    .patch(updateRoom)
    .delete(deleteRoom)
    
router.patch('/:id/join', joinRoom)
router.patch('/:id/leave', leaveRoom)
router.patch('/:id/messages', addMessageToRoom)    


module.exports = router;