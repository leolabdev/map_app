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
const { DaoUtil } = require("./util/DaoUtil");

const app = express();

//middleware
app.use(bodyParser.json());

//API routing
app.use('/api/v1', address);

//DAO routing
app.use('/dao/manufacturer', manufacturer);
app.use('/dao/client', client);
app.use('/dao/address', address_dao);

//port for heroku/any server which uses environmental variable PORT or 8081 (a port for our localhost)
const port = process.env.PORT || 8081;
const sequelizeUtil = new SequelizeUtil();

app.listen(port, async() => {
    if (sequelizeUtil.isSequelizeConnected()) {
        console.log(`Server started on port ${port} // http://localhost:${port}/api/v1`);

        /*
        await axios
            .post('http://localhost:8081/dao/client', {
                clientUsername: "johnny",
                name: "John Smith",
                addressAdd: {
                    city: "Helsinki",
                    street: "Pohjoinen Rautatiekatu",
                    building: "13",
                    lat: 60.3,
                    lon: 40.345
                },
                addressDelete: {
                    city: "Helsinki",
                    street: "Pohjoinen Rautatiekatu",
                    building: "15"
                }
            })
            .then(res => {
                console.log("Create Success");
            })
            .catch(error => {
                console.error(error);
            });
*/
        await axios
            .delete('http://localhost:8081/dao/client/johnny')
            .then(res => {
                console.log("Delete Success");
            })
            .catch(error => {
                console.error(error);
            })

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