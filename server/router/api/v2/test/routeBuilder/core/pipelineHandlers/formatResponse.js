import {config} from "../config.js";

export const formatResponse = (respFieldName, respErrorFieldName, successStatus) => {
    return (req, res) => {
        if(res[respErrorFieldName] && !Array.isArray(res[respErrorFieldName]))
            res[respErrorFieldName] = [res[respErrorFieldName]];

        const data = {...res[respFieldName]} || null;
        const errors = res[respErrorFieldName] ? [...res[respErrorFieldName]] : null;

        const {respStatusFieldName} = config;
        let status = 200;
        if(res[respStatusFieldName])
            status = res[respStatusFieldName];
        else if(successStatus)
            status = successStatus;
        else if(req.method === 'POST')
            status = 201;
        else if(data)
            status = 200;
        else if(!data)
            status = 204;

        res.statusCode = status;

        cleanResObject(res, respFieldName, respErrorFieldName, respStatusFieldName);

        return res.json({
            [respFieldName]: data,
            [respErrorFieldName]: errors
        });
    };
}

function cleanResObject(res, respFieldName, respErrorFieldName, respStatusFieldName) {
    res[respFieldName] = undefined;
    res[respErrorFieldName] = undefined;
    res[respStatusFieldName] = undefined;
}