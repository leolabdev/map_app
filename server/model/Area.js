const { DataTypes, Model } = require('sequelize');
const SequelizeUtil = require("../modules/SequelizeUtil").SequelizeUtil;

const sequelizeUtil = new SequelizeUtil();

const sequelize = sequelizeUtil.getSequelizeInstance();
const options = {
    sequelize,
    modelName: 'Area',
    freezeTableName: true,
    timestamps: false
};

class Area extends Model {}

Area.init({
    areaName: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },

    type: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, options);

module.exports = Area;