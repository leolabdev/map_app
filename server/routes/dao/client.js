const express = require('express');
const { DaoUtil } = require("../../util/DaoUtil");
const axios = require("axios");

const router = express.Router();
const ResponseUtil = require('./ResponseUtil').ResponseUtil;
const ClientDAO = require("../../DAO/ClientDAO").ClientDAO;

const responseUtil = new ResponseUtil();
const daoUtil = new DaoUtil();

const clientDAO = new ClientDAO();

router.post("/", async(req, res) => {
    const { addressAdd } = req.body;
    if (addressAdd == null) {
        const result = await clientDAO.create(req.body);
        responseUtil.sendResultOfQuery(res, result);
    } else {
        axios
            .post('http://localhost:8081/dao/address', addressAdd)
            .then(async response => {
                req.body.addressAdd = response.data.result;
                const result = await clientDAO.create(req.body);
                responseUtil.sendResultOfQuery(res, result);
            })
            .catch(error => {
                console.error("client: can not create address");
            });
    }
});

router.get("/:clientUsername", async(req, res) => {
    const result = await clientDAO.read(req.params.clientUsername);
    responseUtil.sendResultOfQuery(res, result);
});

router.get("/", async(req, res) => {
    const result = await clientDAO.readAll();
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
                console.error("client: can not create address");
            });
    }

    if (addressDelete != null) {
        const { street, building, city } = addressDelete;
        if (street && building && city) {
            const response = await daoUtil.getAddressesDataFromDB(street, building, city);
            if (response.data.result != null && response.data.result.length > 0) {
                req.body.addressDelete = response.data.result[0];
            } else {
                console.error("client: can not find this address from the data base");
            }
        }
    }

    const result = await clientDAO.update(req.body);
    responseUtil.sendResultOfQuery(res, result);
});

router.delete("/:clientUsername", async(req, res) => {
    const status = await clientDAO.delete(req.params.clientUsername);
    responseUtil.sendStatusOfOperation(res, status);
});

module.exports = router;