import Joi from "joi";
import Profile from "../../model/Profile";
import BasicService from "../../service/BasicService";
import { makeDBQuery } from "../test_utils/db";
import { ServiceError } from "../../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError";
import { SEReason } from "../../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason";

describe('BasicService test suite', () => {
    /**
     * @type{ BasicService }
     */
    let basicService;
    beforeEach(() => {
        basicService = new BasicService(Profile, 'ProfileService');
    });

    /**
        @type{ {id: number, username: string, password: string} }
    */
    const profile1 = {
        username: 'user1',
        password: 'password'
    }
    const profile2 = {
        username: 'user2',
        password: 'password'
    }

    /**
     * { where: {username must be a string and required} }
     */
    const validationSchema = {schema: Joi.object({
        where: Joi.object({
          username: Joi.string().required()
        }).required()
    })}; 

    describe('create()', () =>{
        it('Should return created object', async () => {
            const actual = await basicService.create(profile1);

            expect(actual).toEqual(expect.objectContaining({...profile1, id: expect.any(Number)}));
        });
        it('Should add object to DB', async () => {
            await basicService.create(profile1);

            const resp = await makeDBQuery('SELECT * FROM Profile');

            expect(resp).toHaveLength(1);
            expect(resp[0]).toEqual(expect.objectContaining(profile1));
        });
        it('Should return ServiceErrors if input is not matching the validation', async () => {
            const validationSchema = { schema: Joi.object({
                username: Joi.string().required(),
                password: Joi.string().required()
            })};
            const input = { username: 2 };

            const actual = await basicService.create(input, validationSchema);

            expect(actual).toHaveLength(2);
            expect(actual[0] instanceof ServiceError).toBe(true);
        });

        it('Should not save an object in DB if validation failed', async () => {
            const validationSchema = { schema: Joi.object({
                username: Joi.string().required(),
                password: Joi.string().required()
            })};
            const input = { username: 2 };

            await basicService.create(input, validationSchema);

            const resp = await makeDBQuery('SELECT * FROM Profile');

            expect(resp).toHaveLength(0);
        });
    });

    describe('readOneById()', () => {
        it('Should return existing object with provided id field', async () => {
            const profileId1 = await makeDBQuery(`INSERT INTO Profile (username, password) VALUES ("${profile1.username}", "${profile1.password}")`);
            const profileId2 = await makeDBQuery(`INSERT INTO Profile (username, password) VALUES ("${profile2.username}", "${profile2.password}")`);

            const actual = await basicService.readOneById(profileId1);
            
            expect(actual).toEqual({...profile1, id: profileId1});
            expect(actual).not.toEqual({...profile2, id: profileId2});
        });

        it('Should return ServiceErrors if input is not matching the validation', async () => {
            const validationSchema = { schema: Joi.number().required()};

            const actual = await basicService.readOneById('not_valid', validationSchema);
            
            expect(actual).toHaveLength(1);
            expect(actual[0] instanceof ServiceError).toBe(true);
        });

        it('Should return null if requested object does not exist', async () => {
            const actual = await basicService.readOneById(12345);
            
            expect(actual).toEqual(null);
        });
    });

    describe('searchOne()', () => {
        it('Should return existing object with provided query', async () => {
            const profileId1 = await makeDBQuery(`INSERT INTO Profile (username, password) VALUES ("${profile1.username}", "${profile1.password}")`);
            const profileId2 = await makeDBQuery(`INSERT INTO Profile (username, password) VALUES ("${profile2.username}", "${profile2.password}")`);

            const actual = await basicService.searchOne({where: {username: profile1.username}});
            
            expect(actual).toEqual({...profile1, id: profileId1});
            expect(actual).not.toEqual({...profile2, id: profileId2});
        });

        it('Should return ServiceErrors if input is not matching the validation', async () => {
            const actual = await basicService.searchOne({password: 'pass'}, validationSchema);
            
            expect(actual).toHaveLength(2);
            expect(actual[0] instanceof ServiceError).toBe(true);
        });

        it('Should return null if requested object does not exist', async () => {
            const actual = await basicService.searchOne({where: { username: 'my_user' }});
            expect(actual).toEqual(null);
        });
    });

    describe('readAll()', () => {
        it('Should return all existing objects in DB', async () => {
            const profileId1 = await makeDBQuery(`INSERT INTO Profile (username, password) VALUES ("${profile1.username}", "${profile1.password}")`);
            const profileId2 = await makeDBQuery(`INSERT INTO Profile (username, password) VALUES ("${profile2.username}", "${profile2.password}")`);

            const actual = await basicService.readAll();
            
            expect(actual).toHaveLength(2);
            expect(actual).toEqual(expect.arrayContaining([{...profile2, id: profileId2}, {...profile1, id: profileId1}]));
        });

        it('Should return ServiceErrors if input is not matching the validation', async () => {
            const actual = await basicService.readAll({password: 'pass'}, validationSchema);
            
            expect(actual).toHaveLength(2);
            expect(actual[0] instanceof ServiceError).toBe(true);
        });

        it('Should return empty [] if requested objects do not exist', async () => {
            const actual = await basicService.readAll({where: { username: 'my_user' }});
            expect(actual).toEqual([]);
        });
    });

    describe('update()', () => {
        let existingProfileId;
        beforeEach(async () => {
            existingProfileId = await makeDBQuery(`INSERT INTO Profile (username, password) VALUES ("${profile1.username}", "${profile1.password}")`);
        });

        it('Should update existing object in DB and return true', async () => {
            const newUsername = 'new_username';
            const isSuccess = await basicService.update({username: newUsername}, null, {where: {username: profile1.username}});

            const dbResp = await makeDBQuery(`SELECT * FROM Profile WHERE id="${existingProfileId}"`);

            expect(dbResp[0]).toEqual({...profile1, id: existingProfileId, username: newUsername});
            expect(isSuccess).toBe(true);
        });

        it('Should return ServiceErrors if input is not matching the validation schema', async () => {
            const actual = await basicService.update({password: 'pass'}, validationSchema, {where: {id: existingProfileId}});
            
            expect(actual).toHaveLength(2);
            expect(actual[0]).toBeInstanceOf(ServiceError);
        });

        it('Should not update object in DB if input is not matching the validation schema', async () => {
            await basicService.update({password: 'pass'}, validationSchema, {where: {id: existingProfileId}});
            
            const dbResp = await makeDBQuery(`SELECT * FROM Profile WHERE id="${existingProfileId}"`);

            expect(dbResp[0]).toEqual({...profile1, id: existingProfileId});
        });

        it('Should return false if nothing was updated', async () => {
            const isSuccess = await basicService.update({...profile1}, null, {where: {id: existingProfileId}});

            expect(isSuccess).toBe(false);
        });

        it('Should return false if object does not exists', async () => {
            const isSuccess = await basicService.update({...profile1}, null, {where: {id: 12345}});
            expect(isSuccess).toBe(false);
        });
    });

    describe('updateById()', () => {
        let existingProfileId;
        beforeEach(async () => {
            existingProfileId = await makeDBQuery(`INSERT INTO Profile (username, password) VALUES ("${profile1.username}", "${profile1.password}")`);
        });

        it('Should update existing object by id in DB and return true', async () => {
            const newUsername = 'new_username';
            const isSuccess = await basicService.updateById({id: existingProfileId, username: newUsername});

            const dbResp = await makeDBQuery(`SELECT * FROM Profile WHERE id="${existingProfileId}"`);

            expect(dbResp[0]).toEqual({...profile1, id: existingProfileId, username: newUsername});
            expect(isSuccess).toBe(true);
        });

        it('Should return ServiceErrors if input is not matching the validation schema', async () => {
            const actual = await basicService.updateById({password: 'pass'}, validationSchema);
            
            expect(actual).toHaveLength(2);
            expect(actual[0]).toBeInstanceOf(ServiceError);
        });

        it('Should not update object in DB if input is not matching the validation schema', async () => {
            await basicService.updateById({id: existingProfileId, password: 'pass'}, validationSchema);
            
            const dbResp = await makeDBQuery(`SELECT * FROM Profile WHERE id="${existingProfileId}"`);

            expect(dbResp[0]).toEqual({...profile1, id: existingProfileId});
        });

        it('Should return ServiceError NOT_FOUND if object does not exists', async () => {
            const actual = await basicService.updateById({...profile1, id: 12345});

            expect(actual).toBeInstanceOf(ServiceError);
            expect(actual.reason).toBe(SEReason.NOT_FOUND);
        });

        it('Should return false if nothing was updated', async () => {
            const isSuccess = await basicService.updateById({...profile1, id: existingProfileId});
            expect(isSuccess).toBe(false);
        });
    });

    describe('deleteById()', () =>{
        let existingProfileId;
        beforeEach(async () => {
            existingProfileId = await makeDBQuery(`INSERT INTO Profile (username, password) VALUES ("${profile1.username}", "${profile1.password}")`);
        });

        it('Should delete existing object from DB and return true', async () => {
            const isSuccess = await basicService.deleteById(existingProfileId);

            const dbResp = await makeDBQuery(`SELECT * FROM Profile WHERE id="${existingProfileId}"`);

            expect(dbResp[0]).toEqual(undefined);
            expect(isSuccess).toBe(true);
        });

        it('Should return ServiceError if input is not matching the validation schema', async () => {
            const validationSchema = { schema: Joi.number().required() }
            const actual = await basicService.deleteById('', validationSchema);

            expect(actual).toBeInstanceOf(ServiceError);
        });

        it('Should not delete object from DB if input is not matching the validation schema', async () => {
            const validationSchema = { schema: Joi.string().required() }
            await basicService.deleteById(existingProfileId, validationSchema);
            
            const dbResp = await makeDBQuery(`SELECT * FROM Profile WHERE id="${existingProfileId}"`);

            expect(dbResp[0]).toEqual({...profile1, id: existingProfileId});
        });

        it('Should return ServiceError NOT_FOUND when trying to delete non-existing object', async () => {
            const actual = await basicService.deleteById(12345);

            expect(actual).toBeInstanceOf(ServiceError);
            expect(actual.reason).toBe(SEReason.NOT_FOUND);
        });
    });

    describe('deleteByCondition()', () =>{
        let existingProfileId;
        beforeEach(async () => {
            existingProfileId = await makeDBQuery(`INSERT INTO Profile (username, password) VALUES ("${profile1.username}", "${profile1.password}")`);
        });

        it('Should delete existing object from DB and return true', async () => {
            const isSuccess = await basicService.deleteByCondition({where: {username: profile1.username}});

            const dbResp = await makeDBQuery(`SELECT * FROM Profile WHERE id="${existingProfileId}"`);

            expect(dbResp[0]).toEqual(undefined);
            expect(isSuccess).toBe(true);
        });

        it('Should return ServiceErrors if input is not matching the validation schema', async () => {
            const actual = await basicService.deleteByCondition({ where: {username: 12} }, validationSchema);

            expect(actual).toHaveLength(1);
            expect(actual[0]).toBeInstanceOf(ServiceError);
        });

        it('Should not delete object from DB if input is not matching the validation schema', async () => {
            await basicService.deleteByCondition({ where: {password: "pass", id: existingProfileId} }, validationSchema);
            
            const dbResp = await makeDBQuery(`SELECT * FROM Profile WHERE id="${existingProfileId}"`);

            expect(dbResp[0]).toEqual({...profile1, id: existingProfileId});
        });

        it('Should return false if nothing was removed', async () => {
            const actual = await basicService.deleteByCondition({ where: {id: 12345} });

            expect(actual).toBe(false);
        });
    });

    describe('rawQuery()', () =>{
        it('Should return array with two elements', async () => {
            const actual = await basicService.rawQuery('SELECT * FROM Profile');
            expect(actual).toHaveLength(2);
        });

        it('Should find all existing objects with SELECT query', async () => {
            await makeDBQuery(`INSERT INTO Profile (username, password) VALUES ("${profile1.username}", "${profile1.password}")`);
            const actual = await basicService.rawQuery('SELECT * FROM Profile');
            expect(actual[0]).toHaveLength(1);
            expect(actual[0]).toEqual(expect.arrayContaining([{...profile1, id: expect.any(Number)}]));
        });
    });
});