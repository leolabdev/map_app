import express from "express";
import {APIError} from "./routeBuilder/core/error/APIError.js";
import {ErrorReason} from "./routeBuilder/core/error/ErrorReason.js";
import {RouteBuilder} from "./routeBuilder/RouteBuilder.js";
import {Method} from "./routeBuilder/core/enums/Method.js";
import ProfileService from "../../../../service/ProfileService.js";
import {profileCreate, profileSignIn, profileUpdate} from "./routeBuilder/rules/validation/profile.js";
import {ProfileCreateReq, ProfileCreateRes, ProfileSignInReq, ProfileSignInRes, ProfileUpdateReq} from "./routeBuilder/rules/serialization/profile.js";
import {ErrorLocation} from "./routeBuilder/core/error/ErrorLocation.js";
import isRespServiceError from "./routeBuilder/core/service/validateInput.js";
import throwAPIError from "./routeBuilder/core/error/throwAPIError.js";

const router = express.Router();
const profileService = new ProfileService();

new RouteBuilder('/', Method.POST)
    .serializeReq(ProfileCreateReq).serializeRes(ProfileCreateRes)
    .validate(profileCreate)
    .addController(createProfile).attachToRouter(router);
async function createProfile(req, res) {
    const profile = await profileService.create(req.body);
    if(isRespServiceError(profile))
        return throwAPIError(profile, null, ErrorLocation.BODY);

    if(!profile)
        throw new APIError({
            reason: ErrorReason.UNEXPECTED, message: 'Could not create a profile',
            location: ErrorLocation.BODY
        });

    return profile;
}

new RouteBuilder('/', Method.PUT)
    .serializeReq(ProfileUpdateReq)
    .validate(profileUpdate)
    .successStatus(204)
    .addController(updateProfile).attachToRouter(router);
async function updateProfile(req, res) {
    const isSuccess = await profileService.update(req.body);
    if(isRespServiceError(isSuccess))
        return throwAPIError(isSuccess, null, ErrorLocation.BODY);

    if(!isSuccess)
        throw new APIError({
            reason: ErrorReason.UNEXPECTED, message: 'Could not update a profile',
            location: ErrorLocation.BODY
        });

    return isSuccess;
}

new RouteBuilder('/signIn', Method.POST)
    .serializeReq(ProfileSignInReq).serializeRes(ProfileSignInRes)
    .validate(profileSignIn)
    .addController(signIn).attachToRouter(router);
async function signIn(req, res) {
    const profile = await profileService.authenticate(req.body);

    if(!profile)
        throw new APIError({
            reason: ErrorReason.WRONG_CREDENTIALS, message: 'Could not sign in',
            location: ErrorLocation.BODY
        });

    return profile;
}

export default router;