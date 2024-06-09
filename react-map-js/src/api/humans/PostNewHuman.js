import axios from 'axios';

/**
 * Sends a POST request to create a new human of the given type.
 *
 * @async
 * @param {('client'|'manufacturer'|string)} humansType - The type of human to be created.
 * @param {object} post - The data for the new human.
 * @param {string} post.username - The username of the human.
 * @param {string} post.name - The name of the human.
 * @param {object} post.addressAdd - The address of the human.
 * @param {string} post.addressAdd.city - The city of the address.
 * @param {string} post.addressAdd.street - The street of the address.
 * @param {string} post.addressAdd.building - The building of the address.
 * @returns {Promise<void>} A promise that resolves when the request is sent successfully.
 */
export const postNewHuman = async (humansType, post) => {
    try {
        const request = {
            username: post.username,
            name: post.name,
            addressAdd: {
                city: post.addressAdd.city,
                street: post.addressAdd.street,
                building: post.addressAdd.building,
            }
        };
        if (humansType === "client") {
            if (request.username) {
                request.clientUsername = request.username;
                delete request.username
            } else if (request.manufacturerUsername) {
                request.clientUsername = request.manufacturerUsername;
                delete request.manufacturerUsername
            }
        } else if (humansType === "manufacturer") {
            if (request.username) {
                request.manufacturerUsername = request.username;
                delete request.username
            } else if (request.clientUsername) {
                request.manufacturerUsername = request.clientUsername;
                delete request.clientUsername
            }
        }
        await axios.post(`http://localhost:8081/dao/${humansType}`, {...request});

    } catch (error) {
        console.log(error)
    }
}