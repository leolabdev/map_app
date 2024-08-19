import express from "express";
import { autocompleteQueue, reverseQueue, validateQueue } from "../../../../util/throttlingQueue.js";
import { catchErrors } from "../routeBuilder/core/pipelineHandlers/catchErrors.js";
import { addReqLimit } from "../routeBuilder/core/pipelineHandlers/addReqLimit.js";
import { formatResponse } from "../routeBuilder/core/pipelineHandlers/formatResponse.js";
import AddressService from "../../../../service/AddressService.js";
import validate from "../routeBuilder/core/pipelineHandlers/validate.js";
import { addressAutocomplete, addressReverse, addressValidate } from "../routeBuilder/rules/validation/address.js";
import { registerController } from "../routeBuilder/core/util/registerController.js";
import { determineResError } from "../routeBuilder/core/pipelineHandlers/determineResError.js";


const router = express.Router();
const addressService = new AddressService();


router.get('/validate', validate(addressValidate, 'query'), async (req, res, next) => {
    const reqFn = async function(){
        registerController(res, next, () => {
            return addressService.validate(req.query);
        });
    }
    validateQueue.addRequest(reqFn);
}, determineResError(), catchErrors(), formatResponse());


router.get('/reverse', validate(addressReverse, 'query'), async (req, res, next) => {
    const reqFn = async function(){
        registerController(res, next, () => {
            return addressService.reverse(req.query);
        });
    }

    reverseQueue.addRequest(reqFn);
}, determineResError(), catchErrors(), formatResponse());

//503 error if there are no requests left for external APIs
//429 error if user has send too many requests
router.get('/autocomplete', addReqLimit(3000), validate(addressAutocomplete, 'query'), async (req, res, next) => {
    const reqFn = async function(){
        registerController(res, next, () => {
            return addressService.autocomplete(req.query);
        });
    }

    autocompleteQueue.addRequest(reqFn);
}, determineResError(), catchErrors(), formatResponse());

export default router;