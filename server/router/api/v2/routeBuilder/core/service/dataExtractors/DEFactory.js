import {DataExtractorType} from "./DataExtractorType.js";
import {DATA_EXTRACTOR_TYPE} from "../../config.js";
import SequelizeDE from "./SequelizeDE.js";
import DataExtractorAbstract from "./DataExtractorAbstract.js";

export class DEFactory {
    static create(){
        switch (DATA_EXTRACTOR_TYPE.description) {
            case DataExtractorType.SEQUELIZE:
                return new SequelizeDE();
            default:
                return new DataExtractorAbstract();
        }
    }
}