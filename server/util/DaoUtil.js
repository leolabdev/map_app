/**
 * The class has functionality for helping communicate with DAO package classes
 */
export default class DaoUtil{
    /**
     * The method gets all the data values from Sequelize ORM response, i.e. get all data related only to the object(address, client etc.) without extra data
     * @param {Array} respArr response array from Sequelize ORM
     * @returns {null|*[]} array with ORM objects
     */
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