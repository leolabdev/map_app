const express = require('express');
const { DaoUtil } = require("../../util/DaoUtil");
const axios = require("axios");

const router = express.Router();
const ResponseUtil = require('./ResponseUtil').ResponseUtil;
const ManufacturerDAO = require("../../DAO/ManufacturerDAO").ManufacturerDAO;

const responseUtil = new ResponseUtil();
const daoUtil = new DaoUtil();

const manufacturerDAO = new ManufacturerDAO();

router.post("/", async(req, res) => {
    const { addressAdd } = req.body;
    if (addressAdd == null) {
        const result = await manufacturerDAO.create(req.body);
        responseUtil.sendResultOfQuery(res, result);
    } else {
        axios
            .post('http://localhost:8081/dao/address', addressAdd)
            .then(async response => {
                req.body.addressAdd = response.data.result;
                const result = await manufacturerDAO.create(req.body);
                responseUtil.sendResultOfQuery(res, result);
            })
            .catch(error => {
                console.error("manufacturer: can not create address");
            });
    }
});

router.get("/:manufacturerUsername", async(req, res) => {
    const result = await manufacturerDAO.read(req.params.manufacturerUsername);
    responseUtil.sendResultOfQuery(res, result);
});

router.get("/", async(req, res) => {
    const result = await manufacturerDAO.readAll();
    responseUtil.sendResultOfQuery(res, result);
});

router.put("/", async(req, res) => {
    const { addressAdd, addressDelete } = req.body;

    if (addressAdd != null) {
        await axios
            .post('http://localhost:8081/dao/address', addressAdd)
            .then(async response => {
                req.body.addressAdd = response.data.result;
            })
            .catch(error => {
                console.error("manufacturer: can not create address");
            });
    }

    if (addressDelete != null) {
        const { street, building, city } = addressDelete;
        if (street && building && city) {
            const response = await daoUtil.getAddressesDataFromDB(street, building, city);
            if (response.data.result != null && response.data.result.length > 0) {
                req.body.addressDelete = response.data.result[0];
            } else {
                console.error("manufacturer: can not find this address from the data base");
            }
        }
    }

    const result = await manufacturerDAO.update(req.body);
    responseUtil.sendResultOfQuery(res, result);
});

router.delete("/:manufacturerUsername", async(req, res) => {
    const status = await manufacturerDAO.delete(req.params.manufacturerUsername);
    responseUtil.sendStatusOfOperation(res, status);
});

module.exports = router;