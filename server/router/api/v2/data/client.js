import express from "express";
import ClientService from "../../../../service/ClientService.js";
import { RouteBuilder } from "../routeBuilder/RouteBuilder.js";
import { ClientCreateReq, ClientUpdateReq } from "../routeBuilder/rules/serialization/client.js";
import { clientCreate, clientUpdate } from "../routeBuilder/rules/validation/client.js";
import { Method } from "../routeBuilder/core/enums/Method.js";
import { validateQueue } from "../../../../util/throttlingQueue.js";
import AddressService from "../../../../service/AddressService.js";
import { config } from "../routeBuilder/core/config.js";
import isRespServiceError from "../routeBuilder/core/service/validateInput.js";
import { serializeReq } from "../routeBuilder/core/pipelineHandlers/serializeReq.js";
import validate from "../routeBuilder/core/pipelineHandlers/validate.js";
import { authenticate } from "../routeBuilder/core/pipelineHandlers/authenticate.js";
import { APIError } from "../routeBuilder/core/error/APIError.js";
import { ErrorReason } from "../routeBuilder/core/error/ErrorReason.js";
import { idField } from "../routeBuilder/rules/validation/idField.js";
import throwAPIError from "../routeBuilder/core/error/throwAPIError.js";
import { catchErrors } from "../routeBuilder/core/pipelineHandlers/catchErrors.js";
import { formatResponse } from "../routeBuilder/core/pipelineHandlers/formatResponse.js";
import { registerController } from "../routeBuilder/core/util/registerController.js";
import isServiceError from "../routeBuilder/core/service/dataExtractors/error/isServiceError.js";
import { determineResError } from "../routeBuilder/core/pipelineHandlers/determineResError.js";

const router = express.Router();

const clientService = new ClientService();
const addressService = new AddressService();


router.post('/', authenticate(config.authFieldName), serializeReq(config.respFieldName, ClientCreateReq), validate(clientCreate), (req, res, next) => {
    const reqFn = async function(){
        registerController(res, next, async () => {
            const {city, street, building} = req.body;
            const resp = await addressService.validate({city, street, building});
            if(isServiceError(resp))
                return resp;
        
            const {lon, lat} = resp;
            const profileId = req[config.authFieldName].id;
            return await clientService.create({...req.body, lon, lat, profileId});
        });
    }

    validateQueue.addRequest(reqFn);
}, determineResError(), catchErrors(), formatResponse(null, null, 201));

new RouteBuilder('/', Method.GET)
    .authenticate()
    .paginate()
    .addController(getProfileClients).attachToRouter(router);
async function getProfileClients(req, res) {
    const profileId = req[config.authFieldName]?.id;
    const {pagination} = req;
    const clients = await clientService.readAllByProfileId(profileId, pagination);
    if(!clients || clients?.length === 0)
        throw new APIError({
            reason: ErrorReason.NOT_FOUND, 
            message: 'Could not find any clients'
        });

    return clients;
}

new RouteBuilder('/:id', Method.GET)
    .authenticate()
    .validate(idField, 'params')
    .addController(getClient).attachToRouter(router);
async function getClient(req, res) {
    const profileId = req[config.authFieldName]?.id;
    const client = await clientService.readOneByIdAndProfileId(req.params.id, profileId);
    if(!client)
        throw new APIError({
            reason: ErrorReason.NOT_FOUND, 
            message: 'Could not find the client'
        });

    return client;
}


router.put('/', authenticate(config.authFieldName), serializeReq(config.respFieldName, ClientUpdateReq), validate(clientUpdate), (req, res, next) => {
    const reqFn = async function(){
        registerController(res, next, async () => {
            const profileId = req[config.authFieldName].id;
            const {id, city, street, building} = req.body;

            const existingClient = await clientService.readOneByIdAndProfileId(id, profileId);
            if(isServiceError(existingClient))
                return existingClient;

            if(!existingClient)
                return new APIError({
                    reason: ErrorReason.NOT_FOUND, message: 'Client does not exists'
                });

            //If address shouldn't be updated
            if(!city && !street && !building)
                return await clientService.update({...req.body, profileId});

            const newAddress = {
                city: city ?? existingClient['city'], 
                street: street ?? existingClient['street'], 
                building: building ?? existingClient['building']
            }
            const addressResp = await addressService.validate(newAddress);
            if(isServiceError(addressResp))
                return addressResp;

            if(!addressResp)
                return new APIError({ reason: ErrorReason.NOT_FOUND, message: 'Could not find the address' });

            const {lon, lat} = addressResp;
            return clientService.update({...req.body, lon, lat});
        });
    }

    validateQueue.addRequest(reqFn);
}, determineResError(), catchErrors(), formatResponse(null, null, 204));

new RouteBuilder('/:id', Method.DELETE)
    .authenticate()
    .validate(idField, 'params')
    .successStatus(204)
    .addController(deleteClient).attachToRouter(router);
async function deleteClient(req, res) {
    const profileId = req[config.authFieldName].id;

    const client = clientService.readOneByIdAndProfileId(req.params.id, profileId);
    if(!client || isRespServiceError(client))
        return throwAPIError(client);

    const isSuccess = await clientService.delete(req.params.id);
    if(isServiceError(isSuccess))
        return isSuccess;

    if(!isSuccess)
        throw new APIError({
            reason: ErrorReason.UNEXPECTED, message: 'Could not delete a client'
        });

    return isSuccess;
}

export default router;