import SequelizeUtil from "../modules/SequelizeUtil.js";
import {DataTypes, Model} from "sequelize";
import Profile from "./Profile.js";


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

    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: true
    },

    type: {
        type: DataTypes.STRING,
        allowNull: false
    },

    city: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    street: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    building: {
        type: DataTypes.STRING(10),
        allowNull: false
    },

    flat: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    lon: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },

    lat: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },

    profileId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, options);

Profile.hasMany(Client, { foreignKey: 'profileId' });

Client.belongsTo(Profile, { foreignKey: 'profileId' });