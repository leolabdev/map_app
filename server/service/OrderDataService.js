import DaoUtil from "../util/DaoUtil.js";
import OrderData from "../model/OrderData.js";
import {Op} from "sequelize";
import { DEFactory } from "../router/api/v2/test/routeBuilder/core/service/dataExtractors/DEFactory.js";
import BasicService from "./BasicService.js";

const daoUtil = new DaoUtil();

/**
 * The class provides functionality for manipulating(CRUD operations) with Order SQL table.
 * This table contains orders data such as manufacturer username, client username, shipment address id and delivery address id
 */
export default class OrderDataService {
    constructor() {
        this.extractor = DEFactory.create();
        this.service = new BasicService(OrderData, 'OrderDataService');
    }
    
    /**
     * The method creates new Order in the OrderData SQL table
     * @param {OrderData} data object with the order data, where manufacturerUsername, clientUsername, shipmentAddressId, deliveryAddressId fields are mandatory
     * @returns created Order object, if operation was successful or null if not
     */
    async create(data) {
        const { manufacturerId, clientId, shipmentAddressId, deliveryAddressId } = data;

        /* if(!daoUtil.containNoNullArr([manufacturerId, clientId, shipmentAddressId, deliveryAddressId]) ||
            !daoUtil.containNoBlankArr([manufacturerId, clientId])){
            console.log("OrderDataDAO create: Wrong parameter provided");
            return null;
        } */

        try {
            return  await OrderData.create(data);
        } catch (e) {
            console.log("OrderDataDAO create: Could not execute the query");
            console.log(e);
            return null;
        }
    }

    /**
     * The method reads Order with provided primary key(orderId)
     * @param {int} primaryKey primary key of the order
     * @returns founded Order object, if operation was successful or null if not
     */
    async read(primaryKey) {
        if(primaryKey == null){
            console.error("OrderDataDAO: Wrong parameter provided");
            return null;
        }

        try {
            const resp = await OrderData.findByPk(primaryKey, { include: [{ all: true }] });
            return resp != null ? resp.dataValues : null;
        } catch (e) {
            console.log("OrderDataDAO read: Could not execute the query");
            console.log(e);
            return null;
        }
    }

    /**
     * The method reads Order with provided primary keys(orderId)
     * @param {int[]} primaryKeys array with primary keys of the orders
     * @returns array with founded Order objects, if operation was successful or null if not
     */
    async readByIds(primaryKeys) {
        if(!primaryKeys || primaryKeys.length === 0){
            console.error("OrderDataDAO readByIds: Wrong parameter provided");
            return null;
        }

        try {
            let resp = await OrderData.findAll({
                where: {
                    orderId: {
                        [Op.or]: primaryKeys
                    }
                },
                include: [{ all: true }]
            });

            return daoUtil.unpackOrderResp(resp);
        } catch (e) {
            console.log("OrderDataDAO readByIds: Could not execute the query");
            console.log(e);
            return null;
        }
    }

    /**
     * The method reads all Orders of the OrderData SQL table
     * @returns array of the founded Order objects, if operation was sucessful or null if not
     */
    async readAll() {
        try {
            const resp = await OrderData.findAll({ include: [{ all: true }] });
            return daoUtil.getDataValues(resp);
        } catch (e) {
            console.log("OrderDataDAO: Could not execute the query");
            console.log(e);
            return false;
        }
    }

    /**
     * The method updates existing Order data in the OrderDAta SQL table
     * @param {Partial<OrderData>} data object with the order data, such as manufacturerUsername, clientUsername, shipmentAddressId, deliveryAddressId
     * @returns true, if the operation was successful or false if not
     */
    async update(data) {
        const { id } = data;

        if(id == null){
            console.log("OrderDataDAO update: Wrong parameter provided");
            return false;
        }

        try {
            const resp = await OrderData.update(
                data, { where: { id: id } }
            );

            return resp[0] > 0;
        } catch (e) {
            console.log("OrderDataDAO update: Could not execute the query");
            console.log(e);
            return false;
        }
    }

    /**
     * The method deletes order with provided primary key(orderId)
     * @param {int} primaryKey primary key of the order
     * @returns true if operation was successful or false if not
     */
    async delete(primaryKey) {
        if(primaryKey === null || primaryKey === undefined){
            console.log("OrderDataDAO delete: Wrong parameter provided");
            return false;
        }

        try {
            const resp = await OrderData.destroy({ where: { id: primaryKey } });
            return resp > 0;
        } catch (e) {
            console.log("OrderDataDAO delete: Could not execute the query");
            console.log(e);
            return false;
        }
    }
}