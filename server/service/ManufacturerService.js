import Manufacturer from "../model/Manufacturer.js";
import Address from "../model/Address.js";
import { DEFactory } from "../router/api/v2/test/routeBuilder/core/service/dataExtractors/DEFactory.js";
import BasicService from "./BasicService.js";
import OrderDataService from "./OrderDataService.js";
import { manufacturerCreate, manufacturerUpdate } from "./validation/manufacturer.js";
import { SERVICE_ERROR_TYPE_NAME } from "../router/api/v2/test/routeBuilder/core/config.js";
import { ServiceError } from "../router/api/v2/test/routeBuilder/core/service/dataExtractors/error/ServiceError.js";
import { SEReason } from "../router/api/v2/test/routeBuilder/core/service/dataExtractors/error/SEReason.js";
import { idField } from "./validation/idField.js";

/**
 * The class provides functionality for manipulating(CRUD operations) with Manufacturer SQL table.
 * This table contains manufacturers data such as manufacturer username and name
 */
export default class ManufacturerService {
    constructor() {
        this.extractor = DEFactory.create();
        this.service = new BasicService(Manufacturer, 'ManufacturerService');
        this.orderService = new OrderDataService();
    }

    /**
     * The method creates new Manufacturer in the Manufacturer SQL table
     * @param {Manufacturer} data object with the manufacturer data, where manufacturerUsername field is mandatory
     * @returns created Manufacturer object, if operation was successful or null if not
     */
    async create(data) {
        return this.service.create(data, manufacturerCreate);
    }

    /**
     * The method reads Manufacturer with provided primary key(manufacturerUsername)
     * @param {string} primaryKey primary key of the manufacturer
     * @returns founded Manufacturer object, if operation was successful or null if not
     */
    async read(primaryKey) {
        return this.service.readOneById(primaryKey, idField, { include: Address });
    }

    /**
     * The method reads all Manufacturer of the Manufacturer SQL table
     * @returns array of the founded Manufacturer objects, if operation was successful or null if not
     */
    async readAll() {
        return this.service.readAll({include: Address });
    }

    /**
     * The method updates existing manufacturer data in the Manufacturer SQL table
     * @param {Manufacturer} data object with the manufacturer data, such as manufacturerUsername or name
     * @returns true, if the operation was successful or false if not
     */
    update = validateInput(async(data) => {
        const { addressIdDelete, ...manufacturer } = data;
        if(addressIdDelete)
            client.addressId = null;

        if(!manufacturer.username)
            return this.service.updateById(manufacturer);

        try {
            const existingManufacturer = this.service.searchOne({where: {username: manufacturer.username}});
            const isServiceError = existingManufacturer.type && existingManufacturer.type === SERVICE_ERROR_TYPE_NAME.description;

            if(!isServiceError && existingManufacturer.id !== manufacturer.id)
                return new ServiceError({
                    reason: SEReason.NOT_UNIQUE,
                    field: 'username',
                    message: 'The manufacturer with this username already exists'
                });

                return this.service.updateById(manufacturer);
        } catch (e) {
            console.error(`ManufacturerService update(): Could not execute the query`, e);
            return new ServiceError({reason: SEReason.UNEXPECTED, additional: e});
        }
    }, manufacturerUpdate);

    /**
     * The method deletes manufacturer with provided primary key(manufacturerUsername)
     * @param {string} primaryKey primary key of the manufacturer
     * @returns true if operation was successful or false if not
     */
    delete = validateInput(async (primaryKey) => {
        try {  
            await this.orderService.deleteByCondition({where: {manufacturerId: primaryKey}});
            return this.service.deleteById(primaryKey);
        } catch (e) {
            console.error(`ManufacturerService update(): Could not execute the query`, e);
            return new ServiceError({reason: SEReason.UNEXPECTED, additional: e});
        }
    }, idField); 
}