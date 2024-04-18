export class APIError{
    /**
     *
     * @param {ErrorReason} reason
     * @param {string} message
     * @param {string} endpoint
     * @param {string?} field
     */
    constructor(reason, message, endpoint, field=''){
        this.reason = reason;
        this.message = message;
        this.endpoint = endpoint;
        this.field = field;
    }
}