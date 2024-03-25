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
    manufacturerUsername: {
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