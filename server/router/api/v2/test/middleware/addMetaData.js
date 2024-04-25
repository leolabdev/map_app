export function addMetaData({
    authFieldName='user',

    respFieldName='result',
    respErrorFieldName='errors'
}) {
    return function(req, res, next) {
        req.authFieldName = authFieldName;

        res.respFieldName = respFieldName;
        res.respErrorFieldName = respErrorFieldName;

        return next();
    }
}