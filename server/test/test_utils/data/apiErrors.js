import { API_ERROR_TYPE_NAME, API_MULTIPLE_ERROR } from "../../../router/api/v2/routeBuilder/core/config";
import { ErrorName } from "../../../router/api/v2/routeBuilder/core/error/ErrorName";
import { ErrorReason } from "../../../router/api/v2/routeBuilder/core/error/ErrorReason";

export const apiError = {type: API_ERROR_TYPE_NAME.description};
export const apiMultipleError = {type: API_MULTIPLE_ERROR};

export const badRequestAPIError = {reason: ErrorReason.BAD_REQUEST, type: API_ERROR_TYPE_NAME.description, status: 400, name: ErrorName.VALIDATION};

export const validationAPIError = {reason: ErrorReason.VALIDATION, type: API_ERROR_TYPE_NAME.description, status: 400, name: ErrorName.VALIDATION};
export const requiredAPIError = {reason: ErrorReason.REQUIRED, type: API_ERROR_TYPE_NAME.description, status: 400, name: ErrorName.VALIDATION};

export const notStringAPIError = {reason: ErrorReason.NOT_STRING, type: API_ERROR_TYPE_NAME.description, status: 400, name: ErrorName.VALIDATION};
export const notNumberAPIError = {reason: ErrorReason.NOT_NUMBER, type: API_ERROR_TYPE_NAME.description, status: 400, name: ErrorName.VALIDATION};
export const notAllowedAPIError = {reason: ErrorReason.NOT_ALLOWED, type: API_ERROR_TYPE_NAME.description, status: 400, name: ErrorName.VALIDATION};
export const notBooleanAPIError = {reason: ErrorReason.NOT_BOOLEAN, type: API_ERROR_TYPE_NAME.description, status: 400, name: ErrorName.VALIDATION};
export const notArrayAPIError = {reason: ErrorReason.NOT_ARRAY, type: API_ERROR_TYPE_NAME.description, status: 400, name: ErrorName.VALIDATION};

export const notUniqueAPIError = { reason: ErrorReason.NOT_UNIQUE, type: API_ERROR_TYPE_NAME.description, status: 409, name: ErrorName.BAD_REQUEST };

export const notFoundAPIError = { reason: ErrorReason.NOT_FOUND, type: API_ERROR_TYPE_NAME.description, status: 404, name: ErrorName.NOT_FOUND };

export const notAuthenticatedAPIError = { reason: ErrorReason.NOT_AUTHENTICATED, type: API_ERROR_TYPE_NAME.description, status: 401, name: ErrorName.NOT_AUTHENTICATED  };
export const noAuthTokenAPIError = { reason: ErrorReason.AUTH_TOKEN_NOT_PROVIDED, type: API_ERROR_TYPE_NAME.description, status: 401, name: ErrorName.NOT_AUTHENTICATED };
export const invalidAuthTokenFormatAPIError = { reason: ErrorReason.INVALID_AUTH_TOKEN_FORMAT, type: API_ERROR_TYPE_NAME.description, status: 401, name: ErrorName.NOT_AUTHENTICATED };
export const invalidAuthTokenAPIError = { reason: ErrorReason.INVALID_AUTH_TOKEN, type: API_ERROR_TYPE_NAME.description, status: 401, name: ErrorName.NOT_AUTHENTICATED };
export const authenticationAPIError = { reason: ErrorReason.AUTHENTICATION_FAILED, type: API_ERROR_TYPE_NAME.description, status: 401, name: ErrorName.NOT_AUTHENTICATED };
export const wrongCredentialsAPIError = { reason: ErrorReason.WRONG_CREDENTIALS, type: API_ERROR_TYPE_NAME.description, status: 401, name: ErrorName.NOT_AUTHENTICATED };

export const notAuthorizedAPIError = { reason: ErrorReason.NOT_AUTHORIZED, type: API_ERROR_TYPE_NAME.description, status: 403, name: ErrorName.NOT_AUTHORIZED };

export const tooManyRequestsAPIError = { reason: ErrorReason.TOO_MANY_REQUESTS, type: API_ERROR_TYPE_NAME.description, status: 429, name: ErrorName.TOO_MANY_REQUESTS };

export const serverMisconfiguredAPIError = { reason: ErrorReason.SERVER_MISCONFIGURED, type: API_ERROR_TYPE_NAME.description, status: 500, name: ErrorName.SERVER_ERROR };
export const serverAPIError = { reason: ErrorReason.SERVER_ERROR, type: API_ERROR_TYPE_NAME.description, status: 500, name: ErrorName.SERVER_ERROR };
export const serviceNotAvailableAPIError = { reason: ErrorReason.SERVICE_NOT_AVAILABLE, type: API_ERROR_TYPE_NAME.description, status: 500, name: ErrorName.SERVER_ERROR };
export const unexpectedAPIError = { reason: ErrorReason.UNEXPECTED, type: API_ERROR_TYPE_NAME.description, status: 500, name: ErrorName.UNEXPECTED };