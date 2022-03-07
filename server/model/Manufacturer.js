const { DataTypes, Model } = require('sequelize');
const SequelizeUtil = require("../modules/SequelizeUtil").SequelizeUtil;

const sequelizeUtil = new SequelizeUtil();

const sequelize = sequelizeUtil.getSequelizeInstance();
const options = {
    sequelize,
    modelName: 'Manufacturer',
    freezeTableName: true,
    timestamps: false
};

class Manufacturer extends Model{}

Manufacturer.init({
    manufacturerId: {
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
    }
}, options);

module.exports.Manufacturer = Manufacturer;