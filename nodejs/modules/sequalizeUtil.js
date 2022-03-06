//Sequelize dependencies:
//npm install --save sequelize
//npm install --save mariadb

const { Sequelize } = require('sequelize');

let instance = undefined;

const dbSettings = {
    host: process.env.DATABASE_HOST,
    dialect: 'mariadb'
}

const createInstance = () => {
    return new Sequelize(
        process.env.DATABASE,
        process.env.DATABASE_USER,
        process.env.DATABASE_PASSWORD,
        dbSettings
    );
}

const getSequelizeInstance = () => {
    if(!instance)
        instance = createInstance();

    return instance;
};

module.exports.getSequelizeInstance = getSequelizeInstance;