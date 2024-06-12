import axios from 'axios';
import {envHelper} from "../../helpers/envHelper";

/**
 * Async function to post a new order.
 *
 * @param {Object} post - The data of new order to be posted.
 * @returns {Promise} - A promise that resolves to the result of the post operation.
 * @throws {Error} - if the post operation fails.
 */
export const postNewOrder = async (post) => {
    try {
        const request = {
            manufacturerUsername: post.manufacturerUsername,
            clientUsername: post.clientUsername,
            shipmentAddressId: post.shipmentAddressId,
            deliveryAddressId: post.deliveryAddressId
        };

        const resp = await axios.post(`${envHelper.apiLink}/dao/order`, {
            ...request
        });
        return resp.data;

    } catch (error) {
        console.error(error);
    }
};


