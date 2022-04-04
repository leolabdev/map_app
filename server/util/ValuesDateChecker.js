
class ValuesDateChecker{
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