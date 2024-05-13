const pool = require('../database');
//Create a new product
exports.createProduct = async (req, res, next) => {
    try  {  //Check you are admin
        if(req.user.role !== 'admin') {
            return res.status(401).json({error: 'You are not an admin'});
        }

        //Get product
        const {name, description, price, quantity_in_stock, category_id, brand, images} = req.body;
        //Check if product name already exists:
        const result = await pool.query('SELECT name FROM Products WHERE name = $1', [name]);
        if(result.rows.length > 0) {
            return res.status(409).json({error: 'This product already exists'});
        }

        //Create the product
        await pool.query('INSERT INTO Products (name, description, price, quantity_in_stock, category_id, brand, images) VALUES($1, $2, $3, $4, $5, $6, $7)', [name, description, price, quantity_in_stock, category_id, brand, images]);
        res.status(200).send(`${name} successfully added to the Database!`)
    } catch (error) {
        next(error);
    }
}
//Update product based on id
exports.updateProduct = async (req, res, next) => {
    try {
        //Check if you are admin
        if(req.user.role !== 'admin') {
            return res.status(401).json({error: 'You are not an admin'})
        }

        //Getting product to update
        const {product_id} = req.params;

        //Fetching the data about that product
        const product = await pool.query('SELECT * FROM Products WHERE product_id = $1', [product_id]);

        //Check if product exists:
        if(product.rows.length === 0) {
            return res.status(404).json({error: "Product doesn't exist"});
        }

        //Get body
        const {name, description, price, quantity_in_stock, category_id, brand, images} = req.body;

        //Update the information of the product
        await pool.query('UPDATE Products SET name = $1, description = $2, price = $3, quantity_in_stock = $4, category_id = $5, brand = $6, images = $7 WHERE product_id = $8', [name, description, price, quantity_in_stock, category_id, brand, images, product_id]);
        res.status(200).send(`Updated the product with id = ${product_id}`)
    } catch(e) {
        next(e);
    }
}
//Remove product based on id
exports.deleteProduct = async (req, res, next) => {
    try {
        //Check if you are admin
        if(req.user.role !== 'admin') {
            return res.status(401).json({error: 'You are not an admin'})
        }

        //Getting product to update
        const {product_id} = req.params;

        //Fetch the data abou that product
        const product = await pool.query('SELECT * FROM Products WHERE product_id = $1', [product_id]);
        
        //Check if product exists:
        if (product.rows.length === 0) {
            return res.status(404).json({error: "Product already doesn't exist"});
        }

        //Delete the actual product
        await pool.query('DELETE FROM Products WHERE product_id = $1', [product_id]);
        res.status(200).send(`Successfully deleted product with id = ${product_id}`);
        
    } catch (error) {
        next(error);
    }
}
//Viewing specific product based on ID
exports.viewProduct = async (req, res, next) => {
    try{
        //Getting product_id from params
        const {product_id} = req.params;

        //Get the product from DB
        const product = await pool.query('SELECT * FROM Products WHERE product_id = $1', [product_id]);
        
        //Check if product exists:
        if (product.rows.length === 0) {
            return res.status(404).json({error: "Product doens't exist"});
        }

        //check if user exists or if a user is an admin
        if (!req.user || req.user.role !== 'admin') {
            //Otherwise, remove the product id from the product object.
            delete product.rows[0].product_id;
            //Send back the response
            return res.status(200).send(product.rows[0]);
        }
        return res.status(200).send(product.rows[0]);


    } catch(error) {
        next(error);
    }
}
//Finished
exports.viewAllProducts = async (req, res, next) => {
    try {
        //Fetch all products
        const products = await pool.query('SELECT * FROM Products ORDER BY product_id');
        //Return an array of each product object
        return res.status(200).send(products.rows);
    } catch (error) {
        next(error);
    }
}
//View based on category
exports.viewProductsInCategory = async (req, res, next) => {
    try {
        //Get the category_id
        const {category_id} = req.params;
        
        //Chcck if category_id is null
        if (!category_id) { 
            return res.status(422).json({error: "The category id isn't specified"});
        }

        //Fetch the products with the category
        const products = await pool.query('SELECT * FROM Products WHERE category_id = $1', [category_id]);
        //Return an array of the resulting products
        return res.status(200).send(products.rows);
    } catch (error) {
        next(error);
    }
}