// library witch helps us with calls
import axios from 'axios';

// async function for getting the Clients/Manufacturers' data .
export const getHumansData = async (humansType) => {

    try {
        const data = await axios.get(`http://localhost:8081/dao/${humansType}`, {});
        return data.data.result;

    }
    catch (error) {
        console.log(error)

    }

}