const StringValidator = require("../util/StringValidator").StringValidator;
const Manufacturer = require("../model/Manufacturer").Manufacturer;
const DaoUtil = require("../util/DaoUtil").DaoUtil;

const stringValidator = new StringValidator();
const daoUtil = new DaoUtil();

class ManufacturerDAO{
    async create(data){
        const { manufacturerUsername } = data;

        if(daoUtil.containNoNullArr([manufacturerUsername]) && daoUtil.containNoBlankArr([manufacturerUsername])){
            try{
                const resp = await Manufacturer.create(data);
                return resp != null;
            }catch(e){
                console.error("ManufacturerDAO: Could not execute the query");
                return false;
            }
        } else{
            console.error("ManufacturerDAO: Wrong parameter provided");
            return false;
        }
    }

    async read(primaryKey){
        if(primaryKey != null && !stringValidator.isBlank(primaryKey)){
            try{
                const resp = await Manufacturer.findByPk(primaryKey);
                return resp != null ? resp.dataValues : null;
            }catch(e){
                console.error("ManufacturerDAO: Could not execute the query");
                return null;
            }
        } else{
            console.error("ManufacturerDAO: Wrong parameter provided");
            return null;
        }
    }

    async readAll(){
        try{
            const resp = await Manufacturer.findAll();
            return daoUtil.getDataValues(resp);
        }catch(e){
            console.error("ManufacturerDAO: Could not execute the query");
            return null;
        }
    }

    async update(data){
        const { manufacturerUsername } = data;
        if(manufacturerUsername != null && !stringValidator.isBlank(manufacturerUsername)){
            try{
                delete data.manufacturerUsername;
                const resp = await Manufacturer.update(
                    data,
                    {where: {manufacturerUsername: manufacturerUsername}}
                );
                return resp[0] > 0;
            }catch(e){
                console.error("ManufacturerDAO: Could not execute the query");
                return false;
            }
        } else{
            console.error("ManufacturerDAO: Wrong parameter provided");
            return false;
        }
    }

    async delete(primaryKey){
        if(primaryKey != null && !stringValidator.isBlank(primaryKey)){
            try{
                const resp = await Manufacturer.destroy({ where: {manufacturerUsername: primaryKey}});
                return resp > 0;
            }catch(e){
                console.error("ManufacturerDAO: Could not execute the query");
                return false;
            }
        } else{
            console.error("ManufacturerDAO: Wrong parameter provided");
            return false;
        }
    }
}

module.exports.ManufacturerDAO = ManufacturerDAO;