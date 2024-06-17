import DataExtractorAbstract from "./DataExtractorAbstract.js";

export default class SequelizeDE extends DataExtractorAbstract {
    /**
     *
     * @param {{} | []} dbResponse
     * @param {{}=} options
     * @returns {{} | []}
     */
    extract(dbResponse, options) {
        if(!dbResponse)
            return null;

        if(!Array.isArray(dbResponse))
            return dbResponse.dataValues;

        let result = [];
        for(let i=0, l=dbResponse.length; i<l; i++)
            result[i] = dbResponse[i].dataValues;

        return result;
    }
}