/**
 * Main file for server. Configures and starts server
 */
// Dev Start: npm run dev
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
dotenv.config();

const SequelizeUtil = require("./modules/SequelizeUtil").SequelizeUtil;
const address = require('./routes/api/v1/address');
const manufacturer = require('./routes/dao/manufacturer');
const client = require('./routes/dao/client');
const axios = require("axios");

const app = express();

//middleware
app.use(bodyParser.json());

//API routing
app.use('/api/v1', address);

//DAO routing
app.use('/dao/manufacturer', manufacturer);
app.use('/dao/client', client);

//port for heroku/any server which uses environmental variable PORT or 8081 (a port for our localhost)
const port = process.env.PORT || 8081;
const sequelizeUtil = new SequelizeUtil();

app.listen(port, async () => {
    if(sequelizeUtil.isSequelizeConnected()){
        console.log(`Server started on port ${port} // http://localhost:${port}/api/v1`);
        const axios = require('axios')

        axios
            .post('http://localhost:8081/dao/client', {
                clientUsername: "matti",
                name: "Matti Meikalainen"
            })
            .then(res => {
                console.log("Create Success");
            })
            .catch(error => {
                console.error(error)
            })

        axios
            .get('http://localhost:8081/dao/client/matti')
            .then(res => {
                console.log(res.data);
            })
            .catch(error => {
                console.error(error)
            })

        axios
            .put('http://localhost:8081/dao/client', {
                clientUsername: "matti",
                name: "Matti Testinen"
            })
            .then(res => {
                console.log("Update Success");
            })
            .catch(error => {
                console.error(error)
            })

        axios
            .get('http://localhost:8081/dao/client/')
            .then(res => {
                console.log(res.data);
            })
            .catch(error => {
                console.error(error)
            })

        axios
            .delete('http://localhost:8081/dao/client/matti')
            .then(res => {
                console.log("Delete Success");
            })
            .catch(error => {
                console.error(error)
            })

        axios
            .get('http://localhost:8081/dao/client')
            .then(res => {
                console.log(res.data);
            })
            .catch(error => {
                console.error(error)
            })
    }
});