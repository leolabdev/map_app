// library witch helps us with calls
import axios from 'axios';


export const postNewHuman = async (humansType, ...post) => {



    try {
        // var request = {
        //     // username: post.username,
        //     clientUsername: post.clientUsername,
        //     name: post.name,
        //     addressAdd: {
        //         city: post.city,
        //         street: post.street,
        //         building: post.building,
        //         lat: post.lan,
        //         lon: post.lon
        //     }
        // }

        // if (humansType === "client") {
        //     if (request.username) {
        //         request.clientUsername = request.username;
        //         delete request.username
        //     }
        //     else if (request.manufacturerUsername) {
        //         request.clientusername = request.manufacturerUsername;
        //         delete request.manufacturerUsername
        //     }
        // }
        // else if (humansType === "manufacturer") {
        //     if (request.username) {
        //         request.manufacturerUsername = request.username;
        //         delete request.username
        //     }

        //     else if (request.clientusername) {
        //         request.manufacturerUsername = request.clientusername;
        //         delete request.clientusername
        //     }
        // }


        // var resp = await axios.post(`http://localhost:3000/${humansType}/create`, {
        var resp = await axios.post(`http://localhost:8081/dao/${humansType}`, {


            // request
            ...post
            // username: post.clientUsername,
            // name: post.name,
            // addressAdd: {
            //     city: post.city,
            //     street: post.street,
            //     building: post.building,
            //     lat: post.lan,
            //     lon: post.lon

            //     // username: "hello",
            //     // name: "lol",
            // },

        },
            console.log(humansType)
        );


        console.log(resp.data)
        // return data.data;

    } catch (error) {
        console.log(error)

    }

}