import StringValidator from "../util/StringValidator.js";
import DaoUtil from "../util/DaoUtil.js";
import Address from "../model/Address.js";


const stringValidator = new StringValidator();
const daoUtil = new DaoUtil();

/**
 * The class provides functionality for manipulating(CRUD operations) with Address SQL table.
 * This table contains addresses data such as city, street, building number, flat and coordinates(lon, lat)
 */
export default class AddressDAO {
    /**
     * The method creates new address in the Address SQL table
     * @param {Object} data object with the address data, where city, street, building, lon, lat fields are manditory
     * @returns created Address object, if operation was sucessful or null if not
     */
    async create(data) {
        const { city, street, building, lon, lat } = data;

        if (daoUtil.containNoNullArr([city, street, building, lon, lat]) && daoUtil.containNoBlankArr([city, street, building])) {
            try {
                return await Address.create(data);
            } catch (e) {
                console.error("AddressDAO create: Could not execute the query");
                return null;
            }
        } else {
            console.error("AddressDAO create: Wrong parameter provided");
            return null;
        }
    }

    /**
     * The method reads Address with provided primary key(addressId)
     * @param {int} primaryKey primary key of the address
     * @returns founded Address object, if operation was sucessful or null if not
     */
    async read(primaryKey) {
        if (primaryKey != null && !stringValidator.isBlank(primaryKey)) {
            try {
                const resp = await Address.findByPk(primaryKey);
                return resp != null ? resp.dataValues : null;
            } catch (e) {
                console.error("AddressDAO: Could not execute the query");
                console.log(e);
                return null;
            }
        } else {
            console.error("AddressDAO: Wrong parameter provided");
            return null;
        }
    }

    /**
     * The method reads all Address of the Address SQL table
     * @returns founded Addresses objects array, if operation was sucessful or null if not
     */
    async readAll() {
        try {
            const resp = await Address.findAll();
            return daoUtil.getDataValues(resp);
        } catch (e) {
            console.error("AddressDAO: Could not execute the query");
            console.log(e);
            return null;
        }
    }

    /**
     * The method updates existing address data in the Address SQL table
     * @param {Object} data object with the address data, such as city, street, building, flat, lon, lat
     * @returns updated Address object, if operation was sucessful or null if not
     */
    async update(data) {
        const { addressId, city, street, building } = data;
        if (addressId != null && daoUtil.containNoBlankArr([city, street, building])) {
            try {
                delete data.addressId;
                const resp = await Address.update(
                    data, { where: { addressId: addressId } }
                );
                return resp[0];
            } catch (e) {
                console.error("AddressDAO: Could not execute the query");
                console.log(e);
                return null;
            }
        } else {
            console.error("AddressDAO: Wrong parameter provided");
            return null;
        }
    }

    /**
     * The method deletes Address with provided primary key(addressId)
     * @param {int} primaryKey primary key of the address
     * @returns true if operation was sucessful or false if not
     */
    async delete(primaryKey) {
        if (primaryKey != null && !stringValidator.isBlank(primaryKey)) {
            try {
                const resp = await Address.destroy({ where: { addressId: primaryKey } });
                return resp > 0;
            } catch (e) {
                console.error("AddressDAO: Could not execute the query");
                console.log(e);
                return false;
            }
        } else {
            console.error("AddressDAO: Wrong parameter provided");
            return false;
        }
    }

    /**
     * The method searches for all Address with provided fields
     * @param {Object} options object, which contains searching parameters, such as city, street, building, flat, lon, lat
     * @returns founded Address objects array, if operation was sucessful or null if not
     */
    async search(options) {
        if (options != null) {
            try {
                const resp = await Address.findAll({ where: options });
                return daoUtil.getDataValues(resp);
            } catch (e) {
                console.error("AddressDAO: Could not execute the query");
                console.log(e);
                return null;
            }
        } else {
            console.error("AddressDAO: Wrong parameter provided");
            return null;
        }
    }
}