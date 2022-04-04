const express = require('express');
const router = express.Router();

const {DataDAO} = require("../../DAO/Data");
const ResponseUtil = require('../../util/ResponseUtil').ResponseUtil;

const responseUtil = new ResponseUtil();

const dataDAO = new DataDAO();

router.post("/", async(req, res) => {
    const result = await dataDAO.create(req.body);
    responseUtil.sendResultOfQuery(res, result);
});

router.get("/:name", async(req, res) => {
    const result = await dataDAO.read(req.params.name);
    responseUtil.sendResultOfQuery(res, result);
});

router.get("/", async(req, res) => {
    const result = await dataDAO.readAll();
    responseUtil.sendResultOfQuery(res, result);
});

router.put("/", async(req, res) => {
    const status = await dataDAO.update(req.body);
    responseUtil.sendStatusOfOperation(res, status);
});

router.delete("/:name", async(req, res) => {
    const status = await dataDAO.delete(req.params.name);
    responseUtil.sendStatusOfOperation(res, status);
});

module.exports = router;