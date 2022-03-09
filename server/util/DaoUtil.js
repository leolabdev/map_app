class DaoUtil{
    getDataValues(respArr){
        if(respArr != null){
            let result = [];
            for(let i=0; i<respArr.length; i++){
                result[i] = respArr[i].dataValues;
            }
            return result;
        } else {
            return null;
        }
    }
}

module.exports.DaoUtil = DaoUtil;