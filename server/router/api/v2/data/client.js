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
});

new RouteBuilder('/', Method.GET)
    .authenticate()
    .addController(getProfileClients).attachToRouter(router);
async function getProfileClients(req, res) {
    const profileId = req[config.authFieldName]?.id;
    const clients = clientService.readAllByProfileId(profileId);
    if(isRespServiceError(clients))
        return throwAPIError(clients);

    if(!clients)
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
    if(isRespServiceError(client))
        return throwAPIError(client);

    if(!client)
        throw new APIError({
            reason: ErrorReason.NOT_FOUND, 
            message: 'Could not find the client'
        });

    return client;
}

//TODO: bug with validate
router.put('/', authenticate(config.authFieldName), serializeReq(config.respFieldName, ClientUpdateReq), validate(clientUpdate), (req, res) => {
    console.log('body', req.body);
    const reqFn = async function(){
        const city = req.body['city'];
        const street = req.body['street'];
        const building = req.body['building'];
        const profileId = req[config.authFieldName].id;

        //If address shouldn't be updated
        if(!city && !street && !building){
            const client = await clientService.create({...req.body, profileId});
            return sendServiceResp(client, res);
        }

        let addressResp;
        //If whole address need to be updated
        if(city && street && building){
            addressResp = await addressService.validate({city, street, building});
            if(isRespServiceError(addressResp))
                return sendServiceResp(addressResp, res);
        } else {
            //If only part of the address need to be updated
            const existingClient = await clientService.readOneByIdAndProfileId(req.id, profileId);
            if(isRespServiceError(existingClient))
                return sendServiceResp(serviceResp, existingClient);

            if(!existingClient)
                return sendServiceResp(serviceResp, new APIError({
                    reason: ErrorReason.NOT_FOUND, message: 'Client does not exists', 
                    location: ErrorLocation.BODY, status: 404
                }));

            const newAddress = {
                city: city ?? existingClient['city'], 
                street: street ?? existingClient['street'], 
                building: building ?? existingClient['building']
            }

            addressResp = await addressService.validate(newAddress);
            if(isRespServiceError(addressResp))
                return sendServiceResp(addressResp, res);
        }

        const {lon, lat} = addressResp;
        const client = await clientService.create({...req.body, lon, lat, profileId});
        sendServiceResp(client, res);
    }

    validateQueue.addRequest(reqFn);
});

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

function sendServiceResp(serviceResp, res){
    if(isRespServiceError(serviceResp)){
        let errors = [];
        if(Array.isArray(serviceResp)){
            for(let i=0, l=resp.length; i<l; i++)
                errors.push(convertServiceToAPIError(serviceResp[i]));
        } else
            errors[0] = convertServiceToAPIError(serviceResp);

        const status = errors[0]?.status;
        return res.status(status ?? 500).send({[config.respErrorFieldName]: errors});
    }

    if(Array.isArray(serviceResp))
        return res.send({[config.respFieldName]: serviceResp});;
    
    res.send({[config.respFieldName]: serviceResp});
}

export default router;