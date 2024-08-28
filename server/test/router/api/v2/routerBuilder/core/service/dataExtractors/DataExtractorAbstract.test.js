import DataExtractorAbstract from "../../../../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/DataExtractorAbstract";
import { misconfiguredError } from "../../../../../../../test_utils/data/serviceErrors";

describe('DataExtractorAbstract class test suite', () => {
    const dataExtractor = new DataExtractorAbstract();
    describe('extract()', () => {
        it('Should throw ServiceError METHOD_NOT_IMPLEMENTED', () => {
            expect(() => dataExtractor.extract()).toThrow(expect.objectContaining(misconfiguredError));
        });
    });
});