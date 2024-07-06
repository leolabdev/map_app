
import {PAGINATION_MAX, config} from "../config.js";

/**
 * 
 * @param {defaultPage: Number, defaultLimit: number, max: number} paginationSettings 
 * @returns 
 */
export const paginate = (paginationSettings) => {
    return (req, res, next) => {
        const {page, limit} = req.query;
        const {defaultPage, defaultLimit, max} = {defaultPage: 1, defaultLimit: PAGINATION_MAX, max: PAGINATION_MAX, ...paginationSettings};

        const pageToSet = Number.parseInt(page) || defaultPage;
        let limitToSet = Number.parseInt(limit) || defaultLimit;
        limitToSet = limitToSet <= max ? limitToSet : max;
        const offset = (pageToSet-1)*limitToSet;

        const pagination = { page: pageToSet, limit: limitToSet, offset, max }
        req['pagination'] = pagination;
        res[config.metadataFieldName] = {
            ...res[config.metadataFieldName],
            currentPage: pageToSet,
            limit: limitToSet
        };

        return next();
    }
}