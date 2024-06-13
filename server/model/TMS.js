import SequelizeUtil from "../modules/SequelizeUtil.js";
import {DataTypes, Model} from "sequelize";


const sequelize = SequelizeUtil.getSequelizeInstance();
const options = {
    sequelize,
    modelName: 'TMS',
    freezeTableName: true,
    timestamps: false
};

/**
 * This class represents row of the TMS(=traffic measurement station) SQL table.
 * Used by the Sequalize ORM for communicating between TMS SQL table and this software.
 */
export default class TMS extends Model {}

TMS.init({
    stationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: false,
        primaryKey: true
    },

    lon: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },

    lat: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },

    polygonCoordinates: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, options);