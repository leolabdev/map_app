import SequelizeUtil from "../modules/SequelizeUtil.js";
import {DataTypes, Model} from "sequelize";


const sequelize = SequelizeUtil.getSequelizeInstance();
const options = {
    sequelize,
    modelName: 'Data',
    freezeTableName: true,
    timestamps: false
};

/**
 * This class represents row of the Data SQL table.
 * Used by the Sequalize ORM for communicating between Data SQL table and this software.
 */
export default class Data extends Model {}

Data.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },

    value: {
        type: DataTypes.STRING,
        allowNull: true
    },

    lastUpdated: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, options);