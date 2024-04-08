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

    static async getCityCenter(cityName) {
        const instance = CityCenterUtil.getInstance();

        if (!instance.#cityCenters || instance.#cityCenters.length === 0) {
            try {
                const resp = await Area.findAll({ where: {areaName: {[Op.like]: '%Center'}} });
                const areas = instance.#daoUtil.getDataValues(resp);

                let cityCentersFound = {};
                for (const area of areas) {
                    const {areaName, polygon} = area;
                    cityCentersFound[areaName] = polygon;
                }
                instance.#cityCenters = cityCentersFound;
            } catch (e) {
                console.error('CityCenterUtil: Could not find CityCenter');
                return null;
            }
        }

        return instance.#cityCenters[`${cityName}Center`] || null;
    }
}