import MatcherReturner from "../../../jest_util/MatcherReturner";

/**
 * Jest matcher checks whenever provided param is an array 
 * containing specified ServiceErrors.
 *
 * Notice that the order does not matter.
 *
 * Notice that if array will contain other objects they will be ignored.
 * @param {*} object object to check
 * @param {*[]} expected expected object
 * @returns {{ message: () => string, pass: boolean }}
 */
export default function toContainSE(object, expected) {
    const returner = new MatcherReturner({received: object, utils: this.utils, expected});

    if(!expected || !Array.isArray(expected))
        throw new TypeError('The expected field must be an array');

    if(!object || !Array.isArray(object))
        return returner.passFalse('Received object is not array');

    let foundErrors = 0;

    for(let i=0, l=object.length; i<l; i++){
        const currentItem = object[i];

        if(expected.includes(currentItem))
            foundErrors++;
    }
    const isValid = foundErrors >= expected.length;

    return isValid ?
        returner.passTrue('Expected to not receive an array containing these ServiceErrors') :
        returner.passFalse('Expected to receive an array containing these ServiceErrors');
}

expect.extend({toContainSE});