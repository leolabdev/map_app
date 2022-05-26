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
const host = process.env.DATABASE_HOST || "localhost";
const port = process.env.DATABASE_PORT || 8081;
/**
 * Create new area in the Area SQL table
 * The request body must contain areaName and type(Polygon or MultiPolygon, read more from GeoJSON docs) fields
 * It is also possible to add area coordinates via this route
 * Basically, the normal request's body should look like GeoJSON Polygon or MultiPolygon object without holes and with area name in addition
 * Example url: http://localhost:8081/dao/area
 * Example request body:
 * {
 *     "areaName": "SomeArea", *primary key, must be unique
 *     "type": "Polygon", *Polygon or MultiPolygon
 *     "coordinates": [
 *         [
 *             [25.654878616333004,60.98514074901049], *[lon, lat]
 *             [25.671615600585938,60.979353511636425],
 *             [25.668354034423825,60.98426648575919],
 *             [25.654878616333004,60.98514074901049]
 *         ]
 *     ]
 * }
 */
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

/**
 * Create multiple new areas in the Area SQL table
 * The request body must contain array of objects with areaName and type(Polygon or MultiPolygon, read more from GeoJSON docs) fields
 * It is also possible to add area coordinates via this route
 * Basically, the normal request's body should look like array of GeoJSON Polygon or MultiPolygon objects without holes and with area name in addition
 * Example url: http://localhost:8081/dao/area
 * Example request body:
 * [
 * {
 *     "areaName": "SomeArea", *primary key, must be unique
 *     "type": "Polygon", *Polygon or MultiPolygon
 *     "coordinates": [
 *         [
 *             [25.654878616333004,60.98514074901049], *[lon, lat]
 *             [25.671615600585938,60.979353511636425],
 *             [25.668354034423825,60.98426648575919],
 *             [25.654878616333004,60.98514074901049]
 *         ]
 *      ]
 * },
 * etc.
 * ]
 */
router.post("/multiple", async(req, res) => {
    try{
        const areas = req.body;
        const coordinates = [];
        for(let i=0; i<areas.length; i++){
            const parsedCoordinates = daoUtil.parsePolygonToAreaCoordinates(areas[i]);

            coordinates.push(...parsedCoordinates);
            delete areas[i].coordinates;
        }

        const result = await areaDAO.createMultiple(areas);
        await areaCoordinatesDAO.createMultiple(coordinates);

        responseUtil.sendResultOfQuery(res, result);
    }catch (e) {
        console.log(e);
        responseUtil.sendResultOfQuery(res, null);
    }
});

/**
 * Get the area ORM object with its coordinates by area name
 * Basically, the normal response looks like GeoJSON Polygon or MultiPolygon object without holes and with area name in addition
 * Example url: http://localhost:8081/dao/area/SomeArea
 */
router.get("/:areaName", async(req, res) => {
    const areaObj = await areaDAO.read(req.params.areaName);
    const result = daoUtil.parseAreaCoordinatesToPolygon(areaObj);
    responseUtil.sendResultOfQuery(res, result);
});

/**
 * Get all saved to the DB areas ORM objects with them coordinates
 * Basically, the normal response looks like array of GeoJSON Polygon or MultiPolygon objects without holes and with area name in addition
 * Example url: http://localhost:8081/dao/area
 */
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

/**
 * Update existing area and its coordinates in the Area and AreaCoordinates SQL table
 * The request must contain areaName field since it is primary key
 * In response success of the operation (true or false) will be returned
 * Example url: http://localhost:8081/dao/area
 * Example request body:
 * {
 *     "areaName": "SomeArea", *primary key
 *     "type": "Polygon", *Polygon or MultiPolygon
 *     "coordinates": [
 *         [
 *             [25.654878616333004,60.98514074901049], *[lon, lat]
 *             [25.671615600585938,60.979353511636425],
 *             [25.668354034423825,60.98426648575919],
 *             [25.654878616333004,60.98514074901049]
 *         ]
 *      ]
 * },
 */
router.put("/", async(req, res) => {
    try{
        const areaObj = req.body;
        await areaDAO.delete(areaObj.areaName);
        const createResp = await axios.post(`http://${host}:${port}/dao/area/`, areaObj);
        const status = createResp.data.result != null;
        responseUtil.sendStatusOfOperation(res, status);
    }catch(e){
        console.log(e);
    }
});

/**
 * Delete area with its area coordinates from the DB by its area name
 * In response success of the operation (true or false) will be returned
 * Example url: http://localhost:8081/dao/area/SomeArea
 */
router.delete("/:areaName", async(req, res) => {
    try{
        const status = await areaDAO.delete(req.params.areaName);
        responseUtil.sendStatusOfOperation(res, status);
    }catch(e){
        console.log(e);
    }
});

module.exports = router;