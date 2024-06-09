import DaoUtil from "../util/DaoUtil.js";
import TMS from "../model/TMS.js";


const daoUtil = new DaoUtil();

/**
 * The class provides functionality for manipulating(CRUD operations) with TMS SQL table.
 * This table contains TMS(=traffic measurement station) data such as station id, sensor1(average speed, pointed to direction 1) id , sensor2(average speed, pointed to direction 2) id, lon, lat
 */
export default class TMSDAO {
    /**
     * The method creates new TMS(traffic measurement station) in the TMS SQL table
     * @param {Object} data object with the order data, where stationId, sensor1Id, sensor2Id, lon, lat fields are manditory
     * @returns created TMS object, if operation was sucessful or null if not
     */
    async create(data) {
        const { stationId, sensor1Id, sensor2Id, lon, lat } = data;

        if (daoUtil.containNoNullArr([stationId, sensor1Id, sensor2Id, lon, lat])) {
            try {
                return await TMS.create(data);
            } catch (e) {
                console.log("TMSDAO: Could not execute the query");
                console.log(e);
                return null;
            }
        } else {
            console.log("TMSDAO: Wrong parameter provided");
            return null;
        }
    }

    /**
     * The method creates multiple TMSs(traffic measurement stations) in the TMS SQL table
     * @param {Array} data array with object with the TMS data, where stationId, sensor1Id, sensor2Id, lon, lat fields are manditory
     * @returns array with created TMSs objects, if operation was sucessful or null if not
     */
    async createMultiple(data) {
        try {
            return await TMS.bulkCreate(data);
        } catch (e) {
            console.log("TMSDAO: Could not execute the query");
            console.log(e);
            return null;
        }
    }

    /**
     * The method reads TMS(traffic measurement station) with provided primary key(stationId)
     * @param {int} primaryKey primary key of the TMS
     * @returns founded Order object, if operation was sucessful or null if not
     */
    async read(primaryKey) {
        if (primaryKey != null) {
            try {
                const resp = await TMS.findByPk(primaryKey);
                return resp != null ? resp.dataValues : null;
            } catch (e) {
                console.log("TMSDAO: Could not execute the query");
                console.log(e);
                return null;
            }
        } else {
            console.error("TMSDAO: Wrong parameter provided");
            return null;
        }
    }

    /**
     * The method reads all TMSs(traffic measurement stations) of the TMS SQL table
     * @returns array of the founded TMS objects, if operation was sucessful or null if not
     */
    async readAll() {
        try {
            const resp = await TMS.findAll();
            return daoUtil.getDataValues(resp);
        } catch (e) {
            console.log("TMSDAO: Could not execute the query");
            console.log(e);
            return false;
        }
    }

    /**
     * The method deletes TMS(traffic measurement station) with provided primary key(stationId)
     * @param {int} primaryKey primary key of the order
     * @returns true if operation was sucessful or false if not
     */
    async delete(primaryKey) {
        if (primaryKey != null) {
            try {
                const resp = await TMS.destroy({ where: { stationId: primaryKey } });
                return resp > 0;
            } catch (e) {
                console.log("TMSDAO: Could not execute the query");
                console.log(e);
                return false;
            }
        } else {
            console.log("TMSDAO: Wrong parameter provided");
            return false;
        }
    }
}