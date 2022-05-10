const axios = require("axios");

class AddressUtil{
    async getAddressByCoordinates(coords){
        if(coords != null && coords.length >= 2){
            const url = `http://localhost:8081/api/v1/address/geocode?lon=${coords[0]}&lat=${coords[1]}`;
            const addressResp = await axios.get(url);
            return addressResp.data;
        } else{
            return null;
        }

    }
}

module.exports.AddressUtil = AddressUtil;