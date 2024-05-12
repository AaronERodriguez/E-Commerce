const express = require('express');
const router = express.Router();
const passport = require('passport');
const productsController = require('../controllers/productsController');

//Path for creating product:
router.post('/create', ensureAuthenticated, productsController.createProduct);
router.put('/update/:product_id', ensureAuthenticated, productsController.updateProduct);
router.delete('/delete/:product_id', ensureAuthenticated, productsController.deleteProduct);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next(); // If authenticated, continue to the next middleware
    }
    res.json({message: 'Not authenticated'}); // If not authenticated, redirect to login page
}

module.exports = router;
