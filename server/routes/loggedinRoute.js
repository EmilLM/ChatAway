const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();


// routes for other pages + mw

router.use(authController.isLoggedIn);

router.get('/', (req, res, next) => {
    if (req.user) {
        res.json({
            status: "User is logged in",
            user: req.user
        });
    } 
    // console.log(req.user);
    if (!req.cookies) {
        return res.json({
            status: "No logged in user!"
        });
    }
    if (!req.user) {
        return res.json({status: 'no user'})
    }
    
})

module.exports = router;