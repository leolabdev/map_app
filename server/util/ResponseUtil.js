/**
 * The class has functionality for setting responses to the client side
 */
class ResponseUtil {
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

    /**
     * The method sorts orders by shipment addresses
     * @param {Array.<Object>} ordersArr array of the order ORM objects
     * @returns {Object.<Array.<Object>>|null} sorted by shipment addresses order objects
     */
    sortOrdersByShipmentAddress(ordersArr){
        let result = null;
        if(ordersArr != null){
            result = {};
            for(let i=0; i<ordersArr.length; i++){
                const currentShipmentAddressId = ordersArr[i].shipmentAddressId;

                if(result[currentShipmentAddressId] === undefined){
                    result[currentShipmentAddressId] = [ ordersArr[i] ];
                } else{
                    result[currentShipmentAddressId].push(ordersArr[i]);
                }
            }
        }

        return result;
    }
}

module.exports.ResponseUtil = ResponseUtil;