/**
 * Map the endpoints
 * @param {Express} express express instance
 * @param {string} prefix start of the endpoint
 * @param {Record<string, Object>} endpoints endpoints to register, object with key is an endpoint(without prefix) and router as a value
 */
export function mapEndpoints(express, prefix, endpoints) {
    console.log('Start mapping endpoints');
    for(let endpoint in endpoints){
        console.log(`[${prefix}${endpoint}]`);
        express.use(`${prefix}${endpoint}`, endpoints[endpoint].default);
    }
    console.log('Endpoint are mapped');
}