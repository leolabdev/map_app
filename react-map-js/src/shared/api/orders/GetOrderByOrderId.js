import axios from 'axios';
import {envHelper} from "../../helpers/envHelper";

/**
 * Async function to get an order by orderId.
 *
 * @param {string} orderId - The order Id.
 * @returns {Promise} - A promise that resolves to the data of the requested order.
 * @throws {Error} - if the data retrieval operation fails.
 */
export const getOrderByOrderId = async (orderId) => {
    try {
        const data = await axios.get(`${envHelper.apiLink}/dao/order/${orderId}`);
        return data.data.result;
    }
    catch (error) {
        console.error(error);
    }
};