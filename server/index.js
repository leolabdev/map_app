import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import SettingsUtil, { updateTrafficSituation } from "./util/settings/SettingsUtil.js";
import SequelizeUtil from "./modules/SequelizeUtil.js";
import * as addressRouter from "./router/api/v1/address.js";
import * as routingRouter from "./router/api/v1/routing.js";
import * as manufacturerDaoRouter from "./router/dao/manufacturer.js";
import * as clientDaoRouter from "./router/dao/client.js";
import * as addressDaoRouter from "./router/dao/address.js";
import * as orderDaoRouter from "./router/dao/order.js";
import * as dataDaoRouter from "./router/dao/data.js";
import * as areaDaoRouter from "./router/dao/area.js";

import * as address from "./router/api/v2/routing/address.js";
import * as route from "./router/api/v2/routing/route.js";
import * as manufacturer from "./router/api/v2/data/manufacturer.js";
import * as client from "./router/api/v2/data/client.js";
import * as addressData from "./router/api/v2/data/address.js";
import * as order from "./router/api/v2/data/order.js";
import * as data from "./router/api/v2/data/data.js";
import * as area from "./router/api/v2/data/area.js";
import * as test from "./router/api/v2/test/test.js";

import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import {mapEndpoints} from "./util/settings/mapEndpoints.js";
import {errorHandler} from "./router/api/v2/test/test.js";

const app = express();
//for ip access through proxy
app.set('trust proxy', 1);

//middleware
app.use(cors());
app.use(bodyParser.json());

//old API routing
app.use('/api/v1', addressRouter.default);
app.use('/api/v1', routingRouter.default);
app.use('/dao/manufacturer', manufacturerDaoRouter.default);
app.use('/dao/client', clientDaoRouter.default);
app.use('/dao/address', addressDaoRouter.default);
app.use('/dao/order', orderDaoRouter.default);
app.use('/dao/data', dataDaoRouter.default);
app.use('/dao/area', areaDaoRouter.default);

const routesToRegister = {
    '/routing/address': address,
    '/routing/route': route,
    '/data/manufacturer': manufacturer,
    '/data/client': client,
    '/data/address': addressData,
    '/data/order': order,
    '/data/data': data,
    '/data/area': area,
}
mapEndpoints(app, '/api/v2', routesToRegister);
app.use('/api/v2/test', test.default);
//Error catching
app.use(errorHandler);

//port for heroku/any server which uses environmental variable PORT or 8081 (a port for our localhost)
const host = process.env.API_HOST || "localhost";
const port = process.env.API_PORT || 8081;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const settingsUtil = new SettingsUtil(
    {cityCentersFileLocation: path.join(__dirname, 'config', 'cityCenters.json')},
);

app.listen(port, async() => {
    if (SequelizeUtil.isSequelizeConnected()) {
        console.log(`Server started on port ${port} // http://${host}:${port}/`);
        //TODO: Bug on the first start. This line need to be executed after DB was initialized
       await settingsUtil.setUp();

        //TODO: fix later
        setInterval(async () => {
            await updateTrafficSituation(90);
         } , 900000);
    }
});