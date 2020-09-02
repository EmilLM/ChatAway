const express = require('express');
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController')

const {uploadAvatar, resizeAvatar, getAllUsers, createUser, getUser, updateUser, deleteUser, findUserByName,
    aliasMostFriends, userFriendstats, updateMe, deleteMe, getMe, addToUser, removeFromUser} = usersController;



//route set in app.js ('/api/users) 
const router = express.Router();


// Param middleware for id verification
// router.param('id', checkID)

router 
    .route('/')
    .get(getAllUsers)

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// protects all routes after it
router.use(authController.protect);

router.get('/me', getMe, getUser);
router.patch('/changePassword', authController.updatePassword);
router.patch('/updateMe',uploadAvatar, resizeAvatar, updateMe);
router.delete('/deleteMe', deleteMe); 

router
    .route('/:id')
    .get(getUser)

router.patch('/:id/addFriend', addToUser)
router.patch('/:id/removeFriend', removeFromUser)

router.patch('/:id/addChat', addToUser)
router.patch('/:id/removeChat', removeFromUser)

router.get('/:name/find-user', findUserByName)
// mw to restrict to admin 
router.use(authController.restrictTo('admin'))

// Alias route
// router
//     .route('/most-friends')
//     .get(aliasMostFriends, getAllUsers)
// Aggregation route
// router
//     .route('/stats')
//     .get(userFriendstats) 

router 
    .route('/')
    .post(createUser)  

router
    .route('/:id')
    .patch(updateUser)
    .delete(deleteUser)

module.exports = router;