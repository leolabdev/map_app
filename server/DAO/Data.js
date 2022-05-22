const { Data } = require("../model/Data");
const StringValidator = require("../util/StringValidator").StringValidator;
const DaoUtil = require("../util/DaoUtil").DaoUtil;

const stringValidator = new StringValidator();
const daoUtil = new DaoUtil();

/**
 * The class provides functionality for manipulating(CRUD operations) with Data SQL table.
 * This table contains different data in key-value form and last updated date
 */
class DataDAO {
    /**
     * The method creates new data pair in the Data SQL table
     * @param {Object} data object, where the name and value fields are manditory
     * @returns created Data object, if operation was sucessful or null if not
     */
    async create(data) {
        const { name, value } = data;

        if (daoUtil.containNoNullArr([name, value]) && daoUtil.containNoBlankArr([name, value])) {
            try {
                if (name != null) {
                    return await Data.create(data);
                } else {
                    return null;
                }
            } catch (e) {
                console.error("DataDAO: Could not execute the query");
                return null;
            }
        } else {
            console.error("DataDAO: Wrong parameter provided");
            return null;
        }
    }

    /**
     * The method reads Data object with the provided primary key(name)
     * @param {String} primaryKey primary key of the data
     * @returns founded Data object, if operation was sucessful or null if not
     */
    async read(primaryKey) {
        if (primaryKey != null && !stringValidator.isBlank(primaryKey)) {
            try {
                const resp = await Data.findByPk(primaryKey);
                return resp != null ? resp.dataValues : null;
            } catch (e) {
                console.error("DataDAO: Could not execute the query");
                return null;
            }
        } else {
            console.error("DataDAO: Wrong parameter provided");
            return null;
        }
    }

    /**
     * The method reads all Data objects of the Data SQL table
     * @returns array of the founded Data objects, if operation was sucessful or null if not
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
     * @param {Object} data object with the data, such as value or name
     * @returns true, if the operation was sucessful or false if not
     */
    async update(data) {
        const { name, value } = data;

        if (daoUtil.containNoNullArr([name, value]) && daoUtil.containNoBlankArr([name, value])) {
            try {
                const resp = await Data.update(
                    data, { where: { name: name } }
                );

                return resp[0] > 0;
            } catch (e) {
                console.error("DataDAO: Could not execute the query");
                console.log(e);
                return false;
            }
        } else {
            console.error("DataDAO: Wrong parameter provided");
            return false;
        }
    }

    /**
     * The method deletes data with provided primary key(name)
     * @param {String} primaryKey primary key of the data
     * @returns true if operation was sucessful or false if not
     */
    async delete(primaryKey) {
        if (primaryKey != null && !stringValidator.isBlank(primaryKey)) {
            try {
                const resp = await Data.destroy({ where: { name: primaryKey } });
                return resp > 0;
            } catch (e) {
                console.error("DataDAO: Could not execute the query");
                console.log(e);
                return false;
            }
        } else {
            console.error("DataDAO: Wrong parameter provided");
            return false;
        }
    }
}

module.exports.DataDAO = DataDAO;