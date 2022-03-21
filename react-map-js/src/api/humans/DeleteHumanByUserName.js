import axios from 'axios';


export const getHumansData = async (humansType, username) => {


    try {

        var data = await axios.delete(`http://localhost:8081/dao/${humansType}/${username}`, {


        });
        console.log(data.data.result)
        return data.data.result;

    } catch (error) {
        console.log(error)

    }

}