const express = require('express');
const { DaoUtil } = require("../../util/DaoUtil");
const axios = require("axios");

const router = express.Router();
const ResponseUtil = require('./ResponseUtil').ResponseUtil;
const OrderDataDAO = require('../../DAO/OrderDataDAO').OrderDataDAO;

const responseUtil = new ResponseUtil();
const daoUtil = new DaoUtil();

const orderDataDAO = new OrderDataDAO();

router.post("/", async(req, res) => {
    const result = await orderDataDAO.create(req.body);
    responseUtil.sendResultOfQuery(res, result);
});

router.get("/:orderId", async(req, res) => {
    const result = await orderDataDAO.read(req.params.orderId);
    responseUtil.sendResultOfQuery(res, result);
});

router.get("/", async(req, res) => {
    const result = await orderDataDAO.readAll();
    responseUtil.sendResultOfQuery(res, result);
});

router.put("/", async(req, res) => {
    const result = await orderDataDAO.update(req.body);
    responseUtil.sendResultOfQuery(res, result);
});

router.delete("/:orderId", async(req, res) => {
    const status = await orderDataDAO.delete(req.params.orderId);
    responseUtil.sendStatusOfOperation(res, status);
});

module.exports = router;