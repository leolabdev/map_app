const express = require('express');
const dotenv = require("dotenv");
dotenv.config();

const SequelizeUtil = require("./modules/SequelizeUtil").SequelizeUtil;
const  Manufacturer = require("./model/Manufacturer").Manufacturer;
const  ManufacturerDAO = require("./DAO/ManufacturerDAO").ManufacturerDAO;

const app = express();

//make automatic routing
//app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

const sequelizeUtil = new SequelizeUtil();
const manufacturerDAO = new ManufacturerDAO();

app.listen(8082, async () => {
    if(sequelizeUtil.isSequelizeConnected()){
        let resp = await manufacturerDAO.create({manufacturerUsername: "johnny", name: "John Smith"});
        console.log(resp);
        const johnny = await manufacturerDAO.read("johnny");
        console.log(johnny);

        await manufacturerDAO.create({manufacturerUsername: "anna", name: "Anna Black"});
        await manufacturerDAO.create({manufacturerUsername: "george", name: "George Eagle"});

        let allMans = await manufacturerDAO.readAll();
        console.log(allMans);

        resp = await manufacturerDAO.update({manufacturerUsername: "johnny", name: "John Parker"});
        console.log(resp);

        resp = await manufacturerDAO.delete("anna");
        console.log(resp);

        allMans = await manufacturerDAO.readAll();
        console.log(allMans);
/*
        let manufacturers = await Manufacturer.findAll();
        console.log(JSON.stringify(manufacturers));

        await Manufacturer.update({name: "Anna"},
            {where: {manufacturerId: 1}
        });

        manufacturers = await Manufacturer.findAll({
            attributes: ['name'],
            where: {manufacturerId: 1}
        });
        console.log(JSON.stringify(manufacturers));*/
    }
});