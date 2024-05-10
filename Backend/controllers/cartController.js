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
    if (cartExists.rows.length > 0) {
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
    const cart_id = await pool.query('SELECT cart_id FROM Cart WHERE user_id = $1', [userID]);
    if (!cart_id) {
      throw new Error("No cart created yet for the user!");
    }
    const {product_id, quantity} = req.body;
    const existingCartItem = await pool.query('SELECT * FROM Cart_Items WHERE cart_id = $1 AND product_id = $2', [cart_id, product_id]);
    if (existingCartItem.rows.length > 0) {
      //If cart Item exists, add quantities together
      const updatedQuantity = existingCartItem.rows[0].quantity + quantity;
      await pool.query('UPDATE Cart_Items SET quantity = $1 WHERE cart_id = $2', [updatedQuantity, cart_id]);
      res.status(200).send('Added the quantity to the cart!'); 
    } else {
      // If no matching items are found, create
      const price = await pool.query('SELECT price FROM Products WHERE product_id = $1', [product_id]);
      await pool.query('INSERT INTO Cart_Items (cart_id, product_id, quantity, price) VALUES($1, $2, $3, $4)', [cart_id, product_id, quantity, price]);
      res.status(200).send(`Added product with id = ${product_id} into cart with id = ${cart_id}`);
    }
  } catch (e) {
    next(e);
  }
};

// Function to remove item from cart
exports.removeItemFromCart = async (req, res) => {
  // Logic to remove item from cart
  try {
    const userID = req.user.user_id;
    const {cart_item_id} = req.body;
    const result = await pool.query('DELETE FROM Cart_Items WHERE cart_item_id = $1', [cart_item_id]);
    res.status(200).send('Item deleted!');
  } catch (error) {
    next(error);
  }
};
// Function to view cart contents
exports.viewCart = async (req, res, next) => {
  // Logic to view cart contents
  try {
    const userID = req.user.user_id;
    const result = await pool.query('SELECT * FROM Cart WHERE user_id = $1', [userID]);
    res.stauts(200).send(result);
  } catch (e) {
    next(e);
  }
};