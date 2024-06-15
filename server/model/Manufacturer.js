import SequelizeUtil from "../modules/SequelizeUtil.js";
import {DataTypes, Model} from "sequelize";


const sequelize = SequelizeUtil.getSequelizeInstance();
const options = {
    sequelize,
    modelName: 'Manufacturer',
    freezeTableName: true,
    timestamps: false
};

/**
 * This class represents row of the Manufacturer SQL table.
 * Used by the Sequalize ORM for communicating between Manufacturer SQL table and this software.
 */
export default class Manufacturer extends Model {}

Manufacturer.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    
    username: {
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