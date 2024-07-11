import { API_ERROR_TYPE_NAME } from "../config.js";

export default function isAPIError(e){
    return e && e['type'] === API_ERROR_TYPE_NAME.description;
}