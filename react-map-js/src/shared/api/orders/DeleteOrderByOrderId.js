import axios from 'axios';
import {envHelper} from "../../helpers/envHelper";


/**
 * Deletes an order based on the given order ID.
 *
 * @async
 * @param {string} orderId - The ID of the order to be deleted.
 * @returns {Promise<any>} - A promise that resolves to the result of the deletion.
 * @throws {Error} - If an error occurs during the deletion process.
 */
export const deleteOrderByOrderId = async (orderId) => {
    try {
        const data = await axios.delete(`${envHelper.apiLink}/dao/order/${orderId}`);
        return data.data.result;
    } catch (error) {
        console.error(error);
    }
};