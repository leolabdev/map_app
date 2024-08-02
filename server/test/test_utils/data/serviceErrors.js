import { SERVICE_ERROR_TYPE_NAME } from "../../../router/api/v2/routeBuilder/core/config";
import { SEReason } from "../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason";

export const serviceError = {type: SERVICE_ERROR_TYPE_NAME.description};
export const requiredError = {reason: SEReason.REQUIRED, type: SERVICE_ERROR_TYPE_NAME.description};
export const notStringError = {reason: SEReason.NOT_STRING, type: SERVICE_ERROR_TYPE_NAME.description};
export const notNumberError = {reason: SEReason.NOT_NUMBER, type: SERVICE_ERROR_TYPE_NAME.description};
export const notUniqueError = { reason: SEReason.NOT_UNIQUE, type: SERVICE_ERROR_TYPE_NAME.description };
export const notFoundError = { reason: SEReason.NOT_FOUND, type: SERVICE_ERROR_TYPE_NAME.description };
export const notAllowedError = {reason: SEReason.NOT_ALLOWED, type: SERVICE_ERROR_TYPE_NAME.description};
export const notValidError = {reason: SEReason.NOT_VALID, type: SERVICE_ERROR_TYPE_NAME.description};
export const notBooleanError = {reason: SEReason.NOT_BOOLEAN, type: SERVICE_ERROR_TYPE_NAME.description};
export const notArrayError = {reason: SEReason.NOT_ARRAY, type: SERVICE_ERROR_TYPE_NAME.description};
export const notLimitExceededError = {reason: SEReason.LIMIT_EXCEEDED, type: SERVICE_ERROR_TYPE_NAME.description};