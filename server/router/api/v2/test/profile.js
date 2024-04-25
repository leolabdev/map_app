import express from "express";
import {APIError} from "../../../../util/error/APIError.js";
import {ErrorReason} from "../../../../util/error/ErrorReason.js";
import {RouteBuilder} from "./util/pipeline/RouteBuilder.js";
import {Method} from "./util/pipeline/Method.js";
import ProfileService from "../../../../service/Profile.js";
import {profileCreate, profileSignIn} from "./validation/profile.js";
import {ProfileCreateReq, ProfileCreateRes, ProfileSignInReq, ProfileSignInRes} from "./serialization/profile.js";

const router = express.Router();
const profileService = new ProfileService();

new RouteBuilder('/', Method.POST)
    .serializeReq(ProfileCreateReq).serializeRes(ProfileCreateRes)
    .validate(profileCreate)
    .addController(createProfile).attachToRouter(router);
async function createProfile(req, res) {
    const profile = await profileService.create(req.body);
    if(!profile)
        throw new APIError(ErrorReason.UNEXPEXTED, 'Could not create a profile', req.baseUrl);

    return profile;
}

new RouteBuilder('/signIn', Method.POST)
    .serializeReq(ProfileSignInReq).serializeRes(ProfileSignInRes)
    .validate(profileSignIn)
    .addController(signIn).attachToRouter(router);
async function signIn(req, res) {
    const profile = await profileService.authenticate(req.body);

    if(!profile)
        throw new APIError(ErrorReason.BAD_REQUEST, 'Could not sign in, check credentials', req.baseUrl);

    return profile;
}

export default router;