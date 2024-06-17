import DaoUtil from "../util/DaoUtil.js";
import TMS from "../model/TMS.js";
import { Op } from "sequelize";
import BasicService from "./BasicService.js";
import { DEFactory } from "../router/api/v2/routeBuilder/core/service/dataExtractors/DEFactory.js";


const daoUtil = new DaoUtil();

/**
 * The class provides functionality for manipulating(CRUD operations) with TMS SQL table.
 * This table contains TMS(=traffic measurement station) data such as station id, sensor1(average speed, pointed to direction 1) id , sensor2(average speed, pointed to direction 2) id, lon, lat
 */
export default class TMSService {
    constructor() {
        this.extractor = DEFactory.create();
        this.service = new BasicService(TMS, 'TMSService');
    }
    
    /**
     * The method creates new TMS(traffic measurement station) in the TMS SQL table
     * @param {TMS} data object with the order data, where stationId, sensor1Id, sensor2Id, lon, lat fields are mandatory
     * @returns created TMS object, if operation was successful or null if not
     */
    async create(data) {
        try {
            return await TMS.create(data);
        } catch (e) {
            console.log("TMSService create: Could not execute the query");
            console.log(e);
            return null;
        }
    }

    /**
     * The method creates multiple TMSs(traffic measurement stations) in the TMS SQL table
     * @param {TMS[]} data array with object with the TMS data, where stationId, sensor1Id, sensor2Id, lon, lat fields are mandatory
     * @returns array with created TMSs objects, if operation was successful or null if not
     */
    async createMultiple(data) {
        try {
            return await TMS.bulkCreate(data);
        } catch (e) {
            console.log("TMSService createMultiple: Could not execute the query");
            console.log(e);
            return null;
        }
    }

    /**
     * The method reads TMS(traffic measurement station) with provided primary key(stationId)
     * @param {int} primaryKey primary key of the TMS
     * @returns founded Order object, if operation was successful or null if not
     */
    async read(primaryKey) {
        if(primaryKey == null){
            console.error("TMSService read: Wrong parameter provided");
            return null;
        }

        try {
            const resp = await TMS.findByPk(primaryKey);
            return resp != null ? resp.dataValues : null;
        } catch (e) {
            console.log("TMSService read: Could not execute the query");
            console.log(e);
            return null;
        }
    }

    async readMultipleByIds(ids) {
        if(ids == null){
            console.error("TMSService read: Wrong parameter provided");
            return null;
        }

        const query = [];
        for(const id of ids)
            query.push({stationId: id});

        try {
            const resp = await TMS.findAll({
                where: { [Op.or]: query },
                attributes: ['polygonCoordinates']
            });
            
            return daoUtil.getDataValues(resp);
        } catch (e) {
            console.log("TMSService read: Could not execute the query");
            console.log(e);
            return null;
        }
    }

    /**
     * The method reads all TMSs(traffic measurement stations) of the TMS SQL table
     * @returns array of the founded TMS objects, if operation was successful or null if not
     */
    async readAll() {
        try {
            const resp = await TMS.findAll();
            return daoUtil.getDataValues(resp);
        } catch (e) {
            console.log("TMSService readAll: Could not execute the query");
            console.log(e);
            return false;
        }
    }

    /**
     * The method deletes TMS(traffic measurement station) with provided primary key(stationId)
     * @param {int} primaryKey primary key of the order
     * @returns true if operation was successful or false if not
     */
    async delete(primaryKey) {
        if(primaryKey == null){
            console.log("TMSService delete: Wrong parameter provided");
            return false;
        }

        try {
            const resp = await TMS.destroy({ where: { stationId: primaryKey }});
            return resp > 0;
        } catch (e) {
            console.log("TMSDAO delete: Could not execute the query");
            console.log(e);
            return false;
        }
    }

    async deleteAll() {
        try {
            const resp = await TMS.destroy({ where: { } });
            return resp > 0;
        } catch (e) {
            console.log("TMSService deleteAll: Could not execute the query");
            console.log(e);
            return false;
        }
    }
}