import StringValidator from "../util/StringValidator.js";
import DaoUtil from "../util/DaoUtil.js";
import Data from "../model/Data.js";

const stringValidator = new StringValidator();
const daoUtil = new DaoUtil();

/**
 * The class provides functionality for manipulating(CRUD operations) with Data SQL table.
 * This table contains different data in key-value form and last updated date
 */
export default class DataService {
    /**
     * The method creates new data pair in the Data SQL table
     * @param {Data} data object, where the name and value fields are mandatory
     * @returns created Data object, if operation was successful or null if not
     */
    async create(data) {
        const { name, value } = data;

        if(!daoUtil.containNoNullArr([name, value]) || !daoUtil.containNoBlankArr([name, value])){
            console.error("DataDAO create: Wrong parameter provided");
            return null;
        }
        try {
            return await Data.create(data);
        } catch (e) {
            console.error("DataDAO create: Could not execute the query");
            return null;
        }
    }

    /**
     * The method reads Data object with the provided primary key(name)
     * @param {string} primaryKey primary key of the data
     * @returns founded Data object, if operation was successful or null if not
     */
    async read(primaryKey) {
        if(primaryKey == null || stringValidator.isBlank(primaryKey)){
            console.error("DataDAO read: Wrong parameter provided");
            return null;
        }

        try {
            const resp = await Data.findByPk(primaryKey);
            return resp != null ? resp.dataValues : null;
        } catch (e) {
            console.error("DataDAO read: Could not execute the query");
            return null;
        }
    }

    /**
     * The method reads all Data objects of the Data SQL table
     * @returns array of the founded Data objects, if operation was successful or null if not
     */
    async readAll() {
        try {
            const resp = await Data.findAll();
            return daoUtil.getDataValues(resp);
        } catch (e) {
            console.error("DataDAO: Could not execute the query");
            return null;
        }
    }

    /**
     * The method updates existing data in the Data SQL table
     * @param {Partial<Data>} data object with the data, such as value or name
     * @returns true, if the operation was successful or false if not
     */
    async update(data) {
        const { name, value } = data;

        if(!daoUtil.containNoNullArr([name, value]) || !daoUtil.containNoBlankArr([name, value])){
            console.error("DataDAO update: Wrong parameter provided");
            return false;
        }

        try {
            const resp = await Data.update(
                data, { where: { name: name } }
            );

            return resp[0] > 0;
        } catch (e) {
            console.error("DataDAO update: Could not execute the query");
            console.log(e);
            return false;
        }
    }

    /**
     * The method deletes data with provided primary key(name)
     * @param {string} primaryKey primary key of the data
     * @returns true if operation was successful or false if not
     */
    async delete(primaryKey) {
        if(primaryKey == null || stringValidator.isBlank(primaryKey)){
            console.error("DataDAO delete: Wrong parameter provided");
            return false;
        }

        try {
            const resp = await Data.destroy({ where: { name: primaryKey } });
            return resp > 0;
        } catch (e) {
            console.error("DataDAO delete: Could not execute the query");
            console.log(e);
            return false;
        }
    }
}