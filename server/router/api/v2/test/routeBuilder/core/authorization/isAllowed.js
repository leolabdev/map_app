import AbilityFactory from "../../rules/authorization/AbilityFactory.js";

export default async function isAllowed(user, action, resource) {
    const ability = await AbilityFactory.getAbility(user, resource);
    return ability.can(action, resource);
}