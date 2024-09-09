import { SEReason } from "../../../../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason";

/**
 * Checks whenever the provided value is SEReason or not
 * @param {*} value value to check
 * @returns {boolean} _true_ id the value is SEReason and _false_ if not
 */
export default function isSEReason(value) {
    if(!value || typeof value !== 'string')
        return false;

    return Object.values(SEReason).includes(value);
}