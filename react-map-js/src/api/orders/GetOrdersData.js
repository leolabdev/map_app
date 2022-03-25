// library witch helps us with calls
import axios from 'axios';


export const getOrdersData = async () => {


    try {

        var data = await axios.get(`http://localhost:8081/dao/order`, {
        });
        console.log(data.data.result)
        return data.data.result;

    } catch (error) {
        console.log(error)

    }

}