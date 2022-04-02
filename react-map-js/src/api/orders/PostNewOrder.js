import axios from 'axios';


export const postNewOrder = async (post) => {


    try {

        var request = {
            manufacturerUsername: post.manufacturerUsername,
            // clientUsername: post.username,
            clientUsername: post.clientUsername,
            shipmentAddressId: post.shipmentAddressId,
            deliveryAddressId: post.deliveryAddressId
        }

        console.log("our orderRequest:", request)
        var resp = await axios.post(`http://localhost:8081/dao/order`, {
        
            ...request


        });
        console.log(resp.data)
        return resp.data;

    } catch (error) {
        console.log(error)

    }

}


