/**
 * The class has functionality for setting responses to the client side
 */
export default class ResponseUtil {
    /**
     * The method sends status of the executed operation.
     * @param res response objects
     * @param {boolean} status status of the executed operation
     */
    sendStatusOfOperation(res, status) {
        res.json({
            isSuccess: status
        });

        res.end();
    }

    /**
     * The method sends result of the executed operation or response data to the client side request, which can be anything
     * @param res response objects
     * @param {*} result result need to be sent
     */
    sendResultOfQuery(res, result) {
        res.json({
            result: result
        });

        res.end();
    }
}