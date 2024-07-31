import {Sequelize} from "sequelize";

const db = createInstance();

/**
 * Make a SQL query straight to DB
 * @param {string} query to execute
 * @returns values from Sequelize response 
 */
export async function makeDBQuery(query){
    const [resp] = await db.query(query);
    return resp;
}

/**
 * Create a Sequelize instance
 * @returns Sequelize
 */
function createInstance () {
    const dbSettings = {
        host: process.env.DATABASE_HOST,
        dialect: process.env.DATABASE_DIALECT || "mariadb",
        logging: false
    }

    return new Sequelize(
        process.env.DATABASE,
        process.env.DATABASE_USER,
        process.env.DATABASE_PASSWORD,
        dbSettings
    );
}