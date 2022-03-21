// library witch helps us with calls
import axios from 'axios';


export const postNewHuman = async (humansType, post) => {

    // console.log("hello", ...post)

    try {
        var request = {
            username: post.username,
            // clientUsername: post.username,
            name: post.name,
            addressAdd: {
                city: post.addressAdd.city,
                street: post.addressAdd.street,
                building: post.addressAdd.building,
                // lat: post.addressAdd.lat,
                // lon: post.addressAdd.lon
            }
        }

        if (humansType === "client") {
            if (request.username) {
                request.clientUsername = request.username;
                delete request.username
            }
            else if (request.manufacturerUsername) {
                request.clientUsername = request.manufacturerUsername;
                delete request.manufacturerUsername
            }
        }
        else if (humansType === "manufacturer") {
            if (request.username) {
                request.manufacturerUsername = request.username;
                delete request.username
            }

            else if (request.clientUsername) {
                request.manufacturerUsername = request.clientUsername;
                delete request.clientUsername
            }
        }

        console.log("our request:", request)

        // var resp = await axios.post(`http://localhost:3000/${humansType}/create`, {
        var resp = await axios.post(`http://localhost:8081/dao/${humansType}`, {
            ...request
        },
        );


        console.log(resp.data)
        // return data.data;

    } catch (error) {
        console.log(error)

    }

}