import {Model} from "sequelize";
import { DEFactory } from "../router/api/v2/test/routeBuilder/core/service/dataExtractors/DEFactory.js";
import { ServiceError } from "../router/api/v2/test/routeBuilder/core/service/dataExtractors/error/ServiceError.js";
import { validateInput } from "../router/api/v2/test/routeBuilder/core/service/validateInput.js";
import { SEReason } from "../router/api/v2/test/routeBuilder/core/service/dataExtractors/error/SEReason.js";

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
     * @param {any} newObject 
     * @param {{schema: any, field: string | undefined}} validation 
     */
    create = async (newObject, validation) => {
        return validateInput(async () => {
            try {    
                const resp = await this.model.create(newObject);
                return this.extractor.extract(resp);
            } catch (e) {
                console.error(`${this.serviceName} create(): Could not execute the query`, e);
                return new ServiceError({ reason: SEReason.UNEXPECTED, additional: e });
            }
        }, validation)();
    }

    /**
     * Read object by id
     * @param {number | string} primaryKey 
     * @param {{schema: any, field: string | undefined}} validation 
     */
    readOneById = async (primaryKey, validation) => {
        return validateInput(async () => {
            try {
                const resp = await this.model.findByPk(primaryKey);
                return this.extractor.extract(resp);
            } catch(e) {
                console.error(`${this.serviceName} read(): Could not execute the query`, e);
                return new ServiceError({reason: SEReason.UNEXPECTED, additional: e});
            }
        }, validation)();
    }

    /**
     * Read object by id
     * @param {{where: any}} search query
     * @param {{schema: any, field: string | undefined}} validation 
     */
    searchOne = async (search, validation) => {
        return validateInput(async () => {
            try {
                const resp = await this.model.findOne(search);
                return this.extractor.extract(resp);
            } catch(e) {
                console.error(`${this.serviceName} read(): Could not execute the query`, e);
                return new ServiceError({reason: SEReason.UNEXPECTED, additional: e});
            }
        }, validation)();
    }


    /**
     * Read all objects
     * @param {{}=} options
     */
    async readAll(options={}) {
        try {
            const resp = await this.model.findAll(options);
            return this.extractor.extract(resp);
        } catch (e) {
            console.error(`${this.serviceName} readAll(): Could not execute the query`, e);
            return new ServiceError({reason: SEReason.UNEXPECTED, additional: e});
        }
    }

    /**
     * Update existing object
     * @param {any} objectToUpdate 
     * @param {{}} search 
     * @param {{schema: any, field: string | undefined}=} validation 
     */
    update = async (objectToUpdate, search, validation) => {
        return validateInput(async () => {
            try{
                const resp = await this.model.update(objectToUpdate, search);
                return resp[0] > 0;
            } catch (e){
                console.error(`${this.serviceName} update(): Could not execute the query`, e);
                return new ServiceError({reason: SEReason.UNEXPECTED, additional: e});
            }
        }, validation)();
    }

    /**
     * Delete object by id
     * @param {number | string} primaryKey 
     * @param {{schema: any, field: string | undefined}} validation 
     */
    deleteById = async (primaryKey, validation) => {
        return validateInput(async () => {
            try {
                const resp = await this.model.destroy({ where: { id: primaryKey } });
                return resp > 0;
            } catch (e) {
                console.error(`${this.serviceName} delete(): Could not execute the query`, e);
                return new ServiceError({reason: SEReason.UNEXPECTED, additional: e});
            }
        }, validation)();
    } 
}