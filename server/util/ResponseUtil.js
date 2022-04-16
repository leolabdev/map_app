class ResponseUtil {
    sendStatusOfOperation(res, status) {
        res.json({
            isSuccess: status
        });

        res.end();
    }

    sendResultOfQuery(res, result) {
        res.json({
            result: result
        });

        res.end();
    }

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