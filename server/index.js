/**
 * Main file for server. Configures and starts server
 */
// Dev Start: npm run dev
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const cors = require('cors');
dotenv.config();

const SequelizeUtil = require("./modules/SequelizeUtil").SequelizeUtil;
const SettingsUtil = require("./util/SettingsUtil");

const address = require('./routes/api/v1/address');
const routing = require('./routes/api/v1/routing');

const manufacturer = require('./routes/dao/manufacturer');
const client = require('./routes/dao/client');
const address_dao = require('./routes/dao/address');
const order = require('./routes/dao/order');
const data = require('./routes/dao/data');
const area = require('./routes/dao/area');

const app = express();

//middleware
app.use(cors());
app.use(bodyParser.json());

//API routing
app.use('/api/v1', address);
app.use('/api/v1', routing);

//DAO routing
app.use('/dao/manufacturer', manufacturer);
app.use('/dao/client', client);
app.use('/dao/address', address_dao);
app.use('/dao/order', order);
app.use('/dao/data', data);
app.use('/dao/area', area);

//port for heroku/any server which uses environmental variable PORT or 8081 (a port for our localhost)
const port = process.env.PORT || 8081;
const sequelizeUtil = new SequelizeUtil();
const settingsUtil = new SettingsUtil();

app.listen(port, async() => {
    if (sequelizeUtil.isSequelizeConnected()) {
        console.log(`Server started on port ${port} // http://localhost:${port}/api/v1`);
       // await settingsUtil.setUp();
    }
});