import SettingsUtil from "../../../util/settings/SettingsUtil";

describe('SettingsUtil test suite', () => {
    describe('setUp()', () => {
        /**
         * @type {SettingsUtil}
         */
        let settingsUtil;

        beforeEach(() => {
            const consoleLogSpy = jest.spyOn(console, 'log');
            const consoleErrorSpy = jest.spyOn(console, 'error');
            settingsUtil = new SettingsUtil({cityCentersFileLocation: ''});

            expect(consoleLogSpy).toHaveBeenCalledTimes(0);
            expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
        });
        
        it('Should be called with no errors', async () => {
            const consoleLogSpy = jest.spyOn(console, 'log');
            const consoleErrorSpy = jest.spyOn(console, 'error');

            async function callSetUp(){
                await settingsUtil.setUp();
            }

            expect(callSetUp).not.toThrow();

            expect(consoleLogSpy).toHaveBeenCalledTimes(0);
            expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
        });
    });
});
  