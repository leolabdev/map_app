/**
 * Create handler for express pipe, which can be async
 * @param handler async function to wrap
 * @returns {function(*, *, *): Promise<Awaited<unknown>>}
 */
export const createAsyncHandler = (handler) => {
    return (req, res, next) => {
        return Promise.resolve(handler(req, res, next)).catch(next);
    }
}