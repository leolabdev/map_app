const express = require('express');
const {DaoUtil} = require("../../util/DaoUtil");
const axios = require("axios");

const router = express.Router();
const ResponseUtil = require('./ResponseUtil').ResponseUtil;
const ClientDAO = require("../../DAO/ClientDAO").ClientDAO;

const responseUtil = new ResponseUtil();

const clientDAO = new ClientDAO();

router.post("/", async (req, res) => {
    const { address } = req.body;
    if(address == null){
        const result = await clientDAO.create(req.body);
        responseUtil.sendResultOfQuery(res, result);
    } else{
        axios
            .post('http://localhost:8081/dao/address', address)
            .then(async response => {
                req.body.address = response;
                const result = await clientDAO.create(req.body);
                responseUtil.sendResultOfQuery(res, result);
            })
            .catch(error => {
                console.error("client: can not create address");
            });
    }
});

router.get("/:clientUsername", async (req, res) => {
    const result = await clientDAO.read(req.params.clientUsername);
    responseUtil.sendResultOfQuery(res, result);
});

router.get("/", async (req, res) => {
    const result = await clientDAO.readAll();
    responseUtil.sendResultOfQuery(res, result);
});

router.put("/", async (req, res) => {
    const status = await clientDAO.update(req.body);
    responseUtil.sendStatusOfOperation(res, status);
});

router.delete("/:clientUsername", async (req, res) => {
    const status = await clientDAO.delete(req.params.clientUsername);
    responseUtil.sendStatusOfOperation(res, status);
});

module.exports = router;