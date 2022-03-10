const StringValidator = require("../util/StringValidator").StringValidator;
const Client = require("../model/Client").Client;
const DaoUtil = require("../util/DaoUtil").DaoUtil;

const stringValidator = new StringValidator();
const daoUtil = new DaoUtil();

class ClientDAO{
    async create(data){
        const { clientUsername, name } = data;

        if(clientUsername != null && !stringValidator.isBlank(clientUsername)){
            try{
                const resp = await Client.create({clientUsername: clientUsername, name: name});
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
        const {clientUsername, name} = data;
        if(clientUsername != null && !stringValidator.isBlank(clientUsername)){
            try{
                const resp = await Client.update(
                    {name: name},
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
                return null;
            }
        } else{
            console.error("ClientDAO: Wrong parameter provided");
            return null;
        }
    }
}

module.exports.ClientDAO = ClientDAO;