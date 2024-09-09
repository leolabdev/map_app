/**
 * Adds a dummy jest _this_ object containing functions 
 * that are available in custom matchers, for example this.utils
 * @param {Function} fn function to which the dummy this object will be bind
 * @returns {Function} same function, but with dummy jest _this_ object available
 */
export default function passJestThis(fn) {
    const jestThisMock = {
        utils: {
            printExpected: (str) => str,
            printReceived: (str) => str
        }
    } 

    return fn.bind(jestThisMock);
}