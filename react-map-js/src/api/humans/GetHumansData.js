// library witch helps us with calls
import axios from 'axios';


export const getHumansData = async (humansType) => {


    try {
        //reqquest we get user/manufacturer by destructuring
        // const { data: { data } } = await axios.get(`https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`, {
        // var { data: { data } } = await axios.get(`http://localhost:3000/${humansType}`, {
        // var data = await axios.get(`http://localhost:8081/dao/client/`, {
        var data = await axios.get(`http://localhost:8081/dao/${humansType}`, {

            // var data = await axios.get(`http://localhost:3000/${humansType}`, {
            // var { data: { data } } = await axios.get(`http://localhost:3000/users`, {
            // params: {
            //     bl_latitude: sw.lat,
            //     bl_longitude: sw.lng,
            //     tr_longitude: ne.lng,
            //     tr_latitude: ne.lat,
            // },
            // headers: {
            //     'x-rapidapi-key': process.env.REACT_APP_RAPID_API_TRAVEL_API_KEY,
            //     'x-rapidapi-host': 'travel-advisor.p.rapidapi.com'
            // }
        });
        console.log(data.data.result)
        return data.data.result;

    } catch (error) {
        console.log(error)

    }

}