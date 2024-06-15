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
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },

    clientUsername: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
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