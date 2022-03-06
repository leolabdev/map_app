/**
 * Main file for server. Configures and starts server
 */
// Dev Start: npm run dev
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
dotenv.config();

const {getSequelizeInstance} = require("./modules/sequalizeUtil");
const address = require('./routes/api/v1/address');

const app = express();

//middleware
app.use(bodyParser.json());

app.use('/api/v1', address);

//port for heroku/any server which uses environmental variable PORT or 8081 (a port for our localhost)
const port = process.env.PORT || 8081;

app.listen(port, async () => {
    console.log(`Server started on port ${port} // http://localhost:${port}/api/v1`);
    //Testing connection to the DB
    try {
        const sequelize = getSequelizeInstance();
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
