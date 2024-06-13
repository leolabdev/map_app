import SequelizeUtil from "../modules/SequelizeUtil.js";
import {DataTypes, Model} from "sequelize";


const sequelize = SequelizeUtil.getSequelizeInstance();
const options = {
    sequelize,
    modelName: 'Profile',
    freezeTableName: true,
    timestamps: false
};

/**
 * This class represents row of the Profile SQL table.
 * Used by the Sequalize ORM for communicating between Client SQL table and this software.
 */
export default class Profile extends Model {}

Profile.init({
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

    password: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, options);