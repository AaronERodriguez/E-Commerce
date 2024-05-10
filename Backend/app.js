const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport'); // Passport module

//Routers
const usersRouter = require('./routes/users'); //Users Routes
const cartRouter = require('./routes/cart'); //Cart Routes

// Create an Express application
const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

require('../config/passport'); 

const store = new session.MemoryStore();

app.use(session({
  secret: 'myKey',
  cookie: {maxAge: 172800000, sameSite: 'none'},
  resave: false,
  saveUninitialized: false,
  store
}))

app.use(passport.initialize());
app.use(passport.session())

//Mount the users routes
app.use('/users', usersRouter);
app.use('/carts', cartRouter);

// Define a route handler for the root path
app.get('/', (req, res) => {
  res.status(200).json({ info: 'Node.js, Express, and Postgres API' });
});

//Error-Handling middleware
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).send(err.message);
}
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;