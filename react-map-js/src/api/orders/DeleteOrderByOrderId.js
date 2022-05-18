import axios from 'axios';

export const deleteOrderByOrderId = async (orderId) => {

    try {
        const data = await axios.delete(`http://localhost:8081/dao/order/${orderId}`, {});
        return data.data.result;

    }
    catch (error) {
        console.log(error)
    }
}