/**
 *
 * @param{Record<string, boolean>} dtoShape object in {field: isExposed} form with fields to be exposed
 * @param{'req' | 'res'} location location of object to be serialized
 * @param{string?} dtoField field in request/response object containing object to be serialized.
 */
export function serialize(dtoShape, location, dtoField) {
    return function (req, res, next) {
        const loc = location === 'req' ? req : res;

        if(location === 'res' && !dtoField){
            const {respFieldName} = res;
            if(!respFieldName){
                throw new Error('Please check that the addMetaData middleware is applied to the pipe. ' +
                    'The middleware provides meta information required by serialize middleware');
            }
            dtoField = respFieldName;
        }

        let data = loc[dtoField];
        loc[dtoField] = data ? serializeData(data, dtoShape) : null;

        return next();
    }
}

/**
 *
 * @param {{} | []} data data to be serialized
 * @param {Record<string, boolean>} shape shape to be exposed
 * @returns {[]|{}} filtered data object or array
 */
function serializeData(data, shape) {
    return Array.isArray(data) ?
        data.map(item => filterFields(item, shape)) :
        filterFields(data, shape);
}

/**
 *
 * @param {{}} obj to be filtered
 * @param {Record<string, boolean>} shape fields to be exposed
 * @returns {{}}
 */
function filterFields(obj, shape) {
    const result = {};
    for (const key in shape) {
        if(shape[key] && obj.hasOwnProperty(key)) {
            result[key] = obj[key];
        }
    }
    return result;
}