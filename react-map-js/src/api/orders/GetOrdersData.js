// library witch helps us with calls
import axios from 'axios';

// async function for getting the Orders' data .
export const getOrdersData = async () => {

    try {
        const data = await axios.get(`http://localhost:8081/dao/order`, {});
        return data.data.result;

    }
    catch (error) {
        console.log(error)

    }

}