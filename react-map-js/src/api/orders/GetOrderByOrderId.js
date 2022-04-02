import axios from 'axios';


export const getOrderByOrderId = async (orderId) => {


    try {

        var data = await axios.get(`http://localhost:8081/dao/order/${orderId}`, {


        });
        // console.log(data.data.result)
        return data.data.result;

    } catch (error) {
        console.log(error)

    }

}