const express = require('express');
const bodyParser = require('body-parser');
// Create an Express application
const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// Define a route handler for the root path
app.get('/', (req, res) => {
  res.json({ info: 'Node.js, Express, and Postgres API' });
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});