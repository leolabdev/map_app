import express from "express";
import DaoUtil from "../../util/DaoUtil.js";
import ResponseUtil from "../../util/ResponseUtil.js";
import AreaDAO from "../../DAO/AreaDAO.js";

const router = express.Router();


const daoUtil = new DaoUtil();
const responseUtil = new ResponseUtil();

const areaDAO = new AreaDAO();
const host = process.env.API_HOST || "localhost";
const port = process.env.API_PORT || 8081;
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
router.post("/", async (req, res) => {
    try{
        const {areaName, polygon} = req.body;
        if(!areaName || !polygon){
            console.error('No area name or polygon fields provided');
            return null;
        }

        const areaResp = await areaDAO.create({areaName, polygon});

        responseUtil.sendResultOfQuery(res, areaResp);
    } catch (e){
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
    const areaResp = await areaDAO.read(req.params.areaName);
    responseUtil.sendResultOfQuery(res, areaResp);
});

/**
 * Get all saved to the DB areas ORM objects with them coordinates
 * Basically, the normal response looks like array of GeoJSON Polygon or MultiPolygon objects without holes and with area name in addition
 * Example url: http://localhost:8081/dao/area
 */
router.get("/", async(req, res) => {
    const result = await areaDAO.readAll();
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
        const updateResp = await areaDAO.update(req.body);
        responseUtil.sendStatusOfOperation(res, updateResp);
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

export default router;