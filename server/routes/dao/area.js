const express = require('express');
const router = express.Router();

const {DaoUtil} = require('../../util/DaoUtil');
const ResponseUtil = require('../../util/ResponseUtil').ResponseUtil;
const AreaDAO = require('../../DAO/AreaDAO');
const AreaCoordinatesDAO = require('../../DAO/AreaCoordinatesDAO');
const axios = require("axios");

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
    const areaObj = await areaDAO.read(req.params.areaName);
    const result = daoUtil.parseAreaCoordinatesToPolygon(areaObj);
    responseUtil.sendResultOfQuery(res, result);
});

router.get("/", async(req, res) => {
    const result = await areaDAO.readAll().then((areaObjects)=>{
        const result = [];
        for(let i = 0; i < areaObjects.length; i++){
            result[i] = daoUtil.parseAreaCoordinatesToPolygon(areaObjects[i]);
        }

        return result;
    });

    responseUtil.sendResultOfQuery(res, result);
});

router.put("/", async(req, res) => {
    try{
        const areaObj = req.body;
        await areaDAO.delete(areaObj.areaName);
        const createResp = await axios.post(`http://localhost:8081/dao/area/`, areaObj);
        const status = createResp.data.result != null;
        responseUtil.sendStatusOfOperation(res, status);
    }catch(e){
        console.log(e);
    }
});

router.delete("/:areaName", async(req, res) => {
    try{
        const status = await areaDAO.delete(req.params.areaName);
        responseUtil.sendStatusOfOperation(res, status);
    }catch(e){
        console.log(e);
    }
});

module.exports = router;