import SequelizeUtil from "../../modules/SequelizeUtil";
 

beforeAll(async () => {
    const isConnected = await SequelizeUtil.isSequelizeConnected();

    expect(isConnected).toBe(true);
});