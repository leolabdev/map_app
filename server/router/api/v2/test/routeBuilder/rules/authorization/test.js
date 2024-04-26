import {AbilityBuilder, createMongoAbility} from "@casl/ability";
import {Action} from "../../core/enums/Action.js";
import {Resource} from "./Resource.js";
import AbilityRegister from "../../core/authorization/AbilityRegister.js";

function getTestAbility(actor) {
    const { can, build } = new AbilityBuilder(createMongoAbility);

    if(actor.role === 'admin') {
        can(Action.MANAGE, Resource.TEST); // Admin can manage any test
    } else{
        can(Action.READ, Resource.TEST); // Regular users can read test
    }

    return build();
}

AbilityRegister.registerAbility(Resource.TEST, getTestAbility);