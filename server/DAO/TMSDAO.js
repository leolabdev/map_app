const TMS = require("../model/TMS");
const DaoUtil = require("../util/DaoUtil").DaoUtil;

const daoUtil = new DaoUtil();

class TMSDAO {
    async create(data) {
        const { stationId, sensor1Id, sensor2Id, lon, lat } = data;

        if (daoUtil.containNoNullArr([stationId, sensor1Id, sensor2Id, lon, lat])) {
            try {
                return await TMS.create(data);
            } catch (e) {
                console.log("TMSDAO: Could not execute the query");
                console.log(e);
                return null;
            }
        } else {
            console.log("TMSDAO: Wrong parameter provided");
            return null;
        }
    }

    async createMultiple(data) {
        try {
            return await TMS.bulkCreate(data);
        } catch (e) {
            console.log("TMSDAO: Could not execute the query");
            console.log(e);
            return null;
        }
    }

    async read(primaryKey) {
        if (primaryKey != null) {
            try {
                const resp = await TMS.findByPk(primaryKey);
                return resp != null ? resp.dataValues : null;
            } catch (e) {
                console.log("TMSDAO: Could not execute the query");
                console.log(e);
                return null;
            }
        } else {
            console.error("TMSDAO: Wrong parameter provided");
            return null;
        }
    }

    async readAll() {
        try {
            const resp = await TMS.findAll();
            return daoUtil.getDataValues(resp);
        } catch (e) {
            console.log("TMSDAO: Could not execute the query");
            console.log(e);
            return false;
        }
    }

    async delete(primaryKey) {
        if (primaryKey != null) {
            try {
                const resp = await TMS.destroy({ where: { stationId: primaryKey } });
                return resp > 0;
            } catch (e) {
                console.log("TMSDAO: Could not execute the query");
                console.log(e);
                return false;
            }
        } else {
            console.log("TMSDAO: Wrong parameter provided");
            return false;
        }
    }
}

module.exports = TMSDAO;