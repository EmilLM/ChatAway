const express = require('express');
const messagesController = require('../controllers/messagesController');
const authController = require('../controllers/authController');

const router = express.Router();

const {getAllMessages, createMessage, updateMessage, deleteMessage} = messagesController;

// route /api/messages
// router.use(authController.protect);

router
    .route('/')
    .get(getAllMessages)
    .post(createMessage)
    .patch(updateMessage)
    .delete(deleteMessage)



module.exports = router;