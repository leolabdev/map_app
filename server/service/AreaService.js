import Area from "../model/Area.js";
import {Op} from "sequelize";
import BasicService from "./BasicService.js";
import { DEFactory } from "../router/api/v2/routeBuilder/core/service/dataExtractors/DEFactory.js";
import { validateInput } from "../router/api/v2/routeBuilder/core/service/validateInput.js";
import { areaCreate, areaName, areaUpdate } from "./validation/area.js";

/**
 * The class provides functionality for manipulating(CRUD operations) with Area SQL table.
 * This table contains area objects and used for saving type(polygon or multipolygon) of the GeoJSON objects and name of the area
 */
export default class AreaService {
    constructor() {
        this.extractor = DEFactory.create();
        this.service = new BasicService(Area, 'AreaService');
    }
    
    /**
     * The method creates new area in the Area SQL table
     * @param {{}} data object with the area data, where areaName and type(polygon or multipolygon) fields are mandatory
     * @returns created Area object, if operation was successful or null if not
     */
    create = validateInput(async (data) => {
        let { areaName, polygon } = data;

        if(typeof polygon === 'object')
            polygon = JSON.stringify(polygon);
        
        return this.service.create({ areaName, polygon });
    }, areaCreate);

    /**
     * The method reads area with provided primary key(areaName)
     * @param {string} primaryKey primary key of the area
     * @returns founded Area object, if operation was successful or null if not
     */
    async read(primaryKey) {
        return this.service.readOneById(primaryKey, areaName);
    }

    /**
     * The method reads all the areas from the Area SQL table
     * @returns array with all founded Area objects, if operation was successful or null if not
     */
    async readAll() {
        return this.service.readAll();
    }

    /**
     * The method updates existing area data in the Area SQL table
     * @param {{}} data object with the area data, such as areaName or type
     * @returns true, if the operation was successful or false if not
     */
     update = validateInput(async (data) => {
        const { areaName, polygon } = data;

        return this.service.update(
            { polygon: JSON.stringify(polygon) }, 
            { where: { areaName } }
        );
    }, areaUpdate);

    /**
     * The method deletes area with provided primary key(areaName)
     * @param {String} primaryKey primary key of the area
     * @returns true if operation was successful or false if not
     */
    async delete(primaryKey) {
        return this.service.deleteById(primaryKey, areaName);
    }

    async deleteAllCityCenters() {
        try {
            const resp = await Area.destroy({ where: { areaName: {[Op.like]: '%Center'} } });
            return resp > 0;
        } catch (e) {
            console.error('AreaDAO: Could not execute the query');
            console.error(e);
            return false;
        }
    }
}