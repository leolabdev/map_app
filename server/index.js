import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import SettingsUtil, { updateTrafficSituation } from "./util/settings/SettingsUtil.js";
import SequelizeUtil from "./modules/SequelizeUtil.js";

import * as address from "./router/api/v2/routing/address.js";
import * as route from "./router/api/v2/routing/route.js";
import * as client from "./router/api/v2/data/client.js";
import * as order from "./router/api/v2/data/order.js";
import * as data from "./router/api/v2/data/data.js";
import * as area from "./router/api/v2/data/area.js";
import * as profile from "./router/api/v2/data/profile.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import {mapEndpoints} from "./util/settings/mapEndpoints.js";
import {commonErrorCatcher} from "./router/api/v2/routeBuilder/core/middleware/commonErrorCatcher.js";

const app = express();
//for ip access through proxy
app.set('trust proxy', 1);

//middleware
app.use(cors());
app.use(bodyParser.json());

// v2
const routesToRegister = {
    '/routing/address': address,
    '/routing/route': route,
    '/data/client': client,
    '/data/order': order,
    '/data/data': data,
    '/data/area': area,
    '/data/profile': profile
}
app.use(commonErrorCatcher);
mapEndpoints(app, '/api/v2', routesToRegister);



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
        
        setTimeout(() => {
            //TODO: Bug on the first start. This line need to be executed after DB was initialized
            settingsUtil.setUp();
        }, 5000);

        //TODO: fix later
        setInterval(async () => {
            await updateTrafficSituation(90);
         } , 900000);
    }
});