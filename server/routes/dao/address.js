import express from "express";
import DaoUtil from "../../util/DaoUtil.js";
import ResponseUtil from "../../util/ResponseUtil.js";
import AddressDAO from "../../DAO/AddressDAO.js";


const router = express.Router();


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
router.post("/", async (req, res) => {
    let { street, building, city, lon, lat } = req.body;

    if(!daoUtil.containNoNullArr([city, street, building]) || !daoUtil.containNoBlankArr([city, street, building])){
        console.log("address: wrong parameters provided");
        responseUtil.sendResultOfQuery(res, null);
        return;
    }

    try{
        const existingAddresses = await daoUtil.getAddressesDataFromDB(street, building, city);

        if (existingAddresses.data.result.length !== 0){
            responseUtil.sendResultOfQuery(res, existingAddresses.data.result[0]);
            return;
        }

        //if such address is not exists, create it
        if (lon != null || lat != null) {
            const result = await addressDAO.create(req.body);
            responseUtil.sendResultOfQuery(res, result);
            return;
        }

        //if coordinates are not provided
        //get coordinates of the street address
        const addressData = await daoUtil.getAddressData(street, building, city);

        if(addressData == null){
            responseUtil.sendResultOfQuery(res, null);
            return;
        }

        const coordinates = addressData.data[0].coordinates;
        req.body.lon = coordinates.lon;
        req.body.lat = coordinates.lat;
        const result = await addressDAO.create(req.body);
        responseUtil.sendResultOfQuery(res, result);
    } catch (e) {
        responseUtil.sendResultOfQuery(res, null);
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

export default router;