/**
 * Main file for server. Configures and starts server
 */
// Dev Start: npm run dev
const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const SequelizeUtil = require("./modules/SequelizeUtil").SequelizeUtil;

const address = require('./routes/api/v1/address');

const manufacturer = require('./routes/dao/manufacturer');
const client = require('./routes/dao/client');
const address_dao = require('./routes/dao/address');
const order = require('./routes/dao/order');

const app = express();

//middleware
app.use(bodyParser.json());

//API routing
app.use('/api/v1', address);

//DAO routing
app.use('/dao/manufacturer', manufacturer);
app.use('/dao/client', client);
app.use('/dao/address', address_dao);
app.use('/dao/order', order);

//port for heroku/any server which uses environmental variable PORT or 8081 (a port for our localhost)
const port = process.env.PORT || 8081;
const sequelizeUtil = new SequelizeUtil();

app.listen(port, async() => {
    if (sequelizeUtil.isSequelizeConnected()) {
        console.log(`Server started on port ${port} // http://localhost:${port}/api/v1`);
    }
});