// routes/users.js

const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');

// Route for user registration (POST)
router.post('/register', userController.registerUser);

// Route for user login (POST)
router.post('/login', passport.authenticate('local', {failureMessage: 'User not Found!'}),(req, res) => {
  console.log('user found')
  res.send(req.user);
});

// Route for user profile
router.get('/profile', ensureAuthenticated, userController.getUserProfile);

// Route for user logout
router.get('/logout', userController.logoutUser);

//Route to update user profile
router.put('/profile', ensureAuthenticated, userController.updateUserProfile);

//Route to change password
router.put('/password', ensureAuthenticated, userController.changePassword);

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // If authenticated, continue to the next middleware
  }
  res.redirect('/login'); // If not authenticated, redirect to login page
}

module.exports = router;
