const express = require('express');
const router = express.Router();

const {DaoUtil} = require('../../util/DaoUtil');
const ResponseUtil = require('../../util/ResponseUtil').ResponseUtil;
const AreaDAO = require('../../DAO/AreaDAO');
const AreaCoordinatesDAO = require('../../DAO/AreaCoordinatesDAO');
const {OrderDataDAO} = require("../../DAO/OrderDataDAO");
const orderDataDAO = new OrderDataDAO();

const daoUtil = new DaoUtil();
const responseUtil = new ResponseUtil();

const areaDAO = new AreaDAO();
const areaCoordinatesDAO = new AreaCoordinatesDAO();

router.post("/", async(req, res) => {
    try{
        const reqBody = req.body;
        const coordinates = daoUtil.parsePolygonToAreaCoordinates(reqBody);
        delete reqBody.coordinates;

        const result = await areaDAO.create(reqBody).then(async (area) => {
            return {
                ...area.dataValues,
                coordinates: await areaCoordinatesDAO.createMultiple(coordinates)
            };
        });
        responseUtil.sendResultOfQuery(res, result);
    }catch (e) {
        console.log(e);
        responseUtil.sendResultOfQuery(res, null);
    }
});

router.get("/:areaName", async(req, res) => {
    const result = await areaDAO.read(req.params.areaName);
    responseUtil.sendResultOfQuery(res, result);
});

router.get("/", async(req, res) => {
    const result = await orderDataDAO.readAll();
    responseUtil.sendResultOfQuery(res, result);
});

router.put("/", async(req, res) => {
    const status = await orderDataDAO.update(req.body);
    responseUtil.sendStatusOfOperation(res, status);
});

router.delete("/:orderId", async(req, res) => {
    const status = await orderDataDAO.delete(req.params.orderId);
    responseUtil.sendStatusOfOperation(res, status);
});

module.exports = router;