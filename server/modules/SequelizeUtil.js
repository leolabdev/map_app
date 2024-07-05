import {Sequelize} from "sequelize";


let instance = undefined;

const dbSettings = {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT || "mariadb",
    logging: false
}

const createInstance = () => {
    return new Sequelize(
        process.env.DATABASE,
        process.env.DATABASE_USER,
        process.env.DATABASE_PASSWORD,
        dbSettings
    );
}

/**
 * This class is a lazy singleton for the Sequalize ORM instanse.
 * For making queries to the DB, Sequalize instance must be created, for example at the beginning of the program
 */
export default class SequelizeUtil {
    static getSequelizeInstance = () => {
        if (!instance){
            instance = createInstance();
            //Adds auto sync for model changes, if set to true
            instance.sync({alter: false});
        }

        return instance;
    }

    static isSequelizeConnected = () => {
        try {
            const sequelize = SequelizeUtil.getSequelizeInstance();
            return sequelize.authenticate().then(() => {
                console.log('Connection has been established successfully.');
                return true;
            });
        } catch (error) {
            console.error('Unable to connect to the database: \n', error);
            return false;
        }
    }
}