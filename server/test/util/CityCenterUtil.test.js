import CityCenterUtil from "../../util/CityCenterUtil";

describe('CityCenterUtil class test suite', () => {
    const cityCenters = ['Helsinki', 'Lahti', 'Tampere', 'Turku'];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getInstance()', () => {
        it('Can create and return a CityCenterUtil instance', () => {
            const util = CityCenterUtil.getInstance();

            expect(util instanceof CityCenterUtil).toBe(true);
        });
    });

    describe('getAllCityCentersArr()', () => {
        it('Should not throw any errors or print any', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error');

            expect(async () => { await CityCenterUtil.getAllCityCentersArr() }).not.toThrow();
            expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
        });

        it('Should return right length array', async () => {
            const actual = await CityCenterUtil.getAllCityCentersArr();

            expect(actual).toBeDefined();
            expect(actual).toHaveLength(cityCenters.length);         
        });

        it('Should return array of defined objects', async () => {
            const actual = await CityCenterUtil.getAllCityCentersArr();

            for(let i=0, l=actual.length; i<l; i++)
                expect(actual[i] && typeof actual[i] === 'object').toBe(true);
        });
    });

    describe('getCityCentersByNames()', () => {
        it('Should not throw any errors or print any', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error');

            expect(async () => { await CityCenterUtil.getCityCentersByNames(cityCenters) }).not.toThrow();
            expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
        });

        it('Should return right length array', async () => {
            const input = [cityCenters[0], cityCenters[1]];
            const actual = await CityCenterUtil.getCityCentersByNames(input);

            expect(actual).toBeDefined();
            expect(actual).toHaveLength(input.length);         
        });

        it('Should return array of defined strings', async () => {
            const input = [cityCenters[1], cityCenters[3]];
            const actual = await CityCenterUtil.getCityCentersByNames(input);

            for(let i=0, l=actual.length; i<l; i++)
                expect(actual[i] && typeof actual[i] === 'string').toBe(true);
        });

        it('Should return array of strings, which can be parsed to object', async () => {
            const input = [cityCenters[1], cityCenters[3]];
            const actual = await CityCenterUtil.getCityCentersByNames(input);

            for(let i=0, l=actual.length; i<l; i++)
                expect(() => JSON.parse(actual[i])).not.toThrow();
        });

        it('Should return empty array if none of the cities exists', async () => {
            const input = ['London', 'Tallinn'];
            const actual = await CityCenterUtil.getCityCentersByNames(input);

            expect(actual).toBeDefined();
            expect(actual).toHaveLength(0);
        });

        it('Should not return array with nulls or undefined, if some of the cities does not exists', async () => {
            const input = [cityCenters[0], 'London', 'Tallinn', cityCenters[2], undefined, null];
            const actual = await CityCenterUtil.getCityCentersByNames(input);

            expect(actual).toHaveLength(2);
        });
    });
});