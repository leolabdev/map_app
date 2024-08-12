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

    //They must be deleted in this order, otherwise error of ref fields will be thrown
    const orderedTables = orderArray(tableNames, ['OrderData', 'Client']);

    for (const tableName of orderedTables) {
        try {
            await connection.execute(`DELETE FROM \`${tableName}\``);
        } catch (error) {
            console.log('Error while clearing DB:', error);
        }
    }

    await connection.end();
});

function orderArray(arr, order) {
    const orderMap = new Map();
    order.forEach((item, index) => {
        orderMap.set(item, index);
    });

    arr.sort((a, b) => {
        if (orderMap.has(a) && orderMap.has(b)) {
            return orderMap.get(a) - orderMap.get(b);
        } else if (orderMap.has(a)) {
            return -1;
        } else if (orderMap.has(b)) {
            return 1;
        } else {
            return 0;
        }
    });

    return arr;
}