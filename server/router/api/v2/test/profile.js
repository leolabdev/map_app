import express from "express";
import {APIError} from "./routeBuilder/core/error/APIError.js";
import {ErrorReason} from "./routeBuilder/core/error/ErrorReason.js";
import {RouteBuilder} from "./routeBuilder/RouteBuilder.js";
import {Method} from "./routeBuilder/core/enums/Method.js";
import ProfileService from "../../../../service/ProfileService.js";
import {profileCreate, profileSignIn} from "./routeBuilder/rules/validation/profile.js";
import {ProfileCreateReq, ProfileCreateRes, ProfileSignInReq, ProfileSignInRes} from "./routeBuilder/rules/serialization/profile.js";
import {ErrorLocation} from "./routeBuilder/core/error/ErrorLocation.js";
import { convertServiceToAPIError } from "./routeBuilder/core/error/convertServiceToAPIError.js";
import { SERVICE_ERROR_TYPE_NAME } from "./routeBuilder/core/config.js";

const router = express.Router();
const profileService = new ProfileService();

new RouteBuilder('/', Method.POST)
    .serializeReq(ProfileCreateReq).serializeRes(ProfileCreateRes)
    .validate(profileCreate)
    .addController(createProfile).attachToRouter(router);
async function createProfile(req, res) {
    const resp = await profileService.read({});

    if(resp.type === SERVICE_ERROR_TYPE_NAME.description){
        const error = convertServiceToAPIError(resp);
        error.location = ErrorLocation.PARAM;
        error.message = 'The id field is not valid';
        throw error;
    }

    return null;

    const profile = await profileService.create(req.body);
    if(!profile)
        throw new APIError({
            reason: ErrorReason.UNEXPECTED, message: 'Could not create a profile',
            endpoint: req.baseUrl,
            location: ErrorLocation.BODY
        });

    return profile;
}

new RouteBuilder('/signIn', Method.POST)
    .serializeReq(ProfileSignInReq).serializeRes(ProfileSignInRes)
    .validate(profileSignIn)
    .addController(signIn).attachToRouter(router);
async function signIn(req, res) {
    const profile = await profileService.authenticate(req.body);

    if(!profile)
        throw new APIError({
            reason: ErrorReason.WRONG_CREDENTIALS, message: 'Could not sign in', endpoint: req.baseUrl,
            location: ErrorLocation.BODY
        });

    return profile;
}

export default router;