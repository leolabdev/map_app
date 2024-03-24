import StringValidator from "../util/StringValidator.js";
import DaoUtil from "../util/DaoUtil.js";
import Address from "../model/Address.js";
import Client from "../model/Client.js";
import AsDeliveryAddress from "../model/AsDeliveryAddress.js";
import OrderData from "../model/OrderData.js";


const stringValidator = new StringValidator();
const daoUtil = new DaoUtil();

/**
 * The class provides functionality for manipulating(CRUD operations) with Client SQL table.
 * This table contains clients data such as client username and name
 */
export default class ClientDAO {
    /**
     * The method creates new client in the Client SQL table
     * @param {Object} data object with the client data, where clientUsername field is manditory
     * @returns created Client object, if operation was sucessful or null if not
     */
    async create(data) {
        const { clientUsername, addressAdd } = data;

        if (daoUtil.containNoNullArr([clientUsername]) && daoUtil.containNoBlankArr([clientUsername])) {
            try {
                if (addressAdd != null) {
                    delete data.addressAdd;
                    const resp = await Client.create(data);
                    await resp.addAddress(addressAdd.addressId);

                    return resp;
                } else {
                    const resp = await Client.create(data);
                    return resp;
                }
            } catch (e) {
                console.error("ClientDAO: Could not execute the query");
                return null;
            }
        } else {
            console.error("ClientDAO: Wrong parameter provided");
            return null;
        }
    }

    /**
     * The method reads Client with provided primary key(clientUsername)
     * @param {String} primaryKey primary key of the client
     * @returns founded Client object, if operation was sucessful or null if not
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
            console.error("ClientDAO: Wrong parameter provided");
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
            console.error("ClientDAO: Could not execute the query");
            return false;
        }
    }

    /**
     * The method updates existing client data in the Client SQL table
     * @param {Object} data object with the client data, such as clientUsername or name
     * @returns true, if the operation was sucessful or false if not
     */
    async update(data) {
        const { clientUsername, addressAdd, addressDelete } = data;

        if (clientUsername != null && !stringValidator.isBlank(clientUsername)) {
            try {
                delete data.clientUsername;
                delete data.addressDelete;
                delete data.addAddress;
                const resp = await Client.update(
                    data, { where: { clientUsername: clientUsername } }
                );

                if (addressAdd != null || addressDelete != null) {
                    const updatedClient = await Client.findByPk(clientUsername);

                    if (updatedClient != null) {
                        if (addressAdd != null) {
                            await updatedClient.addAddress(addressAdd.addressId);
                        }
                        if (addressDelete != null) {
                            await updatedClient.removeAddress(addressDelete.addressId);
                        }
                    } else {
                        console.log("ClientDAO: can not find client with the clientUsername");
                    }
                }

                return resp[0] > 0;
            } catch (e) {
                console.error("ClientDAO: Could not execute the query");
                console.log(e);
                return false;
            }
        } else {
            console.error("ClientDAO: Wrong parameter provided");
            return false;
        }
    }

    /**
     * The method deletes client with provided primary key(clientUsername)
     * @param {String} primaryKey primary key of the client
     * @returns true if operation was sucessful or false if not
     */
    async delete(primaryKey) {
        if (primaryKey != null && !stringValidator.isBlank(primaryKey)) {
            try {
                const allClientAddresses = await AsDeliveryAddress.findAll({ where: { clientUsername: primaryKey } });
                await AsDeliveryAddress.destroy({ where: { clientUsername: primaryKey } });

                await OrderData.destroy({ where: { clientUsername: primaryKey } });

                const resp = await Client.destroy({ where: { clientUsername: primaryKey } });

                if (allClientAddresses != null) {
                    for (let i = 0; i < allClientAddresses.length; i++) {
                        const asAddress = allClientAddresses[i];
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
                console.error("ClientDAO: Could not execute the query");
                console.log(e);
                return false;
            }
        } else {
            console.error("ClientDAO: Wrong parameter provided");
            return false;
        }
    }
}