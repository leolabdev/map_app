/**
 * Main file for server. Configures and starts server
 */
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import SettingsUtil from "./util/SettingsUtil.js";
import Util from "./util/Util.js";
import SequelizeUtil from "./modules/SequelizeUtil.js";
import * as addressRouter from "./routes/api/v1/address.js";
import * as routingRouter from "./routes/api/v1/routing.js";

import * as manufacturerDaoRouter from "./routes/dao/manufacturer.js";
import * as clientDaoRouter from "./routes/dao/client.js";
import * as addressDaoRouter from "./routes/dao/address.js";
import * as orderDaoRouter from "./routes/dao/order.js";
import * as dataDaoRouter from "./routes/dao/data.js";
import * as areaDaoRouter from "./routes/dao/area.js";
import cors from "cors";

const app = express();

//middleware
app.use(cors());
app.use(bodyParser.json());

//API routing
app.use('/api/v1', addressRouter.default);
app.use('/api/v1', routingRouter.default);

//DAO routing
app.use('/dao/manufacturer', manufacturerDaoRouter.default);
app.use('/dao/client', clientDaoRouter.default);
app.use('/dao/address', addressDaoRouter.default);
app.use('/dao/order', orderDaoRouter.default);
app.use('/dao/data', dataDaoRouter.default);
app.use('/dao/area', areaDaoRouter.default);

//port for heroku/any server which uses environmental variable PORT or 8081 (a port for our localhost)
const host = process.env.API_HOST || "localhost";
const port = process.env.API_PORT || 8081;
const settingsUtil = new SettingsUtil();
const util = new Util();

app.listen(port, async() => {
    if (SequelizeUtil.isSequelizeConnected()) {
        console.log(`Server started on port ${port} // http://${host}:${port}/`);
       //await settingsUtil.setUp();

        //TODO: fix later
        // setInterval(() => {
        //     util.updateTrafficSituation(90);
        // } , 900000);
    }
});