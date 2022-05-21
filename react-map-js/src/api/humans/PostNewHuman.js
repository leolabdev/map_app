// library witch helps us with calls
import axios from 'axios';


// async function for posting a new Client/Manufacturer.
export const postNewHuman = async (humansType, post) => {

    try {
        const request = {
            username: post.username,
            name: post.name,
            addressAdd: {
                city: post.addressAdd.city,
                street: post.addressAdd.street,
                building: post.addressAdd.building,
            }
        };

        if (humansType === "client") {
            if (request.username) {
                request.clientUsername = request.username;
                delete request.username
            } else if (request.manufacturerUsername) {
                request.clientUsername = request.manufacturerUsername;
                delete request.manufacturerUsername
            }
        } else if (humansType === "manufacturer") {
            if (request.username) {
                request.manufacturerUsername = request.username;
                delete request.username
            } else if (request.clientUsername) {
                request.manufacturerUsername = request.clientUsername;
                delete request.clientUsername
            }
        }

       await axios.post(`http://localhost:8081/dao/${humansType}`, {
            ...request
        });


    } catch (error) {
        console.log(error)

    }

}