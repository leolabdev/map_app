const express = require('express');
const router = express.Router();

const ResponseUtil = require('../../util/ResponseUtil').ResponseUtil;
const OrderDataDAO = require('../../DAO/OrderDataDAO').OrderDataDAO;

const responseUtil = new ResponseUtil();
const orderDataDAO = new OrderDataDAO();

/**
 * Create new order in the database
 * The post request must have all the fields (except orderId).
 *
 * return (in response.data.result object) created order object (= all client data, which was provided in the request object) or null if operation was not successful
 * Example of the get query path:
 * http://localhost:8081/dao/order
 * Example of a valid request object (= request body):
 * 1. {
 *      manufacturerUsername: 'john',
 *      clientUsername: 'jane',
 *      shipmentAddressId: 1,
 *      deliveryAddressId: 2
 *    }
 *
 */
router.post("/", async(req, res) => {
    const result = await orderDataDAO.create(req.body);
    responseUtil.sendResultOfQuery(res, result);
});

/**
 * Read data of the queried order by its id from the database
 * return (in response.data.result object) its data including client, manufacturer, delivery and shipment addresses information
 *
 * Example of the get query path:
 * http://localhost:8081/dao/order/1
 */
router.get("/:orderId", async(req, res) => {
    const result = await orderDataDAO.read(req.params.orderId);
    responseUtil.sendResultOfQuery(res, result);
});

/**
 * Read all the data of the all orders from the database
 * return (in response.data.result object) them data including client, manufacturer, delivery and shipment addresses information
 *
 * Example of the get query path:
 * http://localhost:8081/dao/order
 */
router.get("/", async(req, res) => {
    const result = await orderDataDAO.readAll();
    responseUtil.sendResultOfQuery(res, result);
});

/**
 * Update the existing order in the database
 * The put request must have at least orderId (primary key) field and fields to be changed.
 *
 * return (in response.data.isSuccess field) true if operation was not successful (= some rows in the database was changed) and false if not
 *
 * Example of a valid request object (= request body):
 * 1. {
 *      orderId: 1,
 *      manufacturerUsername: 'john',   //optional
 *      clientUsername: 'jane',         //optional
 *      shipmentAddressId: 1,           //optional
 *      deliveryAddressId: 2            //optional
 *    }
 */
router.put("/", async(req, res) => {
    const status = await orderDataDAO.update(req.body);
    responseUtil.sendStatusOfOperation(res, status);
});

/**
 * Delete data of the queried order by its id from the database
 * return (in response.data.isSuccess field) true if it was deleted (= affected rows count is more than 0) or false if not
 *
 * Example of the delete query path:
 * http://localhost:8081/dao/order/1
 */
router.delete("/:orderId", async(req, res) => {
    const status = await orderDataDAO.delete(req.params.orderId);
    responseUtil.sendStatusOfOperation(res, status);
});

module.exports = router;