import SequelizeUtil from "../modules/SequelizeUtil.js";
import {DataTypes, Model} from "sequelize";
import Address from "./Address.js";
import Client from "./Client.js";


const sequelize = SequelizeUtil.getSequelizeInstance();
const options = {
    sequelize,
    modelName: 'AsDeliveryAddress',
    freezeTableName: true,
    timestamps: false
};

/**
 * This class represents row of the As delivery address SQL table (intermediate table between address and client tables).
 * Used by the Sequalize ORM for communicating between As delivery address SQL table and this software.
 */
export default class AsDeliveryAddress extends Model {}

AsDeliveryAddress.init({
    clientUsername: {
        type: DataTypes.STRING,
        references: {
            model: Client,
            key: 'clientUsername'
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

Client.belongsToMany(Address, { through: 'AsDeliveryAddress', foreignKey: 'clientUsername', otherKey: 'addressId' });
Address.belongsToMany(Client, { through: 'AsDeliveryAddress', foreignKey: 'addressId', otherKey: 'clientUsername' });