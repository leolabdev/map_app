import SequelizeUtil from "../modules/SequelizeUtil.js";
import {DataTypes, Model} from "sequelize";
import Manufacturer from "./Manufacturer.js";
import Address from "./Address.js";


const sequelize = SequelizeUtil.getSequelizeInstance();
const options = {
    sequelize,
    modelName: 'AsShipmentAddress',
    freezeTableName: true,
    timestamps: false
};

/**
 * This class represents row of the As shipment address SQL table (intermediate table between address and manufacturer tables).
 * Used by the Sequalize ORM for communicating between As shipment address SQL table and this software.
 */
export default class AsShipmentAddress extends Model {}

AsShipmentAddress.init({
    manufacturerUsername: {
        type: DataTypes.STRING,
        references: {
            model: Manufacturer,
            key: 'manufacturerUsername'
        }
    },

    addressId: {
        type: DataTypes.INTEGER,
        references: {
            model: Address,
            key: 'addressId'
        }
    }
}, options);

Manufacturer.belongsToMany(Address, { through: 'AsShipmentAddress', foreignKey: 'manufacturerUsername', otherKey: 'addressId' });
Address.belongsToMany(Manufacturer, { through: 'AsShipmentAddress', foreignKey: 'addressId', otherKey: 'manufacturerUsername' });