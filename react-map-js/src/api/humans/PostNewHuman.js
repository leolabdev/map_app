// library witch helps us with calls
import axios from 'axios';


export const postNewHuman = async (humansType, username, password) => {


    try {

        var resp = await axios.post(`http://localhost:3000/${humansType}/create`, {
            username: "student4", password: "Koodaus1"
        });
        console.log(resp.data)
        // return data.data;

    } catch (error) {
        console.log(error)

    }

}