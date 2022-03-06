/**
 * Main file for server. Configures and starts server
 */
// Dev Start: npm run dev
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//middleware
app.use(bodyParser.json());

const address = require('./routes/api/v1/address');
app.use('/api/v1/address', address);

//port for heroku or 5000 (a port for our localhost)
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port} // http://localhost:5000/api/projects`)); //huomaa, et täytyy olla ` eikä '
