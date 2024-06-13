import {config} from "../config.js";

export const formatResponse = (respFieldName, respErrorFieldName, successStatus) => {
    return (req, res) => {
        respFieldName = respFieldName ?? config.respFieldName;
        respErrorFieldName = respErrorFieldName ?? config.respErrorFieldName;

        if(res[respErrorFieldName] && !Array.isArray(res[respErrorFieldName]))
            res[respErrorFieldName] = [res[respErrorFieldName]];

        const data = Array.isArray(res[respFieldName]) ? [...res[respFieldName]] : ({...res[respFieldName]} || null);
        const errors = res[respErrorFieldName] ? [...res[respErrorFieldName]].map(serializeError) : undefined;
        const {respStatusFieldName, metadataFieldName} = config;

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

        const metadata = res[metadataFieldName] ?? undefined;

        cleanResObject(res, respFieldName, respErrorFieldName, respStatusFieldName, metadataFieldName);

        return res.json({
            [respFieldName]: data,
            [respErrorFieldName]: errors,
            [metadataFieldName]: metadata
        });
    };
}

function cleanResObject(res, respFieldName, respErrorFieldName, respStatusFieldName) {
    res[respFieldName] = undefined;
    res[respErrorFieldName] = undefined;
    res[respStatusFieldName] = undefined;
}

function serializeError(error) {
    if (error.additional instanceof Error) {
        return {
            ...error,
            additional: extractJSError(error.additional)
        };
    }

    if (error instanceof Error) {
        return {
            ...extractJSError(error)
        };
    }

    return error;
}

function extractJSError(e){
    return {
        message: e.message,
        stack: e.stack,
        name: e.name
    }
}