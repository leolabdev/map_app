import axios from 'axios';


export const deleteHumanByUserName = async (humansType, username) => {


    try {
        const data = await axios.delete(`http://localhost:8081/dao/${humansType}/${username}`, {});
        return data.data.result;

    }
    catch (error) {
        console.log(error)

    }

}