
class StringValidator {
    isBlank(str){
        return str.length === 0 || !str.trim();
    }
}

module.exports.StringValidator = StringValidator;