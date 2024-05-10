const express = require('express');
const router = express.Router();
const passport = require('passport');
const cartController = require('../controllers/cartController'); 

router.post('/create', ensureAuthenticated, cartController.createCart);
router.put('/update', ensureAuthenticated, cartController.addItemToCart);
router.get('/view', ensureAuthenticated, cartController.viewCart);

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    console.log(req.user);
    if (req.isAuthenticated()) {
      return next(); // If authenticated, continue to the next middleware
    }
    res.json({message: 'Not authenticated'}); // If not authenticated, redirect to login page
  }

module.exports = router;