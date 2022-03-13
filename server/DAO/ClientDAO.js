const {Address} = require("../model/Address");
const StringValidator = require("../util/StringValidator").StringValidator;
const Client = require("../model/Client").Client;
const DaoUtil = require("../util/DaoUtil").DaoUtil;

const stringValidator = new StringValidator();
const daoUtil = new DaoUtil();

class ClientDAO{
    async create(data){
        const { clientUsername, address } = data;

        if(daoUtil.containNoNullArr([clientUsername]) && daoUtil.containNoBlankArr([clientUsername])){
            try{
                if(address != null){
                    const { city, street, lon, lat } = data;
                    if(daoUtil.containNoNullArr([city, street, lon, lat]) && daoUtil.containNoBlankArr([city, street, lon, lat])){

                    }
                }

                const resp = await Client.create(data);
                return resp != null;
            }catch(e){
                console.error("ClientDAO: Could not execute the query");
                return false;
            }
        } else{
            console.error("ClientDAO: Wrong parameter provided");
            return false;
        }
    }

    async read(primaryKey){
        if(primaryKey != null && !stringValidator.isBlank(primaryKey)){
            try{
                const resp = await Client.findByPk(primaryKey);
                return resp != null ? resp.dataValues : null;
            }catch(e){
                console.error("ClientDAO: Could not execute the query");
                return null;
            }
        } else{
            console.error("ClientDAO: Wrong parameter provided");
            return null;
        }
    }

    async readAll(){
        try{
            const resp = await Client.findAll();
            return daoUtil.getDataValues(resp);
        }catch(e){
            console.error("ClientDAO: Could not execute the query");
            return false;
        }
    }

    async update(data){
        const { clientUsername } = data;
        if(clientUsername != null && !stringValidator.isBlank(clientUsername)){
            try{
                delete data.clientUsername;
                const resp = await Client.update(
                    data,
                    {where: {clientUsername: clientUsername}}
                );
                return resp[0] > 0;
            }catch(e){
                console.error("ClientDAO: Could not execute the query");
                return false;
            }
        } else{
            console.error("ClientDAO: Wrong parameter provided");
            return false;
        }
    }

    async delete(primaryKey){
        if(primaryKey != null && !stringValidator.isBlank(primaryKey)){
            try{
                const resp = await Client.destroy({ where: {clientUsername: primaryKey}});
                return resp > 0;
            }catch(e){
                console.error("ClientDAO: Could not execute the query");
                return false;
            }
        } else{
            console.error("ClientDAO: Wrong parameter provided");
            return false;
        }
    }
}

module.exports.ClientDAO = ClientDAO;