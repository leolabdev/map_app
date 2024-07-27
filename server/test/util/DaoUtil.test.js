import DaoUtil from "../../util/DaoUtil";

describe('DaoUtil test suite', () => {
    describe('getDataValues()', () => {
        /**
         * @type {DaoUtil}
         */
        let daoUtil;

        beforeEach(() => {
            daoUtil = new DaoUtil();
        });

        it('Should extract values from array of objects with dataValues field', () => {
            const input = [{dataValues: {field1: 'value1'}}, {dataValues: true}, {dataValues: ['my_str1', 'my_str2']}];
            const expected = [
                {field1: 'value1'}, true, ['my_str1', 'my_str2']
            ];

            const actual = daoUtil.getDataValues(input);

            expect(actual).toEqual(expected);
        });

        it('Should return null if input is null', () => {
            const input = null;
            const expected = null;

            const actual = daoUtil.getDataValues(input);

            expect(actual).toBe(expected);
        });

        it('Should return null if input is undefined', () => {
            const input = undefined;
            const expected = null;

            const actual = daoUtil.getDataValues(input);

            expect(actual).toBe(expected);
        });
    });
});