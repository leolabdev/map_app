import express from "express";
import axios from "axios";
import ResponseUtil from "../../../../util/ResponseUtil.js";
import ClientService from "../../../../service/ClientService.js";
import { RouteBuilder } from "../routeBuilder/RouteBuilder.js";
import { ClientCreateReq, ClientUpdateReq } from "../routeBuilder/rules/serialization/client.js";
import { clientCreate, clientUpdate } from "../routeBuilder/rules/validation/client.js";
import { Method } from "../routeBuilder/core/enums/Method.js";
import { validateQueue } from "../../../../util/throttlingQueue.js";
import AddressService from "../../../../service/AddressService.js";
import { config } from "../routeBuilder/core/config.js";
import { convertServiceToAPIError } from "../routeBuilder/core/error/convertServiceToAPIError.js";
import isRespServiceError from "../routeBuilder/core/service/validateInput.js";
import { serializeReq } from "../routeBuilder/core/pipelineHandlers/serializeReq.js";
import validate from "../routeBuilder/core/pipelineHandlers/validate.js";
import { authenticate } from "../routeBuilder/core/pipelineHandlers/authenticate.js";
import { APIError } from "../routeBuilder/core/error/APIError.js";
import { ErrorReason } from "../routeBuilder/core/error/ErrorReason.js";
import { ErrorLocation } from "../routeBuilder/core/error/ErrorLocation.js";
import { idField } from "../routeBuilder/rules/validation/idField.js";
import throwAPIError from "../routeBuilder/core/error/throwAPIError.js";
import { catchErrors } from "../routeBuilder/core/pipelineHandlers/catchErrors.js";
import { formatResponse } from "../routeBuilder/core/pipelineHandlers/formatResponse.js";
import { ServiceError } from "../routeBuilder/core/service/dataExtractors/error/ServiceError.js";
import { SEReason } from "../routeBuilder/core/service/dataExtractors/error/SEReason.js";

const router = express.Router();

const clientService = new ClientService();
const addressService = new AddressService();


router.post('/', authenticate(config.authFieldName), serializeReq(config.respFieldName, ClientCreateReq), validate(clientCreate), (req, res) => {
    const reqFn = async function(){
        const {city, street, building} = req.body;
        const resp = await addressService.validate({city, street, building});
        if(isRespServiceError(resp))
            return sendServiceResp(resp, res);
    
        const {lon, lat} = resp;
        const profileId = req[config.authFieldName].id;
        const client = await clientService.create({...req.body, lon, lat, profileId});
        sendServiceResp(client, res);
    }

    validateQueue.addRequest(reqFn);
}, catchErrors(config.respErrorFieldName), formatResponse(config.respFieldName, config.respErrorFieldName, 201));

new RouteBuilder('/', Method.GET)
    .authenticate()
    .addController(getProfileClients).attachToRouter(router);
async function getProfileClients(req, res) {
    const profileId = req[config.authFieldName]?.id;
    const clients = await clientService.readAllByProfileId(profileId);
    if(!clients || clients?.length === 0)
        throw new APIError({
            reason: ErrorReason.NOT_FOUND, 
            message: 'Could not find any clients'
        });

    if(isRespServiceError(clients))
        return throwAPIError(clients);

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

    if(isRespServiceError(client))
        return throwAPIError(client);

    return client;
}


router.put('/', authenticate(config.authFieldName), serializeReq(config.respFieldName, ClientUpdateReq), validate(clientUpdate), (req, res) => {
    const reqFn = async function(){
        const profileId = req[config.authFieldName].id;
        const {id, city, street, building} = req.body;

        const existingClient = await clientService.readOneByIdAndProfileId(id, profileId);
        if(isRespServiceError(existingClient))
            return sendServiceResp(existingClient, res);

        if(!existingClient)
            return sendServiceResp(new ServiceError({
                reason: SEReason.NOT_FOUND, message: 'Client does not exists'
            }), res);

        //If address shouldn't be updated
        if(!city && !street && !building){
            const client = await clientService.update({...req.body, profileId});
            return sendServiceResp(client, res);
        }

        const newAddress = {
            city: city ?? existingClient['city'], 
            street: street ?? existingClient['street'], 
            building: building ?? existingClient['building']
        }
        const addressResp = await addressService.validate(newAddress);
        if(isRespServiceError(addressResp))
            return sendServiceResp(addressResp, res);

        if(!addressResp)
            return sendServiceResp(new ServiceError({ reason: SEReason.NOT_FOUND, message: 'Could not find the address' }), res);

        const {lon, lat} = addressResp;
        const client = await clientService.update({...req.body, lon, lat});
        sendServiceResp(client, res, 204);
    }

    validateQueue.addRequest(reqFn);
}, catchErrors(config.respErrorFieldName), formatResponse(config.respFieldName, config.respErrorFieldName, 204));

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
    if(isRespServiceError(isSuccess))
        return throwAPIError(isSuccess);

    if(!isSuccess)
        throw new APIError({
            reason: ErrorReason.UNEXPECTED, message: 'Could not delete a client'
        });

    return isSuccess;
}

function sendServiceResp(serviceResp, res, successStatus=200){
    if(isRespServiceError(serviceResp)){
        let errors = [];
        if(Array.isArray(serviceResp)){
            for(let i=0, l=serviceResp.length; i<l; i++)
                errors.push(convertServiceToAPIError(serviceResp[i]));
        } else
            errors[0] = convertServiceToAPIError(serviceResp);

        const status = errors[0]?.status;
        return res.status(status ?? 500).send({[config.respErrorFieldName]: errors});
    }

    if(successStatus === 204)
        return res.status(successStatus).send();

    if(Array.isArray(serviceResp))
        return res.status(successStatus).send({[config.respFieldName]: serviceResp});;
    
    res.status(successStatus).send({[config.respFieldName]: serviceResp});
}

export default router;