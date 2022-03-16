/**
 * Main file for server. Configures and starts server
 */
// Dev Start: npm run dev
const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const SequelizeUtil = require("./modules/SequelizeUtil").SequelizeUtil;

const address = require('./routes/api/v1/address');

const manufacturer = require('./routes/dao/manufacturer');
const client = require('./routes/dao/client');
const address_dao = require('./routes/dao/address');
const order = require('./routes/dao/order');

const app = express();

//middleware
app.use(bodyParser.json());

//API routing
app.use('/api/v1', address);

//DAO routing
app.use('/dao/manufacturer', manufacturer);
app.use('/dao/client', client);
app.use('/dao/address', address_dao);
app.use('/dao/order', order);

//port for heroku/any server which uses environmental variable PORT or 8081 (a port for our localhost)
const port = process.env.PORT || 8081;
const sequelizeUtil = new SequelizeUtil();

app.listen(port, async() => {
    if (sequelizeUtil.isSequelizeConnected()) {
        console.log(`Server started on port ${port} // http://localhost:${port}/api/v1`);
        await axios
            .post('http://localhost:8081/dao/client', {
                clientUsername: "john",
                name: 'John Smith',
                addressAdd: {
                    city: "Helsinki",
                    street: "Rautatiekatu",
                    building: "10",
                    lat: 61.3345,
                    lon: 40.133323
                }
            })
            .then(res => {
                console.log("Update Success");
            })
            .catch(error => {
                console.error(error);
            });


        await axios
            .post('http://localhost:8081/dao/manufacturer', {
                manufacturerUsername: "luke",
                name: 'Luke Skywalker',
                addressAdd: {
                    city: "Tampere",
                    street: "Rauhankatu",
                    building: "2",
                    lat: 62.3909,
                    lon: 41.899
                }
            })
            .then(res => {
                console.log("Update Success");
            })
            .catch(error => {
                console.error(error);
            });

        const manufacturerData = await axios.get('http://localhost:8081/dao/manufacturer/luke');
        const clientData = await axios.get('http://localhost:8081/dao/client/john');

        await axios
            .put('http://localhost:8081/dao/order', {
                orderId: 1,
                manufacturerUsername: "john",
                clientUsername: 'john',
                shipmentAddressId: manufacturerData.data.result.Addresses[0].addressId,
                deliveryAddressId: clientData.data.result.Addresses[0].addressId
            })
            .then(res => {
                console.log("Update Success");
            })
            .catch(error => {
                console.error(error);
            });

        const orderData = await axios.get('http://localhost:8081/dao/order/');
        console.log(orderData.data.result);

        /*
        await axios
            .delete('http://localhost:8081/dao/manufacturer/john')
            .then(res => {
                console.log("Delete Success");
            })
            .catch(error => {
                console.error(error);
            })*/

        /*
        axios
            .delete('http://localhost:8081/dao/client/jane')
            .then(res => {
                console.log("Delete Success");
            })
            .catch(error => {
                console.error(error);
            })*/

        /*
                axios
                    .get('http://localhost:8081/dao/address')
                    .then(res => {
                        console.log(res.data);
                    })
                    .catch(error => {
                        console.error(error)
                    })

                axios
                    .put('http://localhost:8081/dao/address', {
                        addressId: 2,
                        city: "Vantaa",
                        street: "Pohjoinen Rautatiekatu",
                        building: "12"
                    })
                    .then(res => {
                        console.log("Update Success");
                    })
                    .catch(error => {
                        console.error(error);
                    })

                axios
                    .get('http://localhost:8081/dao/address/1')
                    .then(res => {
                        console.log(res.data);
                    })
                    .catch(error => {
                        console.error(error);
                    })

                axios
                    .delete('http://localhost:8081/dao/address/1')
                    .then(res => {
                        console.log("Delete Success");
                    })
                    .catch(error => {
                        console.error(error);
                    })

                axios
                    .get('http://localhost:8081/dao/address')
                    .then(res => {
                        console.log(res.data);
                    })
                    .catch(error => {
                        console.error(error);
                    })*/
    }
});