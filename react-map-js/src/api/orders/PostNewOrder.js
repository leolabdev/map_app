import axios from 'axios';


export const postNewOrder = async (post) => {


    try {

        var data = await axios.post(`http://localhost:8081/dao/order`, {


        });
        console.log(data.data.result)
        return data.data.result;

    } catch (error) {
        console.log(error)

    }

}