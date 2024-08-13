import { API_ERROR_TYPE_NAME } from "../../../router/api/v2/routeBuilder/core/config";
import { ErrorReason } from "../../../router/api/v2/routeBuilder/core/error/ErrorReason";

export const apiError = {type: API_ERROR_TYPE_NAME.description};

export const badRequestAPIError = {reason: ErrorReason.BAD_REQUEST, type: API_ERROR_TYPE_NAME.description, status: 400};

export const validationAPIError = {reason: ErrorReason.VALIDATION, type: API_ERROR_TYPE_NAME.description, status: 400};
export const requiredAPIError = {reason: ErrorReason.REQUIRED, type: API_ERROR_TYPE_NAME.description, status: 400};

export const notStringAPIError = {reason: ErrorReason.NOT_STRING, type: API_ERROR_TYPE_NAME.description, status: 400};
export const notNumberAPIError = {reason: ErrorReason.NOT_NUMBER, type: API_ERROR_TYPE_NAME.description, status: 400};
export const notAllowedAPIError = {reason: ErrorReason.NOT_ALLOWED, type: API_ERROR_TYPE_NAME.description, status: 400};
export const notBooleanAPIError = {reason: ErrorReason.NOT_BOOLEAN, type: API_ERROR_TYPE_NAME.description, status: 400};
export const notArrayAPIError = {reason: ErrorReason.NOT_ARRAY, type: API_ERROR_TYPE_NAME.description, status: 400};

export const notUniqueAPIError = { reason: ErrorReason.NOT_UNIQUE, type: API_ERROR_TYPE_NAME.description, status: 409 };

export const notFoundAPIError = { reason: ErrorReason.NOT_FOUND, type: API_ERROR_TYPE_NAME.description, status: 404 };

export const notAuthenticatedAPIError = { reason: ErrorReason.NOT_AUTHENTICATED, type: API_ERROR_TYPE_NAME.description, status: 401 };
export const noAuthTokenAPIError = { reason: ErrorReason.AUTH_TOKEN_NOT_PROVIDED, type: API_ERROR_TYPE_NAME.description, status: 401 };
export const invalidAuthTokenFormatAPIError = { reason: ErrorReason.INVALID_AUTH_TOKEN_FORMAT, type: API_ERROR_TYPE_NAME.description, status: 401 };
export const invalidAuthTokenAPIError = { reason: ErrorReason.INVALID_AUTH_TOKEN, type: API_ERROR_TYPE_NAME.description, status: 401 };
export const authenticationAPIError = { reason: ErrorReason.AUTHENTICATION_FAILED, type: API_ERROR_TYPE_NAME.description, status: 401 };
export const wrongCredentialsAPIError = { reason: ErrorReason.WRONG_CREDENTIALS, type: API_ERROR_TYPE_NAME.description, status: 401 };

export const notAuthorizedAPIError = { reason: ErrorReason.NOT_AUTHORIZED, type: API_ERROR_TYPE_NAME.description, status: 403 };

export const tooManyRequestsAPIError = { reason: ErrorReason.TOO_MANY_REQUESTS, type: API_ERROR_TYPE_NAME.description, status: 429 };

export const serverMisconfiguredAPIError = { reason: ErrorReason.SERVER_MISCONFIGURED, type: API_ERROR_TYPE_NAME.description, status: 500 };
export const serverAPIError = { reason: ErrorReason.SERVER_ERROR, type: API_ERROR_TYPE_NAME.description, status: 500 };
export const serviceNotAvailableAPIError = { reason: ErrorReason.SERVICE_NOT_AVAILABLE, type: API_ERROR_TYPE_NAME.description, status: 500 };
export const unexpectedAPIError = { reason: ErrorReason.UNEXPECTED, type: API_ERROR_TYPE_NAME.description, status: 500 };