import ResponseUtil from "../../util/ResponseUtil.js";
import DataService from "../../service/DataService.js";
import express from "express";

const router = express.Router();



const responseUtil = new ResponseUtil();

const dataDAO = new DataService();

/**
 * Create new row in the Data SQL table, which is basically key-value pair
 * Request body must contain name(key) and value fields, which are both strings
 * Example url: http://localhost:8081/dao/data
 * Example request body:
 * {
 *     name: "electricityPrice", *primary key
 *     value: "3"
 * }
 */
router.post("/", async(req, res) => {
    const result = await dataDAO.create(req.body);
    responseUtil.sendResultOfQuery(res, result);
});

/**
 * Get the Data SQL table row by its name (primary key)
 * Example url: http://localhost:8081/dao/data/electricityPrice
 */
router.get("/:name", async(req, res) => {
    const result = await dataDAO.read(req.params.name);
    responseUtil.sendResultOfQuery(res, result);
});

/**
 * Get all rows from the Data SQL table
 * Example url: http://localhost:8081/dao/data
 */
router.get("/", async(req, res) => {
    const result = await dataDAO.readAll();
    responseUtil.sendResultOfQuery(res, result);
});

/**
 * Update row of the Data SQL table by its name(primary key)
 * Request body must contain name(key) and value fields, which are both strings
 * In response success of the operation (true or false) will be returned
 * Example url: http://localhost:8081/dao/data
 * Example request body:
 * {
 *     name: "electricityPrice", *primary key
 *     value: "5"
 * }
 */
router.put("/", async(req, res) => {
    const status = await dataDAO.update(req.body);
    responseUtil.sendStatusOfOperation(res, status);
});

/**
 * Delete row from the Data SQL table by its name(primary key)
 * In response success of the operation (true or false) will be returned
 * Example url: http://localhost:8081/dao/data/electricityPrice
 */
router.delete("/:name", async(req, res) => {
    const status = await dataDAO.delete(req.params.name);
    responseUtil.sendStatusOfOperation(res, status);
});

export default router;