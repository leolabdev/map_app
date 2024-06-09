import axios from 'axios';

// async function for posting a new Order.
export const postNewOrder = async (post) => {

    try {
        const request = {
            manufacturerUsername: post.manufacturerUsername,
            clientUsername: post.clientUsername,
            shipmentAddressId: post.shipmentAddressId,
            deliveryAddressId: post.deliveryAddressId
        };

        const resp = await axios.post(`http://localhost:8081/dao/order`, {
            ...request
        });
        return resp.data;

    } catch (error) {
        console.log(error)
    }
}


