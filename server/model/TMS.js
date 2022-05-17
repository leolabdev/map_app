const { DataTypes, Model } = require('sequelize');
const SequelizeUtil = require("../modules/SequelizeUtil").SequelizeUtil;

const sequelizeUtil = new SequelizeUtil();

const sequelize = sequelizeUtil.getSequelizeInstance();
const options = {
    sequelize,
    modelName: 'TMS',
    freezeTableName: true,
    timestamps: false
};

class TMS extends Model{}

TMS.init({
    stationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: false,
        primaryKey: true
    },

    sensor1Id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    sensor2Id: {
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
    }
}, options);

module.exports = TMS;