const pool = require('../database');


exports.createCart = async (req, res, next) => {
  try {
    const userID = req.user.user_id;
    //Check if Logged In
    if (!userID) {
      return res.status(401).json({ message: 'User not logged in'})
    }
    //Check if cart exists;
    const cartExists = await pool.query('SELECT * FROM Cart WHERE user_id = $1', [userID]);
    if (cartExists) {
      return res.status(409).json({message: 'Cart already exists for the user!'})
    } else {
      //Create cart
      const newCart = await pool.query('INSERT INTO Cart (user_id) VALUES ($1)', [userID]);
      res.status(201).json({message: 'Cart created Successfully!'});
    }
  } catch (e) {
    next(e);
  }
}

// Function to add item to cart
exports.addItemToCart = async (req, res, next) => {
  // Get the data from the request body
  try {
    const userID = req.user.user_id;
    const {item_id, quantity} = req.body;
    const existingCartItem = await pool.query('SELECT * FROM Cart_Items WHERE cart_id = (SELECT cart_id FROM Cart WHERE user_id = $1) AND item_id = $2', [userID, item_id]);
    if (existingCartItem.rows.length > 0) {
      
    }
  } catch (e) {
    next(e);
  }
};

// Function to remove item from cart
exports.removeItemFromCart = async (req, res) => {
  // Logic to remove item from cart
};
// Function to view cart contents
exports.viewCart = async (req, res, next) => {
  // Logic to view cart contents
  try {
    const userID = req.user.user_id;
    const result = await pool.query('SELECT * FROM Cart WHERE user_id = $1', [userID]);
    return result.rows[0]
  } catch (e) {
    next(e);
  }
};