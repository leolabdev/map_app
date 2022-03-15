const { DataTypes, Model } = require('sequelize');
const {Manufacturer} = require("./Manufacturer");
const {Client} = require('./Client');
const {Address} = require("./Address");
const SequelizeUtil = require("../modules/SequelizeUtil").SequelizeUtil;

const sequelizeUtil = new SequelizeUtil();

const sequelize = sequelizeUtil.getSequelizeInstance();
const options = {
    sequelize,
    modelName: 'OrderData',
    freezeTableName: true,
    timestamps: false
};

class OrderData extends Model{}

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
Address.hasMany(OrderData, { as: 'ShipmentAddress', foreignKey: 'shipmentAddressId' });
Address.hasMany(OrderData, { as: 'DeliveryAddress', foreignKey: 'deliveryAddressId' });

OrderData.belongsTo(Manufacturer);
OrderData.belongsTo(Client);
OrderData.belongsTo(Address);

module.exports.OrderData = OrderData;