import axios from 'axios';


export const deleteOrderByOrderId = async (orderId) => {


    try {

        var data = await axios.delete(`http://localhost:8081/dao/order/${orderId}`, {


        });
        console.log(data.data.result)
        return data.data.result;

    } catch (error) {
        console.log(error)

    }

}