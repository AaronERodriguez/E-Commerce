const express = require('express');
const router = express.Router();
const passport = require('passport');
const productsController = require('../controllers/productsController');

//Path for creating product:
router.post('/create', ensureAuthenticated, productsController.createProduct);
//Path for updating a product based on id
router.put('/update/:product_id', ensureAuthenticated, productsController.updateProduct);
//Path to delete a product based on its ID
router.delete('/delete/:product_id', ensureAuthenticated, productsController.deleteProduct);
//Path to get a product based on its ID
router.get('/view/:product_id', productsController.viewProduct);
//Path to get all products
router.get('/all', productsController.viewAllProducts);
//Path to get products based on category
router.get('/categories/:category_id', productsController.viewProductsInCategory);
//Path to get all categories
router.get('/categories', productsController.viewAllCategories);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next(); // If authenticated, continue to the next middleware
    }
    res.json({message: 'Not authenticated'}); // If not authenticated, redirect to login page
}

module.exports = router;
