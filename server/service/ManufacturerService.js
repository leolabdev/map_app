import StringValidator from "../util/StringValidator.js";
import DaoUtil from "../util/DaoUtil.js";
import Manufacturer from "../model/Manufacturer.js";
import OrderData from "../model/OrderData.js";
import Address from "../model/Address.js";


const stringValidator = new StringValidator();
const daoUtil = new DaoUtil();

/**
 * The class provides functionality for manipulating(CRUD operations) with Manufacturer SQL table.
 * This table contains manufacturers data such as manufacturer username and name
 */
export default class ManufacturerService {
    /**
     * The method creates new Manufacturer in the Manufacturer SQL table
     * @param {Manufacturer} data object with the manufacturer data, where manufacturerUsername field is manditory
     * @returns created Manufacturer object, if operation was successful or null if not
     */
    async create(data) {
        const { manufacturerUsername } = data;

        if(!daoUtil.containNoNullArr([manufacturerUsername]) || !daoUtil.containNoBlankArr([manufacturerUsername])){
            console.error("ManufacturerDAO: Wrong parameter provided");
            return null;
        }
        try {
            return await Manufacturer.create(data);
        } catch (e) {
            console.error("ManufacturerDAO create: Could not execute the query");
            return null;
        }
    }

    /**
     * The method reads Manufacturer with provided primary key(manufacturerUsername)
     * @param {string} primaryKey primary key of the manufacturer
     * @returns founded Manufacturer object, if operation was successful or null if not
     */
    async read(primaryKey) {
        if (primaryKey != null && !stringValidator.isBlank(primaryKey)) {
            try {
                const resp = await Manufacturer.findByPk(primaryKey, { include: Address });
                return resp != null ? resp.dataValues : null;
            } catch (e) {
                console.error("ManufacturerDAO: Could not execute the query");
                return null;
            }
        } else {
            console.error("ManufacturerDAO: Wrong parameter provided");
            return null;
        }
    }

    /**
     * The method reads all Manufacturer of the Manufacturer SQL table
     * @returns array of the founded Manufacturer objects, if operation was successful or null if not
     */
    async readAll() {
        try {
            const resp = await Manufacturer.findAll({ include: Address });
            return daoUtil.getDataValues(resp);
        } catch (e) {
            console.error("ManufacturerDAO: Could not execute the query");
            return false;
        }
    }

    /**
     * The method updates existing manufacturer data in the Manufacturer SQL table
     * @param {Manufacturer} data object with the manufacturer data, such as manufacturerUsername or name
     * @returns true, if the operation was successful or false if not
     */
    async update(data) {
        const { addressIdDelete, ...manufacturer } = data;

        if (!manufacturer || manufacturer.manufacturerUsername == null || stringValidator.isBlank(manufacturer.manufacturerUsername)) {
            console.error("ManufacturerDAO update: Wrong parameter provided");
            return false;
        }

        try {
            if(addressIdDelete)
                manufacturer.addressId = null;

            const resp = await Manufacturer.update(
                manufacturer, { where: { manufacturerUsername: manufacturer.manufacturerUsername } }
            );

            return resp[0] > 0;
        } catch (e) {
            console.error("ManufacturerDAO update: Could not execute the query");
            console.log(e);
            return false;
        }
    }

    /**
     * The method deletes manufacturer with provided primary key(manufacturerUsername)
     * @param {string} primaryKey primary key of the manufacturer
     * @returns true if operation was successful or false if not
     */
    async delete(primaryKey) {
        if(primaryKey == null || stringValidator.isBlank(primaryKey)){
            console.error("ManufacturerDAO delete: Wrong parameter provided");
            return false;
        }

        try {
            await OrderData.destroy({ where: { manufacturerUsername: primaryKey } });
            const resp = await Manufacturer.destroy({ where: { manufacturerUsername: primaryKey } });
            return resp > 0;
        } catch (e) {
            console.error("ManufacturerDAO delete: Could not execute the query");
            console.log(e);
            return false;
        }
    }
}