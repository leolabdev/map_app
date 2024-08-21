import { paginate } from "../../../../../../../router/api/v2/routeBuilder/core/pipelineHandlers/paginate";

describe('paginate() test suite', () => {

    it('Should sets value of pagination to valid format for the specified query', () => {
        const page = 2;
        const limit = 10;
        const max = 20;
        const reqMock = {
            query: {page, limit}
        };
        const resMock = {};
        const nextMock = jest.fn();
        const paginateHandler = paginate({max});

        paginateHandler(reqMock, resMock, nextMock);

        expect(reqMock.pagination).toEqual(expect.objectContaining({
            page,
            limit,
            offset: (page-1)*limit,
            max
        }));
    });
});