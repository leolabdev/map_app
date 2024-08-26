import { DataExtractorType } from "../../../../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/DataExtractorType";
import { DEFactory } from "../../../../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/DEFactory";
import { profile1, profile2 } from "../../../../../../../test_utils/data/profiles";

describe('SequelizeDE class test suite', () => {
    describe('extract()', () => {
        /**
        * @type {SequelizeDE}
        */
        let extractor;

        beforeEach(() => {
            extractor = DEFactory.create(DataExtractorType.SEQUELIZE);
        });

        it('Should return value of dataValues field from object with this field present', () => {
            const validDBResponse = { dataValues: profile1 };

            const resp = extractor.extract(validDBResponse);

            expect(resp).toEqual(validDBResponse.dataValues);
        });

        it('Should return values of "dataValue" fields from array consisting from objects with this field present', () => {
            const dbResp1 = { dataValues: profile1 };
            const dbResp2 = { dataValues: profile2 };
            const dbArray = [ dbResp1, dbResp2 ];
            const expected = [ profile1, profile2 ];

            const resp = extractor.extract(dbArray);

            expect(resp).toEqual(expected);
        });

        it('Should return null if provided param is undefined', () => {
            const resp = extractor.extract(undefined);
            expect(resp).toBeNull()
        });

        it('Should return undefined if provided param is object without "dataValues" field', () => {
            const resp = extractor.extract({});
            expect(resp).toBeUndefined();
        });
    });
});