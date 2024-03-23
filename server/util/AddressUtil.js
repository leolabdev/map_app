import axios from "axios";


const host = process.env.DATABASE_HOST || "localhost";
const port = process.env.DATABASE_PORT || 8081;

/**
 * This class has functionality for helping work with addresses
 */
export default class AddressUtil{
    /**
     * The method converts point coordinates (lon, lat) to the street address.
     * @param {Array.<number>} coords array with the coordinates in form [lon, lat]
     * @returns {Promise<null|any>} object, containing street address(es) found for this coordinate
     */
    async getAddressByCoordinates(coords){
        if(coords != null && coords.length >= 2){
            const url = `http://${host}:${port}/api/v1/address/geocode?lon=${coords[0]}&lat=${coords[1]}`;
            const addressResp = await axios.get(url);
            return addressResp.data;
        } else{
            return null;
        }
    }
}