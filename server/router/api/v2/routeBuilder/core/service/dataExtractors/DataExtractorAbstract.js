import {ServiceError} from "./error/ServiceError.js";
import {SEReason} from "./error/SEReason.js";

export default class DataExtractorAbstract {
    extract(dbResponse, options) {
        throw new ServiceError({ reason: SEReason.MISCONFIGURED });
    }
}