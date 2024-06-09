import axios from "axios";
import {envHelper} from "../../helpers/envHelper";

/**
 * Deletes a human by the given humansType and username.
 *
 * @param {('client'|'manufacturer'|string)} humansType - The type of human to be deleted.
 * @param {string} username - The username of the human to delete.
 * @returns {Promise} - A promise that resolves to the result of the deletion operation.
 * @throws {Error} - if the deletion operation fails.
 */
export const deleteHumanByTypeAndUsername = async (humansType, username) => {
    try {
        const data = await axios.delete(`${envHelper.apiLink}/dao/${humansType}/${username}`);
        return data.data.result;
    }
    catch (error) {
        console.error(error);
    }
};