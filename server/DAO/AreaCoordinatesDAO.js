import DaoUtil from "../util/DaoUtil.js";
import AreaCoordinates from "../model/AreaCoordinates.js";

const daoUtil = new DaoUtil();

/**
 * The class provides functionality for manipulating(CRUD operations) with AreaCoordinates SQL table.
 * This table contains area objects coordinates(lon, lat) and used for saving GeoJSON polygon and multipolygon objects
 */
export default class AreaCoordinatesDAO {
    /**
     * The method creates new area coordinate in the AreaCoordinates SQL table
     * @param {Object} data object with the area coordinates data, where orderNumber, polygonNumber, lon, lat, areaName fields are manditory
     * @returns created AreaCoordinates object, if operation was sucessful or null if not
     */
    async create(data) {
        const { orderNumber, polygonNumber, lon, lat, areaName } = data;

        if (daoUtil.containNoNullArr([orderNumber, polygonNumber, lon, lat, areaName]) && daoUtil.containNoBlankArr([areaName])) {
            try {
                return await AreaCoordinates.create(data);
            } catch (e) {
                console.log("AreaCoordinatesDAO: Could not execute the query");
                console.log(e);
                return null;
            }
        } else {
            console.log("AreaCoordinatesDAO: Wrong parameter provided");
            return null;
        }
    }

    /**
     * The method creates multiple new area coordinates in the AreaCoordinates SQL table
     * @param {Array} data array with object with the area coordinates data, where orderNumber, polygonNumber, lon, lat, areaName fields are manditory
     * @returns array with created AreaCoordinates objects, if operation was sucessful or null if not
     */
    async createMultiple(data) {
        try {
            return await AreaCoordinates.bulkCreate(data);
        } catch (e) {
            console.log("AreaCoordinatesDAO: Could not execute the query");
            console.log(e);
            return null;
        }
    }

    /**
     * The method reads area coordinate with provided primary key(coordinateId)
     * @param {int} primaryKey primary key of the coordinate
     * @returns founded AreaCoordinates object, if operation was sucessful or null if not
     */
    async read(primaryKey) {
        if (primaryKey != null) {
            try {
                const resp = await AreaCoordinates.findByPk(primaryKey);
                return resp != null ? resp.dataValues : null;
            } catch (e) {
                console.log("AreaCoordinatesDAO: Could not execute the query");
                console.log(e);
                return null;
            }
        } else {
            console.error("AreaCoordinatesDAO: Wrong parameter provided");
            return null;
        }
    }

    /**
     * The method reads all the area coordinates from the AreaCoordinates SQL table
     * @returns array with all founded AreaCoordinates objects, if operation was sucessful or null if not
     */
    async readAll() {
        try {
            const resp = await AreaCoordinates.findAll();
            return daoUtil.getDataValues(resp);
        } catch (e) {
            console.log("AreaCoordinatesDAO: Could not execute the query");
            console.log(e);
            return false;
        }
    }

    /**
     * The method updates existing area coordinate data in the AreaCoordinates SQL table
     * @param {object} data object with the area coordinates data, such as orderNumber, polygonNumber, lon, lat, areaName
     * @returns true, if the operation was sucessful or false if not
     */
    async update(data) {
        const { coordinateId } = data;

        if (coordinateId != null) {
            try {
                const resp = await AreaCoordinates.update(
                    data, { where: { coordinateId: coordinateId } }
                );

                return resp[0] > 0;
            } catch (e) {
                console.log("AreaCoordinatesDAO: Could not execute the query");
                console.log(e);
                return false;
            }
        } else {
            console.log("AreaCoordinatesDAO: Wrong parameter provided");
            return false;
        }
    }

    /**
     * The method deletes area coordinate with provided primary key(coordinateId)
     * @param {int} primaryKey primary key of the area coordinate
     * @returns true if operation was sucessful or false if not
     */
    async delete(primaryKey) {
        if (primaryKey != null) {
            try {
                const resp = await AreaCoordinates.destroy({ where: { coordinateId: primaryKey } });
                return resp > 0;
            } catch (e) {
                console.log("AreaCoordinatesDAO: Could not execute the query");
                console.log(e);
                return false;
            }
        } else {
            console.log("AreaCoordinatesDAO: Wrong parameter provided");
            return false;
        }
    }
}