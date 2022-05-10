const axios = require("axios");
const StringValidator = require('./StringValidator').StringValidator;

const stringValidator = new StringValidator();

class DaoUtil{
    getDataValues(respArr){
        if(respArr != null){
            let result = [];
            for(let i=0; i<respArr.length; i++){
                result[i] = respArr[i].dataValues;
            }
            return result;
        } else {
            return null;
        }
    }

    unpackOrderResp(orderResp){
        if(orderResp != null){
            let result = [];
            for(let i=0; i<orderResp.length; i++){
                let orderData =  orderResp[i].dataValues;
                const manufacturer = orderData.Manufacturer.dataValues;
                const client = orderData.Client.dataValues;
                const shipmentAddress = orderData.shipmentAddress.dataValues;
                const deliveryAddress = orderData.deliveryAddress.dataValues;

                orderData.Manufacturer = manufacturer;
                orderData.Client = client;
                orderData.shipmentAddress = shipmentAddress;
                orderData.deliveryAddress = deliveryAddress;

                result[i] = orderData;
            }
            return result;
        } else {
            return null;
        }
    }

    unpackOrder(order){
        const orderData = { orderId: order.orderId };
        const manufacturer = order.Manufacturer.dataValues;
        const client = order.Client.dataValues;
        const shipmentAddress = order.shipmentAddress.dataValues;
        const deliveryAddress = order.deliveryAddress.dataValues;

        orderData.Manufacturer = manufacturer;
        orderData.Client = client;
        orderData.shipmentAddress = shipmentAddress;
        orderData.deliveryAddress = deliveryAddress;

        return orderData;
    }

    async getAddressData(street, building, city) {
        if(street != null && building != null && city != null){
            const address = street + " " + building + ", " + city;
            return await axios.get(`http://localhost:8081/api/v1/address/search?text=` + address);
        } else{
            return null;
        }
    }

    async getAddressesDataFromDB(street, building, city){
        if(street != null && building != null && city != null){
            return await axios.get(`http://localhost:8081/dao/address/search/?city=${city}&street=${street}&building=${building}`);
        } else{
            return null;
        }
    }

    containNoNullArr(arr){
        if(arr != null){
            for(let i = 0; i < arr.length; i++){
                if(arr[i] == null)
                    return false;
            }

            return true;
        } else{
            return false;
        }
    }

    containNoBlankArr(arr){
        if(arr != null){
            for(let i = 0; i < arr.length; i++){
                if(arr[i] != null){
                    if(stringValidator.isBlank(arr[i]))
                        return false;
                }
            }

            return true;
        } else{
            return false;
        }
    }
}

module.exports.DaoUtil = DaoUtil;