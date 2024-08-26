import DataExtractorAbstract from "../../../../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/DataExtractorAbstract";
import { DataExtractorType } from "../../../../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/DataExtractorType";
import { DEFactory } from "../../../../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/DEFactory";
import SequelizeDE from "../../../../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/SequelizeDE";

describe('DEFactory class test suite', () => {
    describe('create()', () => {
        it('Should return instance of SequelizeDE for DataExtractorType.SEQUELIZE param', () => {
            const dataExtractor = DEFactory.create(DataExtractorType.SEQUELIZE);

            expect(dataExtractor).toBeInstanceOf(SequelizeDE);
        });

        it('Should return instance of DataExtractorAbstract for undefined param', () => {
            const dataExtractor = DEFactory.create();

            expect(dataExtractor).toBeInstanceOf(DataExtractorAbstract);
        });
    });
});