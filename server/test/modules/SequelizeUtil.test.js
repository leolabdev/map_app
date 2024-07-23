import SequelizeUtil from "../../modules/SequelizeUtil";
import ClientService from "../../service/ClientService";

describe('SequelizeUtil test suite', () => {
    it('Should connect to DB', async () => {
        const isConnected = await SequelizeUtil.isSequelizeConnected();

        const clientService = new ClientService();
        const resp = await clientService.readOneByIdAndProfileId(1, 1);

        expect(isConnected).toBe(true);
        expect(resp).toBeDefined();
    });
});