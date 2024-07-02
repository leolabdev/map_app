import express from "express";
import axios from "axios";
import ResponseUtil from "../../../../util/ResponseUtil.js";
import ClientService from "../../../../service/ClientService.js";
import { RouteBuilder } from "../routeBuilder/RouteBuilder.js";
import { ClientCreateReq } from "../routeBuilder/rules/serialization/client.js";
import { clientCreate } from "../routeBuilder/rules/validation/client.js";
import { Method } from "../routeBuilder/core/enums/Method.js";

const router = express.Router();

const responseUtil = new ResponseUtil();
const clientService = new ClientService();
const host = process.env.API_HOST || "localhost";
const port = process.env.API_PORT || 8081;



new RouteBuilder('/', Method.POST)
    .serializeReq(ClientCreateReq)
    .validate(clientCreate)
    .addController(createClient).attachToRouter(router);
async function createClient(req, res) {
    const client = await clientService.create(req.body);
    if(isRespServiceError(client))
        return throwAPIError(client, null, ErrorLocation.BODY);

    if(!client)
        throw new APIError({reason: ErrorReason.UNEXPECTED, message: 'Could not create a client'});

    

    return client;
}

/**
 * Read data of the queried client by its username from the database
 * return (in response.data.result object) its data including all the addresses, witch the client has or null if nothing was found
 *
 * Example of the get query path:
 * http://localhost:8081/dao/client/john
 */
router.get("/:clientUsername", async(req, res) => {
    const result = await clientService.read(req.params.clientUsername);
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
    const result = await clientService.readAll();
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

    const status = await clientService.update(request);
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
    const status = await clientService.delete(req.params.clientUsername);
    responseUtil.sendStatusOfOperation(res, status);
});

export default router;