export default class APILimitTracker{

    //Set how often limits should be reset
    static #resetPeriodMs = 86400000; //It is one day in ms
    //Set limits for each api and its endpoints
    static #initialLimits = {
        //maps.co token has 1.000.000 requests per month: (1.000.000/2 endpoints/31 days) * 0.9 percents = 14500 per day
        'maps': {
            'search': { amountLeft: 14500 },
            'reverse': { amountLeft: 14500 }
        },

        //geoapify token has 3000 requests per day: 3000 * 0.9 percents = 2700 per day
        'geoapify': {
            'autocomplete': { amountLeft: 2700 }
        },

        //ORS /optimization token has 500 requests per day: 500 * 0.9 percents = 450 per day
        'ors': {
            'optimize': { amountLeft: 450 }
        }
    }


    static #timeBeforeReset = this.#getInitialPeriod();
    static #limits = this.#getInitialLimits();


    static areRequestsLeft(api, endpoint) {
        if(!this.#limits[api] || !this.#limits[api][endpoint]){
            console.error('APILimitTracker: could not find endpoint data');
            return false;
        }

        const endpointData = this.#limits[api][endpoint];
        const now = Date.now();

        // Reset timer and limits if the period has passed
        if (now > this.#timeBeforeReset)
            this.#reset();

        if(endpointData.amountLeft <= 0)
            return false;

        endpointData.amountLeft -= 1; // Decrement the counter
        return true;
    }

    static #reset() {
        this.#timeBeforeReset = this.#getInitialPeriod();
        this.#limits = this.#getInitialLimits();
    }


    static #getInitialPeriod(){
        return Date.now() + this.#resetPeriodMs;
    }
    static #getInitialLimits(){
        return JSON.parse(JSON.stringify(this.#initialLimits));
    }
}