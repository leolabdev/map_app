import StringValidator from "../util/StringValidator.js";
import DaoUtil from "../util/DaoUtil.js";
import AreaCoordinates from "../model/AreaCoordinates.js";
import Area from "../model/Area.js";


const stringValidator = new StringValidator();
const daoUtil = new DaoUtil();

/**
 * The class provides functionality for manipulating(CRUD operations) with Area SQL table.
 * This table contains area objects and used for saving type(polygon or multipolygon) of the GeoJSON objects and name of the area
 */
export default class AreaDAO {
    /**
     * The method creates new area in the Area SQL table
     * @param {Object} data object with the area data, where areaName and type(polygon or multipolygon) fields are manditory
     * @returns created Area object, if operation was sucessful or null if not
     */
    async create(data) {
        const { areaName, type } = data;

        //console.log(areaName, type);

        if (daoUtil.containNoNullArr([areaName, type]) && daoUtil.containNoBlankArr([areaName, type])) {
            try {
                return await Area.create(data);
            } catch (e) {
                console.error("AreaDAO: Could not execute the query");
                return null;
            }
        } else {
            console.error("AreaDAO: Wrong parameter provided");
            return null;
        }
    }

    /**
     * The method creates multiple new area in the Area SQL table
     * @param {Array} data array with object with the area data, where areaName and type(polygon or multipolygon) fields are manditory
     * @returns array with created Area objects, if operation was sucessful or null if not
     */
    async createMultiple(data) {
        try {
            return await Area.bulkCreate(data);
        } catch (e) {
            console.log("AreaDAO: Could not execute the query");
            console.log(e);
            return null;
        }
    }

    /**
     * The method reads area with provided primary key(areaName)
     * @param {String} primaryKey primary key of the area
     * @returns founded Area object, if operation was sucessful or null if not
     */
    async read(primaryKey) {
        if (primaryKey != null && !stringValidator.isBlank(primaryKey)) {
            try {
                const resp = await Area.findByPk(primaryKey, { include: AreaCoordinates });
                return resp != null ? resp.dataValues : null;
            } catch (e) {
                console.error("AreaDAO: Could not execute the query");
                return null;
            }
        } else {
            console.error("AreaDAO: Wrong parameter provided");
            return null;
        }
    }

    /**
     * The method reads all the areas from the Area SQL table
     * @returns array with all founded Area objects, if operation was successful or null if not
     */
    async readAll() {
        try {
            const resp = await Area.findAll({ include: AreaCoordinates });
            return daoUtil.getDataValues(resp);
        } catch (e) {
            console.error("AreaDAO: Could not execute the query");
            return false;
        }
    }

    /**
     * The method updates existing area data in the Area SQL table
     * @param {Object} data object with the area data, such as areaName or type
     * @returns true, if the operation was successful or false if not
     */
    async update(data) {
        const { areaName } = data;

        if (areaName != null && !stringValidator.isBlank(areaName)) {
            try {
                const resp = await Area.update(
                    data, { where: { areaName: areaName } }
                );

                return resp[0] > 0;
            } catch (e) {
                console.error("AreaDAO: Could not execute the query");
                console.log(e);
                return false;
            }
        } else {
            console.error("AreaDAO: Wrong parameter provided");
            return false;
        }
    }

    /**
     * The method deletes area with provided primary key(areaName)
     * @param {String} primaryKey primary key of the area
     * @returns true if operation was successful or false if not
     */
    async delete(primaryKey) {
        if (primaryKey != null && !stringValidator.isBlank(primaryKey)) {
            try {
                await AreaCoordinates.destroy({ where: { areaName: primaryKey } });
                const resp = await Area.destroy({ where: { areaName: primaryKey } });

                return resp > 0;
            } catch (e) {
                console.error("AreaDAO: Could not execute the query");
                console.log(e);
                return false;
            }
        } else {
            console.error("AreaDAO: Wrong parameter provided");
            return false;
        }
    }
}