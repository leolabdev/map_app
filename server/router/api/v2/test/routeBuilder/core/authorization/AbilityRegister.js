
export default class AbilityRegister {
    static register = {}

    static registerAbility(resource, ability) {
        AbilityRegister.register[resource] = ability;
    }

    static getAbility(user, resource) {
        return AbilityRegister.register(resource)(user);
    }
}