const express = require('express');
const chatController = require('../controllers/chatController');
const authController = require('../controllers/authController');

const {getAllChats, createChat, getChat, updateChat, 
    deleteChat, addToChat, removeFromChat, friendChat} = chatController;

const router = express.Router();

router.use(authController.protect);

router
    .route('/')
    .get(getAllChats)
    .post(createChat)
    

router
    .route('/:id')
    .get(getChat)
    .patch(updateChat)
    .delete(deleteChat)

router.patch('/:id/addMessage', addToChat);
router.patch('/:id/removeMessage', removeFromChat)

router.patch('/:id/addUser', addToChat);
router.patch('/:id/removeUser/', removeFromChat);

router
    .route('/:chatId/chat-messages')
    .get(authController.protect, chatController.getChatMessages)

router.get('/:name/findChat', friendChat)

module.exports = router;