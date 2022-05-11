const AreaCoordinates = require("../model/AreaCoordinates");
const DaoUtil = require("../util/DaoUtil").DaoUtil;

const daoUtil = new DaoUtil();

class AreaCoordinatesDAO {
    async create(data) {
        const { orderNumber, polygonNumber, lon, lat, areaName } = data;

        if (daoUtil.containNoNullArr([orderNumber, polygonNumber, lon, lat, areaName]) && daoUtil.containNoBlankArr([areaName])) {
            try {
                return await AreaCoordinates.create(data);
            } catch (e) {
                console.log("AreaCoordinatesDAO: Could not execute the query");
                console.log(e);
                return null;
            }
        } else {
            console.log("AreaCoordinatesDAO: Wrong parameter provided");
            return null;
        }
    }

    async createMultiple(data) {
        try {
            return await AreaCoordinates.bulkCreate(data);
        } catch (e) {
            console.log("AreaCoordinatesDAO: Could not execute the query");
            console.log(e);
            return null;
        }
    }

    async read(primaryKey) {
        if (primaryKey != null) {
            try {
                const resp = await AreaCoordinates.findByPk(primaryKey);
                return resp != null ? resp.dataValues : null;
            } catch (e) {
                console.log("AreaCoordinatesDAO: Could not execute the query");
                console.log(e);
                return null;
            }
        } else {
            console.error("AreaCoordinatesDAO: Wrong parameter provided");
            return null;
        }
    }

    async readAll() {
        try {
            const resp = await AreaCoordinates.findAll();
            return daoUtil.getDataValues(resp);
        } catch (e) {
            console.log("AreaCoordinatesDAO: Could not execute the query");
            console.log(e);
            return false;
        }
    }

    async update(data) {
        const { coordinateId } = data;

        if (coordinateId != null) {
            try {
                const resp = await AreaCoordinates.update(
                    data, { where: { coordinateId: coordinateId } }
                );

                return resp[0] > 0;
            } catch (e) {
                console.log("AreaCoordinatesDAO: Could not execute the query");
                console.log(e);
                return false;
            }
        } else {
            console.log("AreaCoordinatesDAO: Wrong parameter provided");
            return false;
        }
    }

    async delete(primaryKey) {
        if (primaryKey != null) {
            try {
                const resp = await AreaCoordinates.destroy({ where: { coordinateId: primaryKey } });
                return resp > 0;
            } catch (e) {
                console.log("AreaCoordinatesDAO: Could not execute the query");
                console.log(e);
                return false;
            }
        } else {
            console.log("AreaCoordinatesDAO: Wrong parameter provided");
            return false;
        }
    }
}

module.exports = AreaCoordinatesDAO;