import axios from "axios";

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
        const data = await axios.delete(`http://localhost:8081/dao/${humansType}/${username}`, {});
        return data.data.result;
    }
    catch (error) {
        console.log(error)
    }
}