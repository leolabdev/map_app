import rateLimit from "express-rate-limit";

jest.mock('express-rate-limit');

import { addReqLimit } from "../../../../../../../router/api/v2/routeBuilder/core/pipelineHandlers/addReqLimit";

describe('addReqLimit() test suite', () => {
    it('Should call rateLimit() with valid parameters', () => {
        const interval = 1000;
        const expectedParam = {
            windowMs: interval, max: 1, 
            standardHeaders: true, legacyHeaders: false
        }
        rateLimit.mockImplementation((options) => options);

        const params = addReqLimit(interval);

        expect(params).toEqual(expect.objectContaining(expectedParam));
    });
});