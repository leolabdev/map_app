const express = require('express');
const dotenv = require("dotenv");
dotenv.config();

const SequelizeUtil = require("./modules/SequelizeUtil").SequelizeUtil;
const { Manufacturer } = require("./model/Manufacturer");

const app = express();

//make automatic routing
//app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

const sequelizeUtil = new SequelizeUtil();

app.listen(8082, async () => {
    if(sequelizeUtil.isSequelizeConnected()){
        const sequelize = sequelizeUtil.getSequelizeInstance();
        console.log(sequelize.models.Manufacturer.findAll());
    }
});