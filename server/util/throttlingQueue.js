class ThrottlingQueue {
    constructor(delayMs=1000) {
        this.#delayMs = delayMs;
    }
    #delayMs;
    #queue = [];
    #isProcessing = false;

    addRequest(requestFunction){
        this.#enqueue(requestFunction);
    }

    #enqueue(requestFunction) {
        this.#queue.push(requestFunction);
        this.#processQueue();
    }

    #dequeue(){
        return this.#queue.shift();
    }

    async #processQueue() {
        if (this.#isProcessing) return;
        this.#isProcessing = true;

        while (this.#queue.length > 0) {
            const currentReq = this.#dequeue();
            await currentReq();
            await new Promise(resolve => setTimeout(resolve, this.#delayMs));
        }

        this.#isProcessing = false;
    }
}

export const validateQueue = new ThrottlingQueue(1500);
export const reverseQueue = new ThrottlingQueue(1500);
export const autocompleteQueue = new ThrottlingQueue(1500);