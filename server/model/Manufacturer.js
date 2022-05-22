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

/**
 * This class represents row of the Manufacturer SQL table.
 * Used by the Sequalize ORM for communicating between Manufacturer SQL table and this software.
 */
class Manufacturer extends Model {}

Manufacturer.init({
    manufacturerUsername: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, options);

module.exports.Manufacturer = Manufacturer;