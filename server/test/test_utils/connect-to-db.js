import SequelizeUtil from "../../modules/SequelizeUtil";
import * as mariadb from 'mariadb';

beforeAll(async () => {
    const isConnected = await SequelizeUtil.isSequelizeConnected();
    expect(isConnected).toBe(true);
});

beforeEach(async () => {
    const dbName = process.env.DATABASE;

    const connection = await mariadb.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: dbName
    });
    
    const tables = await connection.query("SHOW TABLES");
    const tableNames = tables
        .filter(row => {
            const tableName = row[`Tables_in_${dbName}`];
            return tableName && !['Area', 'TMS'].includes(tableName);
        })
        .map(row => row[`Tables_in_${dbName}`]);

    for (const tableName of tableNames) {
        await connection.execute(`DELETE FROM \`${tableName}\``);
    }

    await connection.end();
});