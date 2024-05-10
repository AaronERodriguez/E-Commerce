const pool = require('../database');

//Create a cart for the user: Working
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

// Function to add item to cart: Working
exports.addItemToCart = async (req, res, next) => {
  // Get the data from the request body
  try {
    const userID = req.user.user_id;
    const cart_id = (await pool.query('SELECT cart_id FROM Cart WHERE user_id = $1', [userID])).rows[0].cart_id;
    if (!cart_id) {
      throw new Error("No cart created yet for the user!");
    }
    const {product_id, quantity} = req.body;
    //Getting the price of the product
    const unitPrice = (await pool.query('SELECT price FROM Products WHERE product_id = $1', [product_id])).rows[0].price;
    
    //Get the quantity from the wished product
    const quantity_in_stock = (await pool.query('SELECT quantity_in_stock FROM Products WHERE product_id = $1', [product_id])).rows[0].quantity_in_stock;

    //Check if there is enough stock to continue with the cart:
    if (quantity_in_stock < quantity) {
      throw new Error("There is not enough stock to add to the cart");
    }
    //Updating quantity
    const newProductQuantity = quantity_in_stock - quantity;
    await pool.query('UPDATE Products SET quantity_in_stock = $1 WHERE product_id = $2', [newProductQuantity, product_id]);

    //Check if already in cart
    const existingCartItem = await pool.query('SELECT * FROM Cart_Items WHERE cart_id = $1 AND product_id = $2', [cart_id, product_id]);
    if (existingCartItem.rows.length > 0) {
      //If cart Item exists, add quantities together
      const updatedQuantity = existingCartItem.rows[0].quantity + quantity;
      const updatedPrice = (updatedQuantity * unitPrice);
      await pool.query('UPDATE Cart_Items SET quantity = $1, price = $2 WHERE cart_id = $3', [updatedQuantity, updatedPrice, cart_id]);
      res.status(200).send('Added the quantity to the cart!'); 
    } else {
      // If no matching items are found, create
      const updatedPrice = quantity * unitPrice;
      await pool.query('INSERT INTO Cart_Items (cart_id, product_id, quantity, price) VALUES($1, $2, $3, $4)', [cart_id, product_id, quantity, updatedPrice]);
      res.status(200).send(`Added product with id = ${product_id} into cart with id = ${cart_id}`);
    }
  } catch (e) {
    next(e);
  }
};

// Function to remove item from cart: Developing
exports.removeItemFromCart = async (req, res, next) => {
  // Logic to remove item from cart
  try {
    //Getting Cart and User
    const userID = req.user.user_id;
    const {cart_item_id} = req.body;

    //Getting the cart_item
    const cartItem = (await pool.query('SELECT * FROM Cart_Items WHERE cart_item_id = $1', [cart_item_id])).rows[0];
    console.log(cartItem)

    //Make sure the the User can actually delete this cartItem
    const cart_id = (await pool.query('SELECT cart_id FROM Cart WHERE user_id = $1', [userID])).rows[0].cart_id;
    if (cartItem.cart_id !== cart_id) {
      throw new Error('This cart item does not belong to you!')
    }

    //Getting the quantity that will be removed
    const quantityRemoved = cartItem.quantity;
    const quantityInStock = (await pool.query('SELECT quantity_in_stock FROM Products WHERE product_id = $1', [cartItem.product_id])).rows[0].quantity_in_stock;
    const quantityToBeAdded = quantityInStock + quantityRemoved;

    //Delete item from cart
    await pool.query('DELETE FROM Cart_Items WHERE cart_item_id = $1', [cart_item_id]);
    //Add quantity back to the Products Table
    await pool.query('UPDATE Products SET quantity_in_stock = $1 WHERE product_id = $2', [quantityToBeAdded, cartItem.product_id]);
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