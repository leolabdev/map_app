const express = require('express');
const path = require("path");
const dotenv = require("dotenv");
const {getSequelizeInstance} = require("./modules/sequalizeUtil");

dotenv.config();

const app = express();

//make automatic routing
//app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

app.listen(8081, async () => {
    //Testing connection to the DB
    try {
        const sequelize = getSequelizeInstance();
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});