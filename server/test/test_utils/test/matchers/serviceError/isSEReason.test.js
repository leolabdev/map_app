import { SEReason } from "../../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason";
import isSEReason from "../../../matchers/serviceError/isSEReason";

describe('isSEReason() test suite', () => {
    it('Should return true if the provided value is SEReason', () => {
        const isReason = isSEReason(SEReason.LIMIT_EXCEEDED);
        expect(isReason).toBeTruthy();
    });

    it('Should return false if the provided value is not SEReason', () => {
        const isReason = isSEReason(345);
        expect(isReason).toBeFalsy();
    });

    it('Should return false if the provided value is null', () => {
        const isReason = isSEReason(null);
        expect(isReason).toBeFalsy();
    });
});