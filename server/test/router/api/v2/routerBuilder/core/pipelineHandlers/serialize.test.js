import { serialize } from "../../../../../../../router/api/v2/routeBuilder/core/pipelineHandlers/serialize";
import ProfileGenerator from "../../../../../../test_utils/data/ProfileGenerator";

describe('serialize() test suite', () => {
    it('Should remove all fields from the res object dtoField, which value is not set to true', () => {
        const respFieldName = 'data';
        const dtoShape = {
            username: true,
            password: false
        };
        const location = 'res';
        const dtoField = respFieldName;
        const reqMock = {};
        const profileGen = new ProfileGenerator();
        const profile = profileGen.create();
        const resMock = {
            [respFieldName]: profile
        };
        const nextMock = jest.fn();

        const serializeHandler = serialize(respFieldName, dtoShape, location, dtoField);

        serializeHandler(reqMock, resMock, nextMock);

        expect(resMock[respFieldName]).toEqual({...profile, password: undefined});
    });
});