const pool = require('../database');
const bcrypt = require('bcrypt');
const passport = require('passport');

//register User Function
exports.registerUser = async (req, res, next) => {
    try {
        const {username, email, password, billing_address, phone_number} = req.body;
        
        //check if user already exists in the database
        let existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' })
        }
        
        const saltRounds = 12;
        const salt = await bycript.genSalt(saltRounds);

        // Hash password
        const hashedPassword = await bcrypt.hash(password, salt);

        //Insert new user into database
        await pool.query(
            'INSERT INTO users (username, email, password, billing_address, phone_number) VALUES ($1, $2, $3, $4, $5)',
            [username, email, hashedPassword, billing_address, phone_number]
        );

        res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
        next(error);
    }
}

// Function to login a user
exports.loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        } if (!user) {
            return res.status(400).json({error: info.message});
        }
        req.login(user, (err) =>{
            if(err) {
                return next(err);
            }
            return res.status(200).json({message: 'Login successful'});
        });
    })(req, res, next);
}

exports.getUserProfile = async (req, res, next) => {
    try {
        if (!req.isAuthenticated()) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
        // Fetch user profile from database
        const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [req.user.user_id]);
        if (user.rows.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Return user profile
        res.status(200).json(user.rows[0]);
      } catch (error) {
        next(error); // Pass error to error handling middleware
    }
}
// Function to update user profile
exports.updateUserProfile = async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { username, email, billing_address, phone_number } = req.body;
  
      // Update user profile in database
      await pool.query(
        'UPDATE users SET username = $1, email = $2, billing_address = $3, phone_number = $4 WHERE user_id = $5',
        [username, email, billing_address, phone_number, req.user.user_id]
      );
  
      res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
      next(error); // Pass error to error handling middleware
    }
};
  
  // Function to change user password
exports.changePassword = async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { oldPassword, newPassword } = req.body;
  
      // Fetch user from database
      const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [req.user.user_id]);
      if (user.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Validate old password
      const validPassword = await bcrypt.compare(oldPassword, user.rows[0].password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Invalid old password' });
      }
  
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10); // Using 10 rounds for salt
  
      // Update user password in database
      await pool.query('UPDATE users SET password = $1 WHERE user_id = $2', [hashedPassword, req.user.user_id]);
  
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      next(error); // Pass error to error handling middleware
    }
};

exports.logoutUser = (req, res) => {
  req.logout();
  res.redirect('/login');
}