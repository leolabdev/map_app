import { SERVICE_ERROR_TYPE_NAME } from "../../../config.js";

export default function isServiceError(e){
    return e && e['type'] === SERVICE_ERROR_TYPE_NAME.description;
}