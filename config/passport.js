const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const pool = require('../Backend/database');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        // Check if user with provided email exists
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return done(null, false, { message: 'Invalid email or password'});
        }

        //Compare provided passowrd with hashed password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return done(null, false, {message: 'Invalid email or password'});
        }

        //Return user object to be used
        return done(null, user.rows[0]);
    } catch (error) {
        return done(error);
    }
}));

//Serialize the User object into session
passport.serializeUser((user, done) => {
    done(null, user.user_id); //Asume the user ID is the PK
})

// Deserialize user object from session
passport.deserializeUser(async (userId, done) => {
    try {
        //Fetch user form database using user ID
        const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
        if (user.rows.length === 0) {
            return done(new Error('User not found'));
        }

        //Return user object
        return done(null, user.rows[0]);
    } catch (error) {
        return done(error);
    }
})

module.exports = passport;