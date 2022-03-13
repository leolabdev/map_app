const { DataTypes, Model } = require('sequelize');
const {Address} = require("./Address");
const {Client} = require("./Client");
const SequelizeUtil = require("../modules/SequelizeUtil").SequelizeUtil;

const sequelizeUtil = new SequelizeUtil();

const sequelize = sequelizeUtil.getSequelizeInstance();
const options = {
    sequelize,
    modelName: 'AsShipmentAddress',
    freezeTableName: true,
    timestamps: false
};

class AsShipmentAddress extends Model{}

AsShipmentAddress.init({
    clientUsername: {
        type: DataTypes.STRING,
        references: {
            model: Client,
            key: 'clientUsername'
        }
    },

    addressId: {
        type: DataTypes.INTEGER,
        references: {
            model: Address,
            key: 'addressId'
        }
    }
}, options);

Client.belongsToMany(Address, {through: AsShipmentAddress});
Address.belongsToMany(Client, {through: AsShipmentAddress});

module.exports.AsShipmentAddress = AsShipmentAddress;