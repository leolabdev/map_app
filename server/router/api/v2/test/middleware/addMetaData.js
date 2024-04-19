export function addMetaData({respFieldName='result', respErrorFieldName='errors'}={respFieldName: 'result', respErrorFieldName:'errors'}) {
    return function(req, res, next) {
        res.respFieldName = respFieldName;
        res.respErrorFieldName = respErrorFieldName;

        next();
    }
}