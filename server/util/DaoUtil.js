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

    async getAddressData(street, building, city) {
        if(street != null && building != null && city != null){
            const address = street + " " + building + ", " + city;
            return await axios.get(`http://localhost:8081/api/v1/address/?search=` + address);
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