const AreaCoordinates = require("../model/AreaCoordinates");
const Area = require("../model/Area");

const StringValidator = require("../util/StringValidator").StringValidator;
const DaoUtil = require("../util/DaoUtil").DaoUtil;

const stringValidator = new StringValidator();
const daoUtil = new DaoUtil();

class AreaDAO {
    async create(data) {
        const { areaName, type } = data;

        if (daoUtil.containNoNullArr([areaName, type]) && daoUtil.containNoBlankArr([areaName, type])) {
            try {
                return await Area.create(data);
            } catch (e) {
                console.error("AreaDAO: Could not execute the query");
                return null;
            }
        } else {
            console.error("AreaDAO: Wrong parameter provided");
            return null;
        }
    }

    async read(primaryKey) {
        if (primaryKey != null && !stringValidator.isBlank(primaryKey)) {
            try {
                const resp = await Area.findByPk(primaryKey, { include: AreaCoordinates });
                return resp != null ? resp.dataValues : null;
            } catch (e) {
                console.error("AreaDAO: Could not execute the query");
                return null;
            }
        } else {
            console.error("AreaDAO: Wrong parameter provided");
            return null;
        }
    }

    async readAll() {
        try {
            const resp = await Area.findAll({ include: AreaCoordinates });
            return daoUtil.getDataValues(resp);
        } catch (e) {
            console.error("AreaDAO: Could not execute the query");
            return false;
        }
    }

    async update(data) {
        const { areaName } = data;

        if (areaName != null && !stringValidator.isBlank(areaName)) {
            try {
                const resp = await Area.update(
                    data, { where: { areaName: areaName } }
                );

                return resp[0] > 0;
            } catch (e) {
                console.error("AreaDAO: Could not execute the query");
                console.log(e);
                return false;
            }
        } else {
            console.error("AreaDAO: Wrong parameter provided");
            return false;
        }
    }

    async delete(primaryKey) {
        if (primaryKey != null && !stringValidator.isBlank(primaryKey)) {
            try {
                await AreaCoordinates.destroy({ where: { areaName: primaryKey } });
                const resp = await Area.destroy({ where: { areaName: primaryKey } });

                return resp > 0;
            } catch (e) {
                console.error("AreaDAO: Could not execute the query");
                console.log(e);
                return false;
            }
        } else {
            console.error("AreaDAO: Wrong parameter provided");
            return false;
        }
    }
}

module.exports = AreaDAO;