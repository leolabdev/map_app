import express from "express";
import ResponseUtil from "../../util/ResponseUtil.js";
import DaoUtil from "../../util/DaoUtil.js";
import ClientService from "../../service/ClientService.js";
import axios from "axios";

const router = express.Router();



const responseUtil = new ResponseUtil();
const daoUtil = new DaoUtil();

const clientDAO = new ClientService();
const host = process.env.API_HOST || "localhost";
const port = process.env.API_PORT || 8081;

/**
 * Create new client in the database
 * The post request must have at least username (it is primary key).
 * It is recommended also add to the request address of the client (it can be new or already registered in the database), since that information is used for creating orders.
 * In case, when address was not provided, it can be added by updating client data via put request.
 * ATTENTION: It is not possible to add client to the address via address route
 *
 * return (in response.data.result object) created client object (= all client data, witch was provided in the request object) or null if operation was not successful
 *
 * Examples of valid request objects (= request body). Examples 3 and 4 are recommended in the most situations:
 * 1. { clientUsername: "john" }
 *
 * 2. { clientUsername: "john",
 *      name: "John Smith"}
 *
 * 3. { clientUsername: "john",
 *      name: "John Smith",
 *      addressAdd: {
 *          city: "Helsinki",
 *          street: "Pohjoinen Rautatiekatu",
 *          building: "13",
 *          flat: 23        //optional
 *      } }
 *
 * 4. { clientUsername: "john",
 *      name: "John Smith",
 *      addressAdd: {
 *          city: "Helsinki",
 *          street: "Pohjoinen Rautatiekatu",
 *          building: "13",
 *          lat: 60.3453,   //optional
 *          lon: 40.1234    //optional
 *      } }
 */
router.post("/", async (req, res) => {
    const { addressAdd } = req.body;

    const clientResp = await clientDAO.create(req.body);

    if(!clientResp || !clientResp.dataValues || !addressAdd){
        responseUtil.sendResultOfQuery(res, clientResp);
        return;
    }

    const client = clientResp.dataValues;

    const addedAddressResp = await axios.post(`http://${host}:${port}/dao/address`, addressAdd);
    const address = addedAddressResp?.data.result;

    if(address == null){
        responseUtil.sendResultOfQuery(res, client);
        return;
    }

    await clientDAO.update({clientUsername: client.clientUsername, addressId: address.addressId});

    responseUtil.sendResultOfQuery(res, {...client, addressAdd: address});
});

/**
 * Read data of the queried client by its username from the database
 * return (in response.data.result object) its data including all the addresses, witch the client has or null if nothing was found
 *
 * Example of the get query path:
 * http://localhost:8081/dao/client/john
 */
router.get("/:clientUsername", async(req, res) => {
    const result = await clientDAO.read(req.params.clientUsername);
    responseUtil.sendResultOfQuery(res, result);
});

/**
 * Read data of all clients registered in the database
 * return (in response.data.result array) them data including all the addresses, witch each client has or null if nothing was found
 *
 * Example of the get query path:
 * http://localhost:8081/dao/client/
 */
router.get("/", async(req, res) => {
    const result = await clientDAO.readAll();
    responseUtil.sendResultOfQuery(res, result);
});

/**
 * Update existing client data in the database
 * The put request must have at least username (it is primary key) and fields, which should be updated.
 * ATTENTION: It is not possible to update client address via address route, since such path does not exist
 *
 * return (in response.data.isSuccess field) true if operation was not successful (= some rows in the database was changed) and false if not
 *
 * Examples of valid request objects (= request body). In 2. and 3. examples you can also provide lat, lon and flat(optional):
 *
 * 1. { clientUsername: "john",
 *      name: "John Smith",
 *      addressId: 1}
 *
 * 2. { clientUsername: "john",
 *      name: "John Smith",
 *      addressAdd: {
 *          city: "Helsinki",
 *          street: "Pohjoinen Rautatiekatu",
 *          building: "13"
 *      } }
 *
 * 3. { clientUsername: "john",
 *      name: "John Smith",
 *      addressIdDelete: 1 }   //address reference to be nulled in Client table
 */
router.put("/", async(req, res) => {
    const { addressAdd } = req.body;

    let request = {...req.body};

    if (addressAdd != null) {
        const addressResp = await axios.post(`http://${host}:${port}/dao/address`, addressAdd);
        request["addressId"] = addressResp?.data.addressId;
    }

    const status = await clientDAO.update(request);
    responseUtil.sendStatusOfOperation(res, status);
});

/**
 * Delete data of the queried client from the database
 * return (in response.data.isSuccess field) true if it was deleted (= affected rows count is more than 0) or false if not
 *
 * Example of delete query path:
 * http://localhost:8081/dao/client/john
 */
router.delete("/:clientUsername", async(req, res) => {
    const status = await clientDAO.delete(req.params.clientUsername);
    responseUtil.sendStatusOfOperation(res, status);
});

export default router;