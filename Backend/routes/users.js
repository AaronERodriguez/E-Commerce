// routes/users.js

const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');

// Route for user registration (POST)
router.post('/register', userController.registerUser);

// Route for user login (POST)
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({message: 'Login successful'})
})

// Route for user profile
router.get('/profile', ensureAuthenticated, (req, res) => {
  res.send(req.user);
});

// Route for user logout
router.get('/logout', userController.logoutUser);

//Route to update user profile
router.put('/profile', ensureAuthenticated, userController.updateUserProfile);

//Route to change password
router.put('/password', ensureAuthenticated, userController.changePassword);

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  console.log(req.user);
  if (req.isAuthenticated()) {
    return next(); // If authenticated, continue to the next middleware
  }
  res.json({message: 'Not authenticated'}); // If not authenticated, redirect to login page
}

module.exports = router;