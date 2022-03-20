// library witch helps us with calls
import axios from 'axios';


export const postNewHuman = async (humansType, ...post) => {

    // console.log("hello", ...post)

    try {
        console.log("hello", post)
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
        var request = {
            // username: post.username,
            clientUsername: "post.dadclsientadasdUsername",
            name: "post.naddsadaasdsame",
            addressAdd: {
                city: "post.city",
                street: "posst.street",
                building: "possst.building",
                lat: "post.lan",
                lon: "post.lon"
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


        // var resp = await axios.post(`http://localhost:3000/${humansType}/create`, {
        var resp = await axios.post(`http://localhost:8081/dao/${humansType}`, {
            // var resp = await axios.post(`http://localhost:8081/dao/client/`, {


            // ...request
            // ...post
            clientUsername: post.clientUsername,
            name: post.name,
            addressAdd: {
                city: post.city,
                street: post.street,
                building: post.building,
                lat: post.lan,
                lon: post.lon

                // username: "hello",
                // name: "lol",
            },

        },
            console.log("dontwork", ...post)
        );


        console.log(resp.data)
        // return data.data;

    } catch (error) {
        console.log(error)

    }

}