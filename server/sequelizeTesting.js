const express = require('express');
const dotenv = require("dotenv");
dotenv.config();

const SequelizeUtil = require("./modules/SequelizeUtil").SequelizeUtil;
const  Manufacturer = require("./model/Manufacturer").Manufacturer;
const { Sequelize, Model, DataTypes } = require("sequelize");

const app = express();

//make automatic routing
//app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

const sequelizeUtil = new SequelizeUtil();

app.listen(8082, async () => {
    if(sequelizeUtil.isSequelizeConnected()){
        const sequelize = sequelizeUtil.getSequelizeInstance();

        const john = await Manufacturer.create({username: "johnny", name: "John"});
        console.log(john.toJSON());

        let manufacturers = await Manufacturer.findAll();
        console.log(JSON.stringify(manufacturers));

        await Manufacturer.update({name: "Anna"},
            {where: {manufacturerId: 1}
        });

        manufacturers = await Manufacturer.findAll({
            attributes: ['name'],
            where: {manufacturerId: 1}
        });
        console.log(JSON.stringify(manufacturers));
    }
});