const StringValidator = require("../util/StringValidator").StringValidator;
const Address = require("../model/Address").Address;
const DaoUtil = require("../util/DaoUtil").DaoUtil;

const stringValidator = new StringValidator();
const daoUtil = new DaoUtil();

class AddressDAO {
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

module.exports.AddressDAO = AddressDAO;