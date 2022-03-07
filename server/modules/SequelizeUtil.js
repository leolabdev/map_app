//Sequelize dependencies:
//npm install --save sequelize
//npm install --save mariadb

const { Sequelize } = require('sequelize');

'use strict';

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

class SequelizeUtil {
    getSequelizeInstance = () => {
        if(!instance)
            instance = createInstance();

        return instance;
    }

    isSequelizeConnected = () => {
        try {
            const sequelize = this.getSequelizeInstance();
            const resp = sequelize.authenticate().then(() => {
                console.log('Connection has been established successfully.');
                return true;
            });
            return resp;
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            return false;
        }
    }
}

module.exports.SequelizeUtil = SequelizeUtil;