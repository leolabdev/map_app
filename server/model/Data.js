const { DataTypes, Model } = require('sequelize');
const SequelizeUtil = require("../modules/SequelizeUtil").SequelizeUtil;

const sequelizeUtil = new SequelizeUtil();

const sequelize = sequelizeUtil.getSequelizeInstance();
const options = {
    sequelize,
    modelName: 'Data',
    freezeTableName: true,
    timestamps: false
};

class Data extends Model{}

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

module.exports.Data = Data;