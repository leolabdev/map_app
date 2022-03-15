const { Address } = require("../model/Address");
const { AsDeliveryAddress } = require("../model/AsDeliveryAddress");

const StringValidator = require("../util/StringValidator").StringValidator;
const Client = require("../model/Client").Client;
const DaoUtil = require("../util/DaoUtil").DaoUtil;

const stringValidator = new StringValidator();
const daoUtil = new DaoUtil();

class ClientDAO {
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

    async readAll() {
        try {
            const resp = await Client.findAll({ include: Address });
            return daoUtil.getDataValues(resp);
        } catch (e) {
            console.error("ClientDAO: Could not execute the query");
            return false;
        }
    }

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
                            const test = await updatedClient.addAddress(addressAdd.addressId);
                        }
                        if (addressDelete != null) {
                            await updatedClient.removeAddress(addressDelete.addressId);
                        }
                    } else {
                        console.log("ClientDAO: can not find client with the clientUsername");
                    }
                }

                return resp;
            } catch (e) {
                console.error("ClientDAO: Could not execute the query");
                console.log(e);
                return null;
            }
        } else {
            console.error("ClientDAO: Wrong parameter provided");
            return null;
        }
    }

    async delete(primaryKey) {
        if (primaryKey != null && !stringValidator.isBlank(primaryKey)) {
            try {
                const allClientAddresses = await AsDeliveryAddress.findAll({ where: { clientUsername: primaryKey } });
                await AsDeliveryAddress.destroy({ where: { clientUsername: primaryKey } });

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
                return false;
            }
        } else {
            console.error("ClientDAO: Wrong parameter provided");
            return false;
        }
    }
}

module.exports.ClientDAO = ClientDAO;