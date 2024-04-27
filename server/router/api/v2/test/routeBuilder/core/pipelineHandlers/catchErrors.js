export const catchErrors = (respErrorFieldName) => {
    return (err, req, res, next) => {

        let previousErrors = [];
        if(Array.isArray(res[respErrorFieldName]))
            previousErrors = res[respErrorFieldName];

        if(Array.isArray(err))
            res[respErrorFieldName] = [...previousErrors, ...err];
        else
            res[respErrorFieldName] = [...previousErrors, err];

        return next();
    }
}