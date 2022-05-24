/**
 * The class provides functionality for validating stings
 */
class StringValidator {
    /**
     * The method checks is the given string blank or contains only spaces
     * @param {string} str string to check
     * @returns {boolean} true if it is blank, false if not
     */
    isBlank(str){
        return str.length === 0 || !str.trim();
    }
}

module.exports.StringValidator = StringValidator;