const express = require('express');
const router = express.Router();

const ResponseUtil = require('../../util/ResponseUtil').ResponseUtil;
const AddressDAO = require("../../DAO/AddressDAO").AddressDAO;
const DaoUtil = require("../../util/DaoUtil").DaoUtil;

const daoUtil = new DaoUtil();
const responseUtil = new ResponseUtil();

const addressDAO = new AddressDAO();

/**
 * Create new address in the database
 * The post request must have at least city, street and building fields.
 * ATTENTION: It is not possible to add client to the address via this route
 *
 * return (in response.data.result object) created address object (= all address data, witch was provided in the request object) or null if operation was not successful
 *
 * Example of a valid request objects (= request body).
 * {
 *      city: "Helsinki",
 *      street: "Pohjoinen Rautatiekatu",
 *      building: "13",
 *      flat: 23,       //optional
 *      lat: 60.3453,   //optional
 *      lon: 40.1234    //optional
 *   }
 */
router.post("/", async(req, res) => {
    let { street, building, city, lon, lat } = req.body;
    const existingAddresses = await daoUtil.getAddressesDataFromDB(street, building, city);

    //if such address is not exists, create it
    if (existingAddresses != null && existingAddresses.data.result.length === 0) {
        //if coordinates are not provided
        if (lon == null || lat == null) {
            //get coordinates of the street address
            const addressData = await daoUtil.getAddressData(street, building, city);

            if (await addressData != null) {
                const coordinates = addressData.data[0].coordinates;
                req.body.lon = coordinates.lon;
                req.body.lat = coordinates.lat;
                const result = await addressDAO.create(req.body);
                responseUtil.sendResultOfQuery(res, result);
            } else {
                responseUtil.sendResultOfQuery(res, null);
            }
        } else {
            const result = await addressDAO.create(req.body);
            responseUtil.sendResultOfQuery(res, result);
        }
    } else {
        responseUtil.sendResultOfQuery(res, existingAddresses.data.result[0]);
    }
});

/**
 * Read data of the queried address by its id from the database
 * return (in response.data.result object) its data NOT including all the clients/manufacturers information, which have this address
 *
 * Example of the get query path:
 * http://localhost:8081/dao/address/read/1
 */
router.get("/read/:addressId", async(req, res) => {
    const result = await addressDAO.read(req.params.addressId);
    responseUtil.sendResultOfQuery(res, result);
});

/**
 * Read data of the all addresses from the database
 * return (in response.data.result object) them data NOT including all the clients/manufacturers information, which have this address
 *
 * Example of the get query path:
 * http://localhost:8081/dao/address
 */
router.get("/", async(req, res) => {
    const result = await addressDAO.readAll();
    responseUtil.sendResultOfQuery(res, result);
});

/**
 * Read data of the all addresses from the database, which are suitable for provided query
 * return (in response.data.result object) them data NOT including all the clients/manufacturers information, which have this address
 *
 * Example of the get query path:
 * http://localhost:8081/dao/address/search?city=Helsinki&street=Rauhankatu
 */
router.get("/search", async(req, res) => {
    const result = await addressDAO.search(req.query);
    responseUtil.sendResultOfQuery(res, result);
});

//No need for updating address data through AddressDAO
/*router.put("/", async (req, res) => {
    let {street, building, city} = req.body;

    //if there is a changes in street address, update lat, lon as well
    if(street != null || building != null || city != null){
        //get coordinates of the street address
        const addressData = await daoUtil.getAddressData(street, building, city);

        if(await addressData != null){
            if(addressData.data.length === 1){
                const coordinates = addressData.data[0].coordinates;
                req.body.lon = coordinates.lon;
                req.body.lat = coordinates.lat;
                const status = await addressDAO.create(req.body);
                responseUtil.sendStatusOfOperation(res, status);
            } else{
                console.error("address: Multiple addresses for this query was found, DB will not be updated");
                responseUtil.sendStatusOfOperation(res, false);
            }
        } else{
            responseUtil.sendStatusOfOperation(res, false);
        }
    } else{
        const status = await addressDAO.update(req.body);
        responseUtil.sendStatusOfOperation(res, status);
    }
});*/

//No need to delete address through, when deleting client/manufacturer, if nobody is connected to the address it will be removed automatically
/*
router.delete("/:addressId", async(req, res) => {
    const status = await addressDAO.delete(req.params.addressId);
    responseUtil.sendStatusOfOperation(res, status);
});*/

module.exports = router;