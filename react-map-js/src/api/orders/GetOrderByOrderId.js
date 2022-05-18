import axios from 'axios';

// async function for getting an order by orderId.
export const getOrderByOrderId = async (orderId) => {

    try {
        const data = await axios.get(`http://localhost:8081/dao/order/${orderId}`, {});
        return data.data.result;

    }
    catch (error) {
        console.log(error)
    }

}