import {Resource} from "./Resource.js";
import {testAbility} from "./test.js";

export default class AbilityFactory {
    static async getAbility(user, resource) {
        switch (resource) {
            case Resource.TEST:
                return testAbility(user);
            default:
                return null;
        }
    }
}