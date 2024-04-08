import SequelizeUtil from "../modules/SequelizeUtil.js";
import {DataTypes, Model} from "sequelize";


const sequelize = SequelizeUtil.getSequelizeInstance();
const options = {
    sequelize,
    modelName: 'Area',
    freezeTableName: true,
    timestamps: false
};

/**
 * This class represents row of the Area SQL table.
 * Used by the Sequalize ORM for communicating between Area SQL table and this software.
 */
export default class Area extends Model {}

Area.init({
    areaName: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },

    polygon: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, options);