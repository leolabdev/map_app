import SequelizeUtil from "../modules/SequelizeUtil.js";
import {DataTypes, Model} from "sequelize";


const sequelize = SequelizeUtil.getSequelizeInstance();
const options = {
    sequelize,
    modelName: 'Client',
    freezeTableName: true,
    timestamps: false
};

/**
 * This class represents row of the Client SQL table.
 * Used by the Sequalize ORM for communicating between Client SQL table and this software.
 */
export default class Client extends Model {}

Client.init({
    clientUsername: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: true
    },

    addressId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, options);