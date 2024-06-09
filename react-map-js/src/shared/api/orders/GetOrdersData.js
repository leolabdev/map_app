// library witch helps us with calls
import axios from 'axios';
import {envHelper} from "../../helpers/envHelper";

/**
 * Async function to get order data.
 *
 * @returns {Promise} - A promise that resolves to the data of all orders.
 * @throws {Error} - if the data retrieval operation fails.
 */
export const getOrdersData = async () => {
    try {
        const data = await axios.get(`${envHelper.apiLink}/dao/order`);
        return data.data.result;
    }
    catch (error) {
        console.error(error);
    }
};