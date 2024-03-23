import StringValidator from "../util/StringValidator.js";
import DaoUtil from "../util/DaoUtil.js";


const stringValidator = new StringValidator();
const daoUtil = new DaoUtil();

/**
 * The class provides functionality for manipulating(CRUD operations) with Manufacturer SQL table.
 * This table contains manufacturers data such as manufacturer username and name
 */
export default class ManufacturerDAO {
    /**
     * The method creates new Manufacturer in the Manufacturer SQL table
     * @param {Object} data object with the manufacturer data, where manufacturerUsername field is manditory
     * @returns created Manufacturer object, if operation was sucessful or null if not
     */
    async create(data) {
        const { manufacturerUsername, addressAdd } = data;

        if (daoUtil.containNoNullArr([manufacturerUsername]) && daoUtil.containNoBlankArr([manufacturerUsername])) {
            try {
                if (addressAdd != null) {
                    delete data.addressAdd;
                    const resp = await Manufacturer.create(data);
                    await resp.addAddress(addressAdd.addressId);

                    return resp;
                } else {
                    const resp = await Manufacturer.create(data);
                    return resp;
                }
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
     * The method reads Manufacturer with provided primary key(manufacturerUsername)
     * @param {String} primaryKey primary key of the manufacturer
     * @returns founded Manufacturer object, if operation was sucessful or null if not
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
     * @returns array of the founded Manufacturer objects, if operation was sucessful or null if not
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
     * @param {Object} data object with the manufacturer data, such as manufacturerUsername or name
     * @returns true, if the operation was sucessful or false if not
     */
    async update(data) {
        const { manufacturerUsername, addressAdd, addressDelete } = data;

        if (manufacturerUsername != null && !stringValidator.isBlank(manufacturerUsername)) {
            try {
                delete data.manufacturerUsername;
                delete data.addressAdd;
                delete data.addressDelete;
                const resp = await Manufacturer.update(
                    data, { where: { manufacturerUsername: manufacturerUsername } }
                );

                if (addressAdd != null || addressDelete != null) {
                    const updatedManufacturer = await Manufacturer.findByPk(manufacturerUsername);

                    if (updatedManufacturer != null) {
                        if (addressAdd != null) {
                            await updatedManufacturer.addAddress(addressAdd.addressId);
                        }
                        if (addressDelete != null) {
                            await updatedManufacturer.removeAddress(addressDelete.addressId);
                        }
                    } else {
                        console.log("ManufacturerDAO: can not find client with the manufacturerUsername");
                    }
                }

                return resp[0] > 0;
            } catch (e) {
                console.log("ManufacturerDAO: Could not execute the query");
                console.log(e);
                return false;
            }
        } else {
            console.log("ManufacturerDAO: Wrong parameter provided");
            return false;
        }
    }

    /**
     * The method deletes manufacturer with provided primary key(manufacturerUsername)
     * @param {String} primaryKey primary key of the manufacturer
     * @returns true if operation was sucessful or false if not
     */
    async delete(primaryKey) {
        if (primaryKey != null && !stringValidator.isBlank(primaryKey)) {
            try {
                const allManufacturerAddresses = await AsShipmentAddress.findAll({ where: { manufacturerUsername: primaryKey } });
                await AsShipmentAddress.destroy({ where: { manufacturerUsername: primaryKey } });

                await OrderData.destroy({ where: { manufacturerUsername: primaryKey } });

                const resp = await Manufacturer.destroy({ where: { manufacturerUsername: primaryKey } });

                if (allManufacturerAddresses != null) {
                    for (let i = 0; i < allManufacturerAddresses.length; i++) {
                        const asAddress = allManufacturerAddresses[i];
                        const address = await Address.findByPk(asAddress.addressId);

                        const manufacturers = await address.getManufacturers();
                        const clients = await address.getClients();

                        if (manufacturers.length === 0 && clients.length === 0) {
                            Address.destroy({ where: { addressId: address.addressId } });
                        }
                    }
                }

                return resp > 0;
            } catch (e) {
                console.error("ManufacturerDAO: Could not execute the query");
                return false;
            }
        } else {
            console.error("ManufacturerDAO: Wrong parameter provided");
            return false;
        }
    }
}