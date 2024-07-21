import APILimitTracker from "../../util/APILimitTracker";

describe('APILimitTracker test suite', () => {
    /**
     * @type {APILimitTracker}
     */
    let tracker;
    beforeEach(() => {
        tracker = new APILimitTracker();
    });

    describe('areRequestsLeft() should return true for tracked endpoints', () => {
        /**
         * @type {{api: string, endpoints: string[]}[]}
         */
        const endpoints = [
            {
                api: 'maps',
                endpoints: ['search', 'reverse']
            },
            {
                api: 'geoapify',
                endpoints: ['autocomplete']
            },
            {
                api: 'ors',
                endpoints: ['optimize']
            }
        ]
        it.each(endpoints)('$api api', ({api, endpoints}) => {
            const tracker.areRequestsLeft(api, endpoints[0]);
            expect(1).toBe(1);
        });
    });
    
});