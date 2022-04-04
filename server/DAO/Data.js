const {Data} = require("../model/Data");
const StringValidator = require("../util/StringValidator").StringValidator;
const DaoUtil = require("../util/DaoUtil").DaoUtil;

const stringValidator = new StringValidator();
const daoUtil = new DaoUtil();

class DataDAO {
    async create(data) {
        const { name, value } = data;

        if (daoUtil.containNoNullArr([name, value]) && daoUtil.containNoBlankArr([name, value])) {
            try {
                if (name != null) {
                    return await Data.create(data);
                } else {
                    return null;
                }
            } catch (e) {
                console.error("DataDAO: Could not execute the query");
                return null;
            }
        } else {
            console.error("DataDAO: Wrong parameter provided");
            return null;
        }
    }

    async read(primaryKey) {
        if (primaryKey != null && !stringValidator.isBlank(primaryKey)) {
            try {
                const resp = await Data.findByPk(primaryKey);
                return resp != null ? resp.dataValues : null;
            } catch (e) {
                console.error("DataDAO: Could not execute the query");
                return null;
            }
        } else {
            console.error("DataDAO: Wrong parameter provided");
            return null;
        }
    }

    async readAll() {
        try {
            const resp = await Data.findAll();
            return daoUtil.getDataValues(resp);
        } catch (e) {
            console.error("DataDAO: Could not execute the query");
            return null;
        }
    }

    async update(data) {
        const { name, value } = data;

        if (daoUtil.containNoNullArr([name, value]) && daoUtil.containNoBlankArr([name, value])) {
            try {
                const resp = await Data.update(
                    data, { where: { name: name } }
                );

                return resp[0] > 0;
            } catch (e) {
                console.error("DataDAO: Could not execute the query");
                console.log(e);
                return false;
            }
        } else {
            console.error("DataDAO: Wrong parameter provided");
            return false;
        }
    }

    async delete(primaryKey) {
        if (primaryKey != null && !stringValidator.isBlank(primaryKey)) {
            try {
                const resp = await Data.destroy({ where: { name: primaryKey } });
                return resp > 0;
            } catch (e) {
                console.error("DataDAO: Could not execute the query");
                console.log(e);
                return false;
            }
        } else {
            console.error("DataDAO: Wrong parameter provided");
            return false;
        }
    }
}

module.exports.DataDAO = DataDAO;