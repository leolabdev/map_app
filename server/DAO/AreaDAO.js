import StringValidator from "../util/StringValidator.js";
import DaoUtil from "../util/DaoUtil.js";
import Area from "../model/Area.js";
import {Op} from "sequelize";


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
        const { areaName, polygon } = data;

        if(!areaName || !polygon){
            console.error('AreaDAO create: Wrong parameter provided');
            return null;
        }

        try {
            if(typeof polygon === 'object')
                return await Area.create({ areaName, polygon: JSON.stringify(polygon) });
            if(typeof polygon === 'string')
                return await Area.create({ areaName, polygon });
        } catch (e) {
            console.error('AreaDAO: Could not execute the query');
            return null;
        }
    }

    /**
     * The method reads area with provided primary key(areaName)
     * @param {String} primaryKey primary key of the area
     * @returns founded Area object, if operation was sucessful or null if not
     */
    async read(primaryKey) {
        if(primaryKey == null){
            console.error('ClientDAO read: Wrong parameter provided');
            return null;
        }

        try {
            const resp = await Area.findByPk(primaryKey);
            return resp != null ? resp.dataValues : null;
        } catch (e) {
            console.error('AreaDAO: Could not execute the query');
            return null;
        }
    }

    /**
     * The method reads all the areas from the Area SQL table
     * @returns array with all founded Area objects, if operation was successful or null if not
     */
    async readAll() {
        try {
            const resp = await Area.findAll();
            return daoUtil.getDataValues(resp);
        } catch (e) {
            console.error('AreaDAO: Could not execute the query');
            return false;
        }
    }

    /**
     * The method updates existing area data in the Area SQL table
     * @param {Object} data object with the area data, such as areaName or type
     * @returns true, if the operation was successful or false if not
     */
    async update(data) {
        const { areaName, polygon } = data;

        if(!areaName || !polygon || typeof polygon !== 'object'){
            console.error('AreaDAO: Wrong parameter provided');
            return false;
        }

        try {
            const resp = await Area.update(
                { areaName, polygon: JSON.stringify(polygon) },
                { where: { areaName } }
            );

            return resp[0] > 0;
        } catch (e) {
            console.error('AreaDAO: Could not execute the query');
            console.log(e);
            return false;
        }
    }

    /**
     * The method deletes area with provided primary key(areaName)
     * @param {String} primaryKey primary key of the area
     * @returns true if operation was successful or false if not
     */
    async delete(primaryKey) {
        if(primaryKey == null || stringValidator.isBlank(primaryKey)){
            console.error('ClientDAO delete: Wrong parameter provided');
            return false;
        }

        try {
            const resp = await Area.destroy({ where: { areaName: primaryKey } });
            return resp > 0;
        } catch (e) {
            console.error('AreaDAO: Could not execute the query');
            console.log(e);
            return false;
        }
    }

    async deleteAllCityCenters() {
        try {
            const resp = await Area.destroy({ where: { areaName: {[Op.like]: '%Center'} } });
            return resp > 0;
        } catch (e) {
            console.error('AreaDAO: Could not execute the query');
            console.log(e);
            return false;
        }
    }
}