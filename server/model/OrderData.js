import SequelizeUtil from "../modules/SequelizeUtil.js";
import {DataTypes, Model} from "sequelize";
import Manufacturer from "./Manufacturer.js";
import Address from "./Address.js";
import Client from "./Client.js";


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
export default class OrderData extends Model {}

OrderData.init({
    id: {
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