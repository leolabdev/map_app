// library witch helps us with calls
import axios from 'axios';


export const postNewHuman = async (humansType, ...post) => {


    try {

        var resp = await axios.post(`http://localhost:3000/${humansType}/create`, {
            username: post.username,
            name: post.name,
            addressAdd: {
                city: post.city,
                street: post.street,
                building: post.building,
                lat: post.lan,
                lon: post.lon
            },
        });
        console.log(resp.data)
        // return data.data;

    } catch (error) {
        console.log(error)

    }

}