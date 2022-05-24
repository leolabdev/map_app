/**
 * The class provides functionality for checking dates of the Data SQL table rows
 */
class ValuesDateChecker{
    /**
     * The method checks are the given Data SQL table rows old (older than 1 day)
     * @param {Array.<string>} valuesToCheck names of the values to check
     * @param {Array.<Object>} values data ORM objects array
     * @returns {boolean} true if any of the values are old, false if not
     */
    areValuesOld(valuesToCheck, values){
        for(let j=0; j<valuesToCheck.length; j++){
            const value = valuesToCheck[j];
            for(let i=0; i<values.length; i++){
                if(value === values[i].name){
                    const lastUpdated = Date.parse(values[i].lastUpdated);
                    const currentMoment = Date.now();
                    const difference = currentMoment - lastUpdated;
                    if(difference >= 86400000){
                        return true;
                    }
                }
            }
        }

        return false;
    }
}

module.exports.ValuesDateChecker = ValuesDateChecker;