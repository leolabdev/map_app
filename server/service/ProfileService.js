import DaoUtil from "../util/DaoUtil.js";
import Address from "../model/Address.js";
import Profile from "../model/Profile.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {DEFactory} from "../router/api/v2/test/routeBuilder/core/service/dataExtractors/DEFactory.js";
import {ServiceError} from "../router/api/v2/test/routeBuilder/core/service/dataExtractors/error/ServiceError.js";
import {SEReason} from "../router/api/v2/test/routeBuilder/core/service/dataExtractors/error/SEReason.js";
import {validateInput} from "../router/api/v2/test/routeBuilder/core/service/validateInput.js";
import {profileCreate, profileId} from "./validation/profile.js";

const daoUtil = new DaoUtil();

/**
 * The class provides functionality for manipulating(CRUD operations) with Client SQL table.
 * This table contains clients data such as client username and name
 */
export default class ProfileService {
    constructor() {
        this.extractor = DEFactory.create();
    }

    /**
     * The method creates new client in the Client SQL table
     * @param {Client} data object with the client data, where clientUsername field is manditory
     * @returns created Client object, if operation was sucessful or null if not
     */
    create = validateInput(async (data) => {
        const { username, password } = data;

        if(!username || !password){
            console.error("ProfileService: Wrong parameter provided");
            return new ServiceError({reason: SEReason.NOT_VALID});
        }

        try {
            const salt = await bcrypt.genSalt(10); // Generate salt
            const hashedPassword = await bcrypt.hash(password, salt);

            const isProfile = await this.searchByUserName(username);
            if(isProfile)
                return null;

            const resp = await Profile.create({username, password: hashedPassword});
            return resp.dataValues != null ? resp.dataValues : null;
        } catch (e) {
            console.error("ProfileService create: Could not execute the query");
            return null;
        }
    }, null);

    async authenticate(credentials) {
        const secret = 'your_secret_key';
        const jwt_expires = '12h';
        const {username, password} = credentials;

        const profile = await this.searchByUserName(username);
        if(!profile || !(await bcrypt.compare(password, profile.password)))
            return null;

        const token = jwt.sign({ id: profile.id }, secret, { expiresIn: jwt_expires });
        return { token, username, password };
    }

    /**
     * The method reads Client with provided primary key(clientUsername)
     * @param {string} primaryKey primary key of the client
     * @returns founded Client object, if operation was sucessful or null if not
     */
    read = validateInput(async (primaryKey) => {
        try {
            const resp = await Profile.findByPk(primaryKey);
            return this.extractor.extract(resp);
        } catch(e) {
            console.error("ProfileService: Could not execute the query", e);
            return null;
        }
    }, profileId);

    /**
     * The method reads Client with provided primary key(clientUsername)
     * @param {string} username primary key of the client
     * @returns founded Client object, if operation was sucessful or null if not
     */
    async searchByUserName(username) {
        if(!username){
            console.error("ProfileService read: Wrong parameter provided");
            return null;
        }

        try {
            const resp = await Profile.findOne({where: {username}});

            return resp != null ? resp.dataValues : null;
        } catch (e) {
            console.error("ProfileService: Could not execute the query");
            return null;
        }
    }

    /**
     * The method reads all Clients of the Client SQL table
     * @returns array of the founded Client objects, if operation was sucessful or null if not
     */
    async readAll() {
        try {
            const resp = await Profile.findAll({ include: Address });
            return daoUtil.getDataValues(resp);
        } catch (e) {
            console.error("ProfileService readAll: Could not execute the query");
            return null;
        }
    }

    /**
     * The method updates existing client data in the Client SQL table
     * @param {Client} data object with the client data, such as clientUsername or name
     * @returns true, if the operation was sucessful or false if not
     */
    async update(data) {
        const { id, username, password } = data;

        if(!id || !username || !password){
            console.error("ProfileService: Wrong parameter provided");
            return null;
        }

        try {
            const resp = await Profile.update(
                {username, password}, { where: { id } }
            );

            return resp[0] > 0;
        } catch (e) {
            console.error("ProfileService update: Could not execute the query");
            console.error(e);
            return false;
        }
    }

    /**
     * The method deletes client with provided primary key(clientUsername)
     * @param {string} primaryKey primary key of the client
     * @returns true if operation was sucessful or false if not
     */
    async delete(primaryKey) {
        if(!primaryKey){
            console.error("ProfileService delete: Wrong parameter provided");
            return false;
        }

        try {
            const resp = await Profile.destroy({ where: { id: primaryKey } });
            return resp > 0;
        } catch (e) {
            console.error("ProfileService delete: Could not execute the query");
            console.error(e);
            return false;
        }
    }
}