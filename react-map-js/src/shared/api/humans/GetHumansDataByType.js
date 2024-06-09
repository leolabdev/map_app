import axios from 'axios';
import {envHelper} from "../../helpers/envHelper";

/**
 * Retrieves data from a specified endpoint based on the humansType.
 * @async
 * @param {('client'|'manufacturer'|string)} humansType - The type of human to be created.
 * @returns {Promise<Array>} - A promise that resolves to an array of human data.
 */
export const getHumansDataByType = async (humansType) => {
    try {
        const data = await axios.get(`${envHelper.apiLink}/dao/${humansType}`);
        return data.data.result;
    }
    catch (error) {
        console.error(error);
    }
};