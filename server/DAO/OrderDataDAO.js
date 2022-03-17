const { OrderData } = require("../model/OrderData");

const DaoUtil = require("../util/DaoUtil").DaoUtil;

const daoUtil = new DaoUtil();

class OrderDataDAO {
    async create(data) {
        const { manufacturerUsername, clientUsername, shipmentAddressId, deliveryAddressId } = data;

        if (daoUtil.containNoNullArr([manufacturerUsername, clientUsername, shipmentAddressId, deliveryAddressId]) && daoUtil.containNoBlankArr([manufacturerUsername, clientUsername])) {
            try {
                const resp = await OrderData.create(data);
                return resp;
            } catch (e) {
                console.log("OrderDataDAO: Could not execute the query");
                console.log(e);
                return null;
            }
        } else {
            console.log("OrderDataDAO: Wrong parameter provided");
            return null;
        }
    }

    async read(primaryKey) {
        if (primaryKey != null) {
            try {
                const resp = await OrderData.findByPk(primaryKey, { include: [{ all: true }] });
                return resp != null ? resp.dataValues : null;
            } catch (e) {
                console.log("OrderDataDAO: Could not execute the query");
                console.log(e);
                return null;
            }
        } else {
            console.error("OrderDataDAO: Wrong parameter provided");
            return null;
        }
    }

    async readAll() {
        try {
            const resp = await OrderData.findAll({ include: [{ all: true }] });
            return daoUtil.getDataValues(resp);
        } catch (e) {
            console.log("OrderDataDAO: Could not execute the query");
            console.log(e);
            return false;
        }
    }

    async update(data) {
        const { orderId } = data;

        if (orderId != null) {
            try {
                const resp = await OrderData.update(
                    data, { where: { orderId: orderId } }
                );

                return resp[0] > 0;
            } catch (e) {
                console.log("OrderDataDAO: Could not execute the query");
                console.log(e);
                return false;
            }
        } else {
            console.log("OrderDataDAO: Wrong parameter provided");
            return false;
        }
    }

    async delete(primaryKey) {
        if (primaryKey != null) {
            try {
                const resp = await OrderData.destroy({ where: { orderId: primaryKey } });
                return resp > 0;
            } catch (e) {
                console.log("OrderDataDAO: Could not execute the query");
                console.log(e);
                return false;
            }
        } else {
            console.log("OrderDataDAO: Wrong parameter provided");
            return false;
        }
    }
}

module.exports.OrderDataDAO = OrderDataDAO;