import APILimitTracker from "../../util/APILimitTracker.js";

describe('APILimitTracker test suite', () => {
    describe('areRequestsLeft() should return', () => {
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
        it.each(endpoints)('true for $api api', ({api, endpoints}) => {
            for(let i=0, l=endpoints.length; i<l; i++){
                const areRequestsLeft = APILimitTracker.areRequestsLeft(api, endpoints[0]);
                expect(areRequestsLeft).toBe(true);
            }
        });

        it('false for non-existing api and endpoint', () => {
            const areRequestsLeft = APILimitTracker.areRequestsLeft('nope', 'someRoute');

            expect(areRequestsLeft).toBe(false);
        });

        it('false for invalid api param', () => {
            const areRequestsLeft = APILimitTracker.areRequestsLeft(null, 'optimize');

            expect(areRequestsLeft).toBe(false);
        });

        it('false for invalid endpoint param', () => {
            const areRequestsLeft = APILimitTracker.areRequestsLeft('geoapify', undefined);

            expect(areRequestsLeft).toBe(false);
        });
    });
});