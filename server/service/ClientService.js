import StringValidator from "../util/StringValidator.js";
import DaoUtil from "../util/DaoUtil.js";
import Address from "../model/Address.js";
import Client from "../model/Client.js";
import OrderData from "../model/OrderData.js";
import { DEFactory } from "../router/api/v2/test/routeBuilder/core/service/dataExtractors/DEFactory.js";
import BasicService from "./BasicService.js";
import { clientCreate } from "./validation/client.js";


const stringValidator = new StringValidator();
const daoUtil = new DaoUtil();

/**
 * The class provides functionality for manipulating(CRUD operations) with Client SQL table.
 * This table contains clients data such as client username and name
 */
export default class ClientService {
    constructor() {
        this.extractor = DEFactory.create();
        this.service = new BasicService(Client, 'ClientService');
    }
    
    /**
     * The method creates new client in the Client SQL table
     * @param {Client} data object with the client data, where clientUsername field is mandatory
     * @returns created Client object, if operation was successful or null if not
     */
    async create(data) {
        return this.service.create(data, clientCreate);
    }

    /**
     * The method reads Client with provided primary key(clientUsername)
     * @param {string} primaryKey primary key of the client
     * @returns founded Client object, if operation was successful or null if not
     */
    async read(primaryKey) {
        if (primaryKey != null && !stringValidator.isBlank(primaryKey)) {
            try {
                const resp = await Client.findByPk(primaryKey, { include: Address });
                return resp != null ? resp.dataValues : null;
            } catch (e) {
                console.error("ClientDAO: Could not execute the query");
                return null;
            }
        } else {
            console.error("ClientDAO read: Wrong parameter provided");
            return null;
        }
    }

    /**
     * The method reads all Clients of the Client SQL table
     * @returns array of the founded Client objects, if operation was sucessful or null if not
     */
    async readAll() {
        try {
            const resp = await Client.findAll({ include: Address });
            return daoUtil.getDataValues(resp);
        } catch (e) {
            console.error("ClientDAO readAll: Could not execute the query");
            return false;
        }
    }

    /**
     * The method updates existing client data in the Client SQL table
     * @param {Client} data object with the client data, such as clientUsername or name
     * @returns true, if the operation was sucessful or false if not
     */
    async update(data) {
        const { addressIdDelete, ...client } = data;

        if (!client || client.clientUsername == null || stringValidator.isBlank(client.clientUsername)) {
            console.error("ClientDAO update: Wrong parameter provided");
            return false;
        }

        try {
            if(addressIdDelete)
                client.addressId = null;

            const resp = await Client.update(
                client, { where: { clientUsername: client.clientUsername } }
            );

            return resp[0] > 0;
        } catch (e) {
            console.error("ClientDAO update: Could not execute the query");
            console.error(e);
            return false;
        }
    }

    /**
     * The method deletes client with provided primary key(clientUsername)
     * @param {string} primaryKey primary key of the client
     * @returns true if operation was sucessful or false if not
     */
    async delete(primaryKey) {
        if(primaryKey == null || stringValidator.isBlank(primaryKey)){
            console.error("ClientDAO delete: Wrong parameter provided");
            return false;
        }

        try {
            await OrderData.destroy({ where: { clientUsername: primaryKey } });
            const resp = await Client.destroy({ where: { clientUsername: primaryKey } });
            return resp > 0;
        } catch (e) {
            console.error("ClientDAO delete: Could not execute the query");
            console.log(e);
            return false;
        }
    }
}