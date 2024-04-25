export const catchErrors = (err, req, res, next) => {
    const {respErrorFieldName} = res;

    if(!respErrorFieldName){
        const metaDataError = new Error('Please check that the addMetaData middleware is applied to the pipe. ' +
            'The middleware provides meta information required by catchErrors middleware');
        res[respErrorFieldName] = [err, metaDataError];
        return next();
    }

    let previousErrors = [];
    if(Array.isArray(res[respErrorFieldName]))
        previousErrors = res[respErrorFieldName];

    if(Array.isArray(err))
        res[respErrorFieldName] = [...previousErrors, ...err];
    else
        res[respErrorFieldName] = [...previousErrors, err];

    return next();
};