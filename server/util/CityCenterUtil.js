import Area from "../model/Area.js";
import DaoUtil from "./DaoUtil.js";
import {Op} from "sequelize";

export default class CityCenterUtil {
    static #instance = null;
    #daoUtil;
    #cityCenters = null;

    constructor() {
        this.#daoUtil = new DaoUtil();
    }

    static getInstance() {
        if (!CityCenterUtil.#instance) {
            CityCenterUtil.#instance = new CityCenterUtil();
        }
        return CityCenterUtil.#instance;
    }

    static async getAllCityCentersArr() {
        const instance = CityCenterUtil.getInstance();
        const areCentersInitialized = await this.#initCityCenters();
        if(!areCentersInitialized){
            console.error('Could not init city centers.');
            return null;
        }

        const result = [];
        for(let key in instance.#cityCenters){
            const polygon = instance.#cityCenters[key];
            result.push(JSON.parse(polygon));
        }

        return result;
    }

    static async getCityCentersByNames(cityNames) {
        const instance = CityCenterUtil.getInstance();
        const areCentersInitialized = await this.#initCityCenters();
        if(!areCentersInitialized){
            console.error('Could not init city centers.');
            return null;
        }

        let result = [];
        for(let i=0; i < cityNames.length; i++){
            const cityFound = instance.#cityCenters[cityNames[i]];
            if(cityFound)
                result.push(cityFound)
        }

        return result;
    }

    static async #initCityCenters() {
        const instance = CityCenterUtil.getInstance();

        if (instance.#cityCenters && instance.#cityCenters.length !== 0)
            return true;

        try{
            const resp = await Area.findAll({ where: {areaName: {[Op.like]: '%Center'}} });
            const areas = instance.#daoUtil.getDataValues(resp);

            let cityCentersFound = {};
            for (const area of areas) {
                const {areaName, polygon} = area;
                const cityName = this.#cutCenterPart(areaName);
                cityCentersFound[cityName] = polygon;
            }
            instance.#cityCenters = cityCentersFound;
            return true;
        } catch (e){
            console.error('CityCenterUtil: Could not find CityCenter');
            return false;
        }
    }

    static #cutCenterPart = (cityName) => {
        const suffix = 'Center';
        if (cityName.endsWith(suffix))
            return cityName.slice(0, -suffix.length);

        return cityName;
    }
}