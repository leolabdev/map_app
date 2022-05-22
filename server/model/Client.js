const { DataTypes, Model } = require('sequelize');
const SequelizeUtil = require("../modules/SequelizeUtil").SequelizeUtil;

const sequelizeUtil = new SequelizeUtil();

const sequelize = sequelizeUtil.getSequelizeInstance();
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
class Client extends Model {}

Client.init({
    clientUsername: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, options);

module.exports.Client = Client;