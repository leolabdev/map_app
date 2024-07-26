import ResponseUtil from "../../util/ResponseUtil";

describe('ResponseUtil class test suite', () => {
    /**
     * @type {ResponseUtil}
     */
    let responseUtil;

    beforeEach(() => {
        responseUtil = new ResponseUtil();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const res = {
        json: jest.fn(),
        end: jest.fn()
    }

    describe('sendStatusOfOperation()', () => {
        it('Should set isSuccess field in json() of res object', () => {
            const input = true;

            responseUtil.sendStatusOfOperation(res, input);

            expect(res.json).toHaveBeenCalledWith({isSuccess: input});
        });

        it('Should call end() only once', () => {
            responseUtil.sendStatusOfOperation(res, false);

            expect(res.end).toHaveBeenCalledTimes(1);
        });
    });

    describe('sendResultOfQuery()', () => {
        it('Should set result field in json() of res object', () => {
            const input = {data: ['one', 'two']};

            responseUtil.sendResultOfQuery(res, input);

            expect(res.json).toHaveBeenCalledWith({result: input});
        });

        it('Should call end() only once', () => {
            responseUtil.sendResultOfQuery(res, false);
            
            expect(res.end).toHaveBeenCalledTimes(1);
        });
    });
});