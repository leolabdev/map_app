const { DataTypes, Model } = require('sequelize');
const SequelizeUtil = require("../modules/SequelizeUtil").SequelizeUtil;

const sequelizeUtil = new SequelizeUtil();

const sequelize = sequelizeUtil.getSequelizeInstance();
const options = {
    sequelize,
    modelName: 'Address',
    freezeTableName: true,
    timestamps: false
};

class Address extends Model{}

Address.init({
    addressId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
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
    }
}, options);

module.exports.Address = Address;