import { API_MULTIPLE_ERROR } from "../config.js";


export default class MultipleError{
    /**
     * 
     * @param {APIError[]} errors 
     * @param {number=} status 
     */
    constructor(errors, status=null){
        this.errors = errors;
        this.status = status;
        this.type = API_MULTIPLE_ERROR;
    }
}