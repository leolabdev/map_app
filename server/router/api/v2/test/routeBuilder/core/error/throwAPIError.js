import { SERVICE_ERROR_TYPE_NAME } from "../config.js";
import MultipleError from "./MultipleError.js";
import { convertServiceToAPIError } from "./convertServiceToAPIError.js";

export default function throwAPIError(e, message=null, location=null){
    if(e.type === SERVICE_ERROR_TYPE_NAME.description)
        throw convert(e, message, location);
    
    if(Array.isArray(e) && e[0].type === SERVICE_ERROR_TYPE_NAME.description){
        const errors = [];
        for(let i=0, l=e.length; i<l; i++){
            const error = convert(e[i], message, location)
            errors.push(error);
        }
        throw new MultipleError(errors);
    }
}

function convert(e, message, location) {
    const error = convertServiceToAPIError(e);
    if(message)
        error.message = message;
    if(location)
        error.location = location;

    return error;
}