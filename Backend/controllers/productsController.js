const pool = require('../database');

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

exports.updateProduct

exports.deleteProduct

exports.viewProduct