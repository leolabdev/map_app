/**
 * Combines all 3 objects together
 * @param {Object} base the base object of the factory containing default values, 
 * which will be overridden if they are specified in the other objects
 * @param {Object=} uniqueFields unique fields of the object, which will override any fields in other objects
 * @param {Object=} otherFields optional other fields, which can override the base object fields
 * @returns {Object} combined object from the specified objects
 */
export default function generateObject(base, uniqueFields, otherFields) {
    let combinedObject = {...base};

    if(otherFields)
        combinedObject = { ...combinedObject, ...otherFields };

    if(uniqueFields)
        combinedObject = { ...combinedObject, ...uniqueFields };

    return combinedObject;
}