import Data from "../model/Data.js";
import BasicService from "./BasicService.js";
import { dataCreate, dataName, dataUpdate } from "./validation/data.js";
import { idField } from "./validation/idField.js";
import { DEFactory } from "../router/api/v2/routeBuilder/core/service/dataExtractors/DEFactory.js";
import { validateInput } from "../router/api/v2/routeBuilder/core/service/validateInput.js";

/**
 * The class provides functionality for manipulating(CRUD operations) with Data SQL table.
 * This table contains different data in key-value form and last updated date
 */
export default class DataService {
    constructor() {
        this.extractor = DEFactory.create();
        this.service = new BasicService(Data, 'DataService');
    }
    
    /**
     * The method creates new data pair in the Data SQL table
     * @param {Data} data object, where the name and value fields are mandatory
     * @returns created Data object, if operation was successful or null if not
     */
    async create(data) {
        return this.service.create(data, dataCreate);
    }

    /**
     * The method reads Data object with the provided primary key(name)
     * @param {string} primaryKey primary key of the data
     * @returns founded Data object, if operation was successful or null if not
     */
    async read(primaryKey) {
        return this.service.readOneById(primaryKey, idField);
    }

    /**
     * The method reads all Data objects of the Data SQL table
     * @returns array of the founded Data objects, if operation was successful or null if not
     */
    async readAll() {
        return this.service.readAll();
    }

    /**
     * The method updates existing data in the Data SQL table
     * @param {Partial<Data>} data object with the data, such as value or name
     * @returns true, if the operation was successful or false if not
     */
    async update(data) {
        return this.service.update(data, dataUpdate, { where: { name: data.name } });
    }

    /**
     * The method deletes data with provided primary key(name)
     * @param {string} primaryKey primary key of the data
     * @returns true if operation was successful or false if not
     */
    delete = validateInput(async (primaryKey) => {
        return this.service.deleteByCondition({ where: { name: primaryKey } });
    }, dataName); 
}