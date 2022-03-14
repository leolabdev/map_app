const { DataTypes, Model } = require('sequelize');
const { Address } = require("./Address");
const { Client } = require("./Client");
const SequelizeUtil = require("../modules/SequelizeUtil").SequelizeUtil;

const sequelizeUtil = new SequelizeUtil();

const sequelize = sequelizeUtil.getSequelizeInstance();
const options = {
    sequelize,
    modelName: 'AsDeliveryAddress',
    freezeTableName: true,
    timestamps: false
};

class AsDeliveryAddress extends Model {}

AsDeliveryAddress.init({
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

Client.belongsToMany(Address, { through: 'AsDeliveryAddress', foreignKey: 'clientUsername', otherKey: 'addressId' });
Address.belongsToMany(Client, { through: 'AsDeliveryAddress', foreignKey: 'addressId', otherKey: 'clientUsername' });

module.exports.AsDeliveryAddress = AsDeliveryAddress;