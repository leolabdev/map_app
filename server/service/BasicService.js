import sequelize, {Model} from "sequelize";
import { DEFactory } from "../router/api/v2/routeBuilder/core/service/dataExtractors/DEFactory.js";
import { validateInput } from "../router/api/v2/routeBuilder/core/service/validateInput.js";
import { ServiceError } from "../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError.js";
import { SEReason } from "../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason.js";


export default class BasicService{
    /**
     * 
     * @param {Model} model to query
     * @param {string=} serviceName service name to print in logs
     */
    constructor(model, serviceName){
        this.model = model;
        this.extractor = DEFactory.create();
        this.serviceName = serviceName ?? 'BasicService';
    }

    /**
     * Create new object
     *
     * @type { (newObject: any, validation: ServiceValidation | undefined, options: sequelize.CreateOptions | undefined) => Promise<any> | Promise<ServiceError>}
     */
    create = async (newObject, validation, options={}) => {
        return validateInput(async () => {
            try {
                const resp = await this.model.create(newObject, options);
                return this.extractor.extract(resp);
            } catch (e) {
                console.error(`${this.serviceName} create(): Could not execute the query`, e);
                return new ServiceError({ reason: SEReason.UNEXPECTED, additional: e });
            }
        }, validation)(newObject, options);
    }

    
    /**
     * Read object by id
     *
     * @type { (primaryKey: number | string, validation: ServiceValidation | undefined, options: Omit<sequelize.FindOptions<any>, "where"> | undefined) => Promise<any> | Promise<ServiceError>}
     */
    readOneById = async (primaryKey, validation, options={}) => {
        return validateInput(async () => {
            try {
                const resp = await this.model.findByPk(primaryKey, options);
                return this.extractor.extract(resp);
            } catch(e) {
                console.error(`${this.serviceName} readOneById(): Could not execute the query`, e);
                return new ServiceError({reason: SEReason.UNEXPECTED, additional: e});
            }
        }, validation)(primaryKey, options);
    }


    /**
     * Search for an object
     *
     * @type { (search: sequelize.FindOptions<any>, validation: ServiceValidation | undefined) => Promise<any> | Promise<ServiceError>}
     */
    searchOne = async (search, validation) => {
        return validateInput(async () => {
            try {
                const resp = await this.model.findOne(search);
                return this.extractor.extract(resp);
            } catch(e) {
                console.error(`${this.serviceName} searchOne(): Could not execute the query`, e);
                return new ServiceError({reason: SEReason.UNEXPECTED, additional: e});
            }
        }, validation)(search);
    }


    /**
     * Read all objects
     *
     * @type { (options: sequelize.FindOptions<any>, validation: ServiceValidation | undefined) => Promise<any> | Promise<ServiceError>}
     */
    async readAll(options={}, validation) {    
        return validateInput(async () => {
            try {
                const resp = await this.model.findAll(options);
                return this.extractor.extract(resp);
            } catch (e) {
                console.error(`${this.serviceName} readAll(): Could not execute the query`, e);
                return new ServiceError({reason: SEReason.UNEXPECTED, additional: e});
            }
        }, validation)(options);
    }

    
    /**
     * Update an object
     *
     * @type { (objectToUpdate: any, validation: ServiceValidation | undefined, options: sequelize.UpdateOptions | undefined) => Promise<any> | Promise<ServiceError>}
     */
    async update (objectToUpdate, validation, options={}) {
        return validateInput(async () => {
            try{
                const resp = await this.model.update(objectToUpdate, options);
                return resp[0] > 0;
            } catch (e){
                console.error(`${this.serviceName} update(): Could not execute the query`, e);
                return new ServiceError({reason: SEReason.UNEXPECTED, additional: e});
            }
        }, validation)(objectToUpdate, options);
    }

    /**
     * Update an object
     *
     * @type { (objectToUpdate: Object, validation: ServiceValidation | undefined, options: sequelize.UpdateOptions | undefined) => Promise<any> | Promise<ServiceError>}
     */
    async updateById (objectToUpdate, validation, options={}) {
        return validateInput(async () => {
            try{
                const resp = await this.model.update(
                    objectToUpdate, 
                    {...options, where: {id: objectToUpdate.id}
                });
                return resp[0] > 0;
            } catch (e){
                console.error(`${this.serviceName} update(): Could not execute the query`, e);
                return new ServiceError({reason: SEReason.UNEXPECTED, additional: e});
            }
        }, validation)(objectToUpdate, options);
    }


    /**
     * Delete object by id
     *
     * @type { (primaryKey: number | string, validation: ServiceValidation | undefined, options: sequelize.DestroyOptions | undefined) => Promise<any> | Promise<ServiceError>}
     */
    async deleteById(primaryKey, validation, options={}) {
        return validateInput(async () => {
            try {
                const resp = await this.model.destroy({ ...options, where: { id: primaryKey } });
                return resp > 0;
            } catch (e) {
                console.error(`${this.serviceName} deleteById(): Could not execute the query`, e);
                return new ServiceError({reason: SEReason.UNEXPECTED, additional: e});
            }
        }, validation)(primaryKey, options);
    } 

    /**
     * Delete objects by condition
     *
     * @type { (condition: sequelize.DestroyOptions | undefined, validation: ServiceValidation | undefined) => Promise<any> | Promise<ServiceError>}
     */
    async deleteByCondition(condition, validation) {
        return validateInput(async () => {
            try {
                const resp = await this.model.destroy(condition);
                return resp > 0;
            } catch (e) {
                console.error(`${this.serviceName} deleteByCondition(): Could not execute the query`, e);
                return new ServiceError({reason: SEReason.UNEXPECTED, additional: e});
            }
        }, validation)(condition, validation);
    }
}