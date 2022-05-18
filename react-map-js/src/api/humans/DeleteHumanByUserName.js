import axios from 'axios';


// async function for deleting a  Client/Manufacturer.
export const deleteHumanByUserName = async (humansType, username) => {

    try {
        const data = await axios.delete(`http://localhost:8081/dao/${humansType}/${username}`, {});
        return data.data.result;

    }
    catch (error) {
        console.log(error)

    }

}