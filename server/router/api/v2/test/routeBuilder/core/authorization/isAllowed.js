import AbilityRegister from "./AbilityRegister.js";

export default function isAllowed(user, action, resource) {
    const ability = AbilityRegister.getAbility(user, resource);
    return ability.can(action, resource);
}