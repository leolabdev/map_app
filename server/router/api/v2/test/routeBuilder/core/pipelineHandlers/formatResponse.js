export const formatResponse = (respFieldName, respErrorFieldName) => {
    return (req, res) => {
        if(res[respErrorFieldName] && !Array.isArray(res[respErrorFieldName]))
            res[respErrorFieldName] = [res[respErrorFieldName]];

        const data = {...res[respFieldName]} || null;
        const errors = [...res[respErrorFieldName]] || null;
        cleanResObject(res, respFieldName, respErrorFieldName);

        res.json({
            [respFieldName]: data,
            [respErrorFieldName]: errors
        });
    };
}

function cleanResObject(res, respFieldName, respErrorFieldName) {
    res[respFieldName] = undefined;
    res[respErrorFieldName] = undefined;
}