import { serialize } from "../../../../../../../router/api/v2/routeBuilder/core/pipelineHandlers/serialize";
import { profile1 } from "../../../../../../test_utils/data/profiles";

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
        const resMock = {
            [respFieldName]: profile1
        };
        const nextMock = jest.fn();

        const serializeHandler = serialize(respFieldName, dtoShape, location, dtoField);

        serializeHandler(reqMock, resMock, nextMock);

        expect(resMock[respFieldName]).toEqual({...profile1, password: undefined});
    });
});