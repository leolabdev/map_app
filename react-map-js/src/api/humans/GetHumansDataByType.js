// library witch helps us with calls
import axios from 'axios';

// async function for getting the Clients/Manufacturers' data .
/**
 * Retrieves data from a specified endpoint based on the humansType.
 * @async
 * @param {('client'|'manufacturer'|string)} humansType - The type of human to be created.
 * @returns {Promise<Array>} - A promise that resolves to an array of human data.
 */
export const getHumansDataByType = async (humansType) => {

    try {
        const data = await axios.get(`http://localhost:8081/dao/${humansType}`, {});
        return data.data.result;

    }
    catch (error) {
        console.log(error)

    }

}