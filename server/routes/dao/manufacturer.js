const express = require('express');

const router = express.Router();
const ResponseUtil = require('./ResponseUtil').ResponseUtil;
const ManufacturerDAO = require("../../DAO/ManufacturerDAO").ManufacturerDAO;

const responseUtil = new ResponseUtil();

const manufacturerDAO = new ManufacturerDAO();

router.post("/", async (req, res) => {
    const status = await manufacturerDAO.create(req.body);
    responseUtil.sendStatusOfOperation(res, status);
});

router.get("/:manufacturerUsername", async (req, res) => {
    const result = await manufacturerDAO.read(req.params.manufacturerUsername);
    responseUtil.sendResultOfQuery(res, result);
});

router.get("/", async (req, res) => {
    const result = await manufacturerDAO.readAll();
    responseUtil.sendResultOfQuery(res, result);
});

router.put("/", async (req, res) => {
    const status = await manufacturerDAO.update(req.body);
    responseUtil.sendStatusOfOperation(res, status);
});

router.delete("/:manufacturerUsername", async (req, res) => {
    const status = await manufacturerDAO.delete(req.params.manufacturerUsername);
    responseUtil.sendStatusOfOperation(res, status);
});

module.exports = router;