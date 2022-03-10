const express = require('express');

const router = express.Router();
const ResponseUtil = require('./ResponseUtil').ResponseUtil;
const ClientDAO = require("../../DAO/ClientDAO").ClientDAO;

const responseUtil = new ResponseUtil();

const clientDAO = new ClientDAO();

router.post("/", async (req, res) => {
    const status = await clientDAO.create(req.body);
    responseUtil.sendStatusOfOperation(res, status);
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