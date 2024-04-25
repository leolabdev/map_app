export const formatResponse = (req, res) => {
    const {respFieldName, respErrorFieldName} = res;

    if(!respFieldName || !respErrorFieldName)
        throw new Error('Please check that the addMetaData middleware is applied to the pipe. ' +
            'The middleware provides meta information required by formatResponse middleware');

    if(res[respErrorFieldName] && !Array.isArray(res[respErrorFieldName]))
        res[respErrorFieldName] = [res[respErrorFieldName]];

    res.json({
        [respFieldName]: res[respFieldName] || null,
        [respErrorFieldName]: res[respErrorFieldName] || null
    });
};