const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport'); // Passport module
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
  cookie: {maxAge: 172800000, secure: true, sameSite: 'none'},
  resave: false,
  saveUninitialized: false,
  store
}))

app.use(passport.initialize());
app.use(passport.session())

// Define a route handler for the root path
app.get('/', (req, res) => {
  res.json({ info: 'Node.js, Express, and Postgres API' });
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});