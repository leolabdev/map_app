import express from "express";
import { autocompleteQueue, reverseQueue, validateQueue } from "../../../../util/throttlingQueue.js";
import { catchErrors } from "../routeBuilder/core/pipelineHandlers/catchErrors.js";
import { addReqLimit } from "../routeBuilder/core/pipelineHandlers/addReqLimit..js";
import { formatResponse } from "../routeBuilder/core/pipelineHandlers/formatResponse.js";
import AddressService from "../../../../service/AddressService.js";
import isRespServiceError from "../routeBuilder/core/service/validateInput.js";
import { convertServiceToAPIError } from "../routeBuilder/core/error/convertServiceToAPIError.js";
import { config } from "../routeBuilder/core/config.js";
import validate from "../routeBuilder/core/pipelineHandlers/validate.js";
import { addressAutocomplete, addressReverse, addressValidate } from "../routeBuilder/rules/validation/address.js";


const router = express.Router();
const addressService = new AddressService();


router.get('/validate', validate(addressValidate, 'query'), async (req, res) => {
    const reqFn = async function(){
        const resp = await addressService.validate(req.query);
        sendServiceResp(resp, res);
    }
    validateQueue.addRequest(reqFn);
});


router.get('/reverse', validate(addressReverse, 'query'), async (req, res, next) => {
    const reqFn = async function(){
        const resp = await addressService.reverse(req.query);
        sendServiceResp(resp, res);
    }

    reverseQueue.addRequest(reqFn);
}, catchErrors(), formatResponse());

//503 error if there are no requests left for external APIs
//429 error if user has send too many requests
router.get('/autocomplete', addReqLimit(3000), validate(addressAutocomplete, 'query'), async (req, res, next) => {
    const reqFn = async function(){
        const resp = await addressService.autocomplete(req.query);
        sendServiceResp(resp, res);
    }

    autocompleteQueue.addRequest(reqFn);
});

function sendServiceResp(serviceResp, res){
    if(isRespServiceError(serviceResp)){
        const apiError = convertServiceToAPIError(serviceResp);
        return res.status(apiError.status).send({[config.respErrorFieldName]: [apiError]});
    }
    
    res.send({[config.respFieldName]: serviceResp});
}

export default router;