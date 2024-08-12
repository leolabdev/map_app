import {Sequelize} from "sequelize";

const db = createInstance();

/**
 * Make a SQL query straight to DB
 * @param {string} query to execute
 * @returns values from Sequelize response 
 */
export async function makeDBQuery(query){
    try{
        const [resp] = await db.query(query);
        return resp;
    }catch(e){
        console.error('makeDBQuery(): ', e);
        throw e;
    }
}

/**
 * Make a SELECT * SQL query for specified table
 * @param {string} tableName where to search
 * @param {string | undefined} condition SQL condition which goes after WHERE, for example username="user1"
 * @returns found values or null if nothing found
 */
export async function selectFrom(tableName, condition){
    try{
        const query = condition ? `SELECT * FROM ${tableName} WHERE ${condition}` : `SELECT * FROM ${tableName}`;
        const [resp] = await db.query(query);
        return resp && resp.length !== 0 ? resp : null;
    }catch(e){
        console.error('selectFrom(): ', e);
        throw e;
    }
}

/**
 * Make a SELECT * SQL query for specified id
 * @param {string} tableName where to search
 * @param {number} id of item to find
 * @returns found item or null if nothing found
 */
export async function selectById(tableName, id){
    try{
        const [resp] = await db.query(`SELECT * FROM ${tableName} WHERE id=${id}`);
        return resp && resp[0] ? resp[0] : null;
    }catch(e){
        console.error('selectById(): ', e);
        throw e;
    }
}

/**
 * Make a SELECT * SQL query by specified condition and return the first found item.
 *
 * If condition is not specified returns the first found item.
 *
 * @param {string} tableName where to search
 * @param {string | undefined} condition SQL condition which goes after WHERE, for example username="user1"
 * @returns found item or null if nothing found
 */
export async function selectOne(tableName, condition){
    try{
        const query = condition ? `SELECT * FROM ${tableName} WHERE ${condition} LIMIT 1` : `SELECT * FROM ${tableName} LIMIT 1`;
        const [resp] = await db.query(query);
        return resp && resp[0] ? resp[0] : null;
    }catch(e){
        console.error('selectOne(): ', e);
        throw e;
    }
}

/**
 * Make a INSERT SQL query to specified table
 * @param {string} tableName where to insert
 * @param {{}} value object with values to insert, for example {username: "user1", password: "pass"}
 * @returns created item id
 */
export async function insertInto(tableName, value){
    try{
        let fields = '';
        let values = '';

        for(const field in value){
            fields += `${field}, `;
            values += typeof value[field] === 'string' ? `"${value[field]}", ` : `${value[field]}, `
        }
        //Remove ", " from end
        fields = fields.slice(0, -2);
        values = values.slice(0, -2);

        const [resp] = await db.query(`INSERT INTO ${tableName} (${fields}) VALUES (${values})`);
        return resp;
    }catch(e){
        console.error('selectFrom(): ', e);
        throw e;
    }
}

/**
 * Remove all data from the specified table
 * @param {string} tableName what to empty
 */
export async function emptyTable(tableName){
    try{
        await db.query(`DELETE FROM ${tableName}`);
    }catch(e){
        console.error('selectFrom(): ', e);
        throw e;
    }
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