const { DataTypes, Model } = require('sequelize');
const { Manufacturer } = require("./Manufacturer");
const { Client } = require('./Client');
const { Address } = require("./Address");
const SequelizeUtil = require("../modules/SequelizeUtil");

const sequelize = SequelizeUtil.getSequelizeInstance();
const options = {
    sequelize,
    modelName: 'OrderData',
    freezeTableName: true,
    timestamps: false
};

/**
 * This class represents row of the Order Data SQL table.
 * Used by the Sequalize ORM for communicating between Order data SQL table and this software.
 */
class OrderData extends Model {}

OrderData.init({
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },

    manufacturerUsername: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    clientUsername: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    shipmentAddressId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    deliveryAddressId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, options);

Manufacturer.hasMany(OrderData, { foreignKey: 'manufacturerUsername' });
Client.hasMany(OrderData, { foreignKey: 'clientUsername' });
Address.hasMany(OrderData, { as: 'shipmentAddress', foreignKey: 'shipmentAddressId' });
Address.hasMany(OrderData, { as: 'deliveryAddress', foreignKey: 'deliveryAddressId' });

OrderData.belongsTo(Manufacturer, { foreignKey: 'manufacturerUsername' });
OrderData.belongsTo(Client, { foreignKey: 'clientUsername' });
OrderData.belongsTo(Address, { as: 'shipmentAddress', foreignKey: 'shipmentAddressId' });
OrderData.belongsTo(Address, { as: 'deliveryAddress', foreignKey: 'deliveryAddressId' });

module.exports.OrderData = OrderData;