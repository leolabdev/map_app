import { Op } from "sequelize";
import { SERVICE_ERROR_TYPE_NAME } from "../../router/api/v2/routeBuilder/core/config";
import { SEReason } from "../../router/api/v2/routeBuilder/core/service/dataExtractors/error/SEReason";
import { ServiceError } from "../../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError";
import ProfileService from "../../service/ProfileService";
import { makeDBQuery } from "../test_utils/db";

describe('ProfileService test suite', () => {
    /**
     * @type {ProfileService}
     */
    let profileService;

    /**
     * @type { {username: string, password: string} }
     */
    const profile1 = {
        username: 'john',
        password: 'password1'
    }
    /**
     * @type { {username: string, password: string} }
     */
    const profile2 = {
        username: 'greg',
        password: 'password2'
    }
    /**
     * @type { {username: string, password: string} }
     */
    const profile3 = {
        username: 'paul',
        password: 'password3'
    }

    const requiredError = {reason: SEReason.REQUIRED, type: SERVICE_ERROR_TYPE_NAME.description};
    const notStringError = {reason: SEReason.NOT_STRING, type: SERVICE_ERROR_TYPE_NAME.description};
    const notNumberError = {reason: SEReason.NOT_NUMBER, type: SERVICE_ERROR_TYPE_NAME.description};
    const notUniqueError = { reason: SEReason.NOT_UNIQUE, type: SERVICE_ERROR_TYPE_NAME.description };
    const notFoundError = { reason: SEReason.NOT_FOUND, type: SERVICE_ERROR_TYPE_NAME.description };

    beforeEach(() => {
        profileService = new ProfileService();
    });

    describe('create()', () => {
        /**
         * @type{ {input: {}, output: ServiceError[], message: string}[] }
         */
        const requiredErrors = [
            {input: null, output: expect.objectContaining(requiredError), message: 'provided Profile is null' },
            {input: {password: 'pass'}, output: expect.arrayContaining([expect.objectContaining(requiredError)]), message: 'provided Profile has no username' },
            {input: {username: 'user'}, output: expect.arrayContaining([expect.objectContaining(requiredError)]), message: 'provided Profile has no password' },
            {input: {}, output: expect.arrayContaining([expect.objectContaining(requiredError)]), message: 'provided Profile has no username and password' }
        ];
        it.each(requiredErrors)(`Should return ServiceError(s) with reason REQUIRED if $message`, async ({input, output}) => {
            const actual = await profileService.create(input);
            expect(actual).toEqual(output);
        });

        /**
         * @type{ {input: {}, output: ServiceError[], message: string}[] }
         */
        const notStringErrors = [
            {input: {username: 1, password: 'pass'}, output: expect.arrayContaining([expect.objectContaining(notStringError)]), message: 'provided Profile username in not a string' },
            {input: {username: 'user', password: true}, output: expect.arrayContaining([expect.objectContaining(notStringError)]), message: 'provided Profile password in not a string' }
        ];
        it.each(notStringErrors)(`Should return ServiceError(s) with reason NOT_STRING if $message`, async ({input, output}) => {
            const actual = await profileService.create(input);
            expect(actual).toEqual(output);
        });

        it('Should return ServiceError with reason NOT_UNIQUE if Profile with username already exists', async () => {
            const existingUserName = 'user1';

            await makeDBQuery(`INSERT INTO Profile (username, password) VALUES ("${existingUserName}", "password")`);

            const actual = await profileService.create({username: existingUserName, password: 'pass'});

            expect(actual).toEqual(expect.objectContaining(notUniqueError));
        });

        it('Should return array of two ServiceErrors if username is not provided and password is not a string', async () => {
            const serviceError = {type: SERVICE_ERROR_TYPE_NAME.description};
            const input = { password: 34 };

            const actual = await profileService.create(input);

            expect(actual).toHaveLength(2);
            expect(actual).toEqual(expect.arrayContaining([expect.objectContaining(serviceError)]));
        });

        it('Should not add anything to DB if validation failed', async () => {
            const input = { password: 34 };

            await profileService.create(input);

            const dbResp = await makeDBQuery(`SELECT * FROM Profile`);

            expect(dbResp).toHaveLength(0);
        });

        it('Should add new Profile to DB if input is valid and return the created Profile', async () => {
            const actual = await profileService.create(profile1);

            const dbResp = await makeDBQuery(`SELECT * FROM Profile WHERE username="${profile1.username}"`);

            expect(actual).toEqual(expect.objectContaining({...profile1, password: expect.any(String), id: expect.any(Number)}));
            expect(dbResp[0]).toEqual(expect.objectContaining({username: profile1.username}));
        });

        it('Should hash a provided password', async () => {
            await profileService.create(profile1);

            const dbResp = await makeDBQuery(`SELECT * FROM Profile WHERE username="${profile1.username}"`);

            expect(dbResp[0].password).not.toBe(profile1.password);
        });
    });

    describe('authenticate()', () => {
        beforeEach(async () => {
            await profileService.create(profile1);
        });

        it('Should return object with accessToken, expiresOn, username and password fields if credentials are valid', async () => {
            const actual = await profileService.authenticate(profile1);

            expect(actual).toEqual(expect.objectContaining({
                ...profile1, 
                accessToken: expect.any(String), 
                expiresOn: expect.any(Number)
            }));
        });

        /**
         * @type{ {input: {}, output: ServiceError[], message: string}[] }
         */
        const requiredErrors = [
            {input: null, output: expect.objectContaining(requiredError), message: 'provided credentials are null' },
            {input: {password: 'pass'}, output: expect.arrayContaining([expect.objectContaining(requiredError)]), message: 'provided credentials have no username' },
            {input: {username: 'user'}, output: expect.arrayContaining([expect.objectContaining(requiredError)]), message: 'provided credentials have no password' },
            {input: {}, output: expect.arrayContaining([expect.objectContaining(requiredError)]), message: 'provided credentials have no username and password' }
        ];
        it.each(requiredErrors)(`Should return ServiceError(s) with reason REQUIRED if $message`, async ({input, output}) => {
            const actual = await profileService.authenticate(input);
            expect(actual).toEqual(output);
        });

        /**
         * @type{ {input: {}, output: ServiceError[], message: string}[] }
         */
        const notStringErrors = [
            {input: {username: 1, password: 'pass'}, output: expect.arrayContaining([expect.objectContaining(notStringError)]), message: 'provided credentials username in not a string' },
            {input: {username: 'user', password: true}, output: expect.arrayContaining([expect.objectContaining(notStringError)]), message: 'provided credentials password in not a string' }
        ];
        it.each(notStringErrors)(`Should return ServiceError(s) with reason NOT_STRING if $message`, async ({input, output}) => {
            const actual = await profileService.authenticate(input);
            expect(actual).toEqual(output);
        });

        it('Should return array of two ServiceErrors if username is not provided and password is not a string', async () => {
            const serviceError = {type: SERVICE_ERROR_TYPE_NAME.description};
            const input = { password: 34 };

            const actual = await profileService.authenticate(input);

            expect(actual).toHaveLength(2);
            expect(actual).toEqual(expect.arrayContaining([expect.objectContaining(serviceError)]));
        });

        it('Should return null if password is invalid', async () => {
            const actual = await profileService.authenticate({...profile1, password: 'wrong_password'});

            expect(actual).toBeNull();
        });

        it('Should return null if profile does not exists', async () => {
            const actual = await profileService.authenticate({username: 'non_existing', password: 'wrong_password'});

            expect(actual).toBeNull();
        });

        it('Should return right expiresOn field, which should be after 12h from the creation moment', async () => {
            const expected = Date.now() + 12 * 60 * 60 * 1000;

            const { expiresOn } = await profileService.authenticate(profile1);

            const difference = Math.abs(expiresOn - expected);
            const oneMinute = 60000;

            expect(difference).toBeLessThan(oneMinute);
        });
    });

    describe('read()', () => {
        let profileId1;
        beforeEach(async () => {
            profileId1 = await makeDBQuery(`INSERT INTO Profile (username, password) VALUES ("${profile1.username}", "${profile1.password}")`);
        });

        it('Should return Profile object if Profile with requested id exists', async () => {
            const actual = await profileService.read(profileId1);
            expect(actual).toEqual({...profile1, id: profileId1});
        });

        it('Should return ServiceError with reason REQUIRED if no id provided', async () => {
            const actual = await profileService.read();
            expect(actual).toEqual(expect.objectContaining(requiredError));
        });

        it('Should return ServiceError with reason NOT_NUMBER if id field is not a number', async () => {
            const actual = await profileService.read('not_num');
            expect(actual).toEqual(expect.arrayContaining([expect.objectContaining(notNumberError)]));
        });

        it('Should return null if Profile with provided id does not exists', async () => {
            const actual = await profileService.read(12345);
            expect(actual).toBeNull();
        });
    });

    describe('searchByUserName()', () => {
        let profileId1;
        beforeEach(async () => {
            profileId1 = await makeDBQuery(`INSERT INTO Profile (username, password) VALUES ("${profile1.username}", "${profile1.password}")`);
        });

        it('Should return Profile object if Profile with requested username exists', async () => {
            const actual = await profileService.searchByUserName(profile1.username);
            expect(actual).toEqual({...profile1, id: profileId1});
        });

        it('Should return ServiceError with reason REQUIRED if no username provided', async () => {
            const actual = await profileService.searchByUserName();
            expect(actual).toEqual(expect.objectContaining(requiredError));
        });

        it('Should return ServiceError with reason NOT_STRING if username field is not a string', async () => {
            const actual = await profileService.searchByUserName(true);
            expect(actual).toEqual(expect.arrayContaining([expect.objectContaining(notStringError)]));
        });

        it('Should return null if Profile with provided username does not exists', async () => {
            const actual = await profileService.searchByUserName('non_existing');
            expect(actual).toBeNull();
        });
    });

    describe('readAll()', () => {
        let profileId1, profileId2, profileId3;
        beforeEach(async () => {
            profileId1 = await makeDBQuery(`INSERT INTO Profile (username, password) VALUES ("${profile1.username}", "${profile1.password}")`);
            profileId2 = await makeDBQuery(`INSERT INTO Profile (username, password) VALUES ("${profile2.username}", "${profile2.password}")`);
            profileId3 = await makeDBQuery(`INSERT INTO Profile (username, password) VALUES ("${profile3.username}", "${profile3.password}")`);
        });

        it('Should return an array of all existing Profile objects if the options param is not provided', async () => {
            const expected = [
                {...profile1, id: profileId1},
                {...profile2, id: profileId2},
                {...profile3, id: profileId3}
            ];
            const actual = await profileService.readAll();
            expect(actual).toEqual(expect.arrayContaining(expected));
        });

        it('Should return empty array if no Profiles exist', async () => {
            await makeDBQuery('DELETE FROM Profile');
            const actual = await profileService.readAll();
            expect(actual).toHaveLength(0);
        });

        it('Should return array of 2 Profile objects, if there are more than 2 Profiles exists and { limit: 2 } is provided as input', async () => {
            const actual = await profileService.readAll({ limit: 2 });
            expect(actual).toHaveLength(2);
            expect(actual).not.toBeInstanceOf(ServiceError);
        });

        it(`Should return an array of Profile objects with usernames starting with "${profile1.username}" only, if { where: {username: [Op.like]: "${profile1.username}%"} } is provided as input`, async () => {
            const expected = { username: profile1.username }
            const actual = await profileService.readAll({ where: {username: {[Op.like]: `${profile1.username}%`}}});

            expect(actual).toEqual(expect.arrayContaining([expect.objectContaining(expected)]));
        });
    });

    describe('update()', () => {
        let profileId1;
        beforeEach(async () => {
            profileId1 = await makeDBQuery(`INSERT INTO Profile (username, password) VALUES ("${profile1.username}", "${profile1.password}")`);
        });

        it('Should return true if Profile was updated successfully and update the Profile in DB', async () => {
            const updateObj = {...profile1, password: 'newPassword', id: profileId1};

            const isSuccess = await profileService.update(updateObj);
            const dbResp = await makeDBQuery(`SELECT * FROM Profile WHERE id="${profileId1}"`);

            expect(isSuccess).toBe(true);
            expect(dbResp[0]).toEqual(updateObj);
        });

        /**
         * @type{ {input: {}, output: ServiceError[], message: string}[] }
         */
        const requiredErrors = [
            {input: null, output: expect.objectContaining(requiredError), message: 'provided Profile is null' },
            {input: {password: 'pass'}, output: expect.arrayContaining([expect.objectContaining(requiredError)]), message: 'provided Profile has no id' }
        ];
        it.each(requiredErrors)(`Should return ServiceError(s) with reason REQUIRED if $message`, async ({input, output}) => {
            const actual = await profileService.update(input);
            expect(actual).toEqual(output);
        });

        it(`Should return ServiceError array with reason NOT_NUMBER if id is not number`, async () => {
            const actual = await profileService.update({...profile1, id: 'not_num'});
            expect(actual).toEqual(expect.arrayContaining([expect.objectContaining(notNumberError)]));
        });

        /**
         * @type{ {input: {}, output: ServiceError[], message: string}[] }
         */
        const notStringErrors = [
            {input: {id: profileId1, username: 1, password: 'pass'}, output: expect.arrayContaining([expect.objectContaining(notStringError)]), message: 'provided Profile username in not a string' },
            {input: {id: profileId1, username: 'user', password: true}, output: expect.arrayContaining([expect.objectContaining(notStringError)]), message: 'provided Profile password in not a string' }
        ];
        it.each(notStringErrors)(`Should return ServiceError(s) with reason NOT_STRING if $message`, async ({input, output}) => {
            const actual = await profileService.update(input);
            expect(actual).toEqual(output);
        });

        it('Should return ServiceError with reason NOT_UNIQUE if Profile with username already exists', async () => {
            const profileId2 = await makeDBQuery(`INSERT INTO Profile (username, password) VALUES ("${profile2.username}", "password")`);

            const actual = await profileService.update({...profile1, id: profileId2});

            expect(actual).toEqual(expect.objectContaining(notUniqueError));
        });

        it('Should return ServiceError with reason NOT_FOUND if Profile with provided id does not exist', async () => {
            const actual = await profileService.update({...profile2, id: 1234});
            expect(actual).toEqual(expect.objectContaining(notFoundError));
        });

        it('Should not update anything to DB if validation failed', async () => {
            const input = { password: 34, id: profileId1 };

            await profileService.update(input);

            const dbResp = await makeDBQuery(`SELECT * FROM Profile WHERE id="${profileId1}"`);

            expect(dbResp[0]).toEqual({...profile1, id: profileId1});
        });

        it('Should return false if nothing was updated', async () => {
            const isSuccess = await profileService.update({id: profileId1});
            expect(isSuccess).toBe(false);
        });
    });

    describe('delete()', () => {
        let profileId1;
        beforeEach(async () => {
            profileId1 = await makeDBQuery(`INSERT INTO Profile (username, password) VALUES ("${profile1.username}", "${profile1.password}")`);
        });

        it('Should return true if Profile was deleted successfully and it is removed from DB', async () => {
            const actual = await profileService.delete(profileId1);
            const dbResp = await makeDBQuery(`SELECT * FROM Profile WHERE id="${profileId1}"`);

            expect(actual).toBe(true);
            expect(dbResp).toHaveLength(0);
        });

        it('Should return ServiceError with reason REQUIRED if no id provided', async () => {
            const actual = await profileService.delete();
            expect(actual).toEqual(expect.objectContaining(requiredError));
        });

        it('Should return ServiceError with reason NOT_NUMBER if id field is not a number', async () => {
            const actual = await profileService.delete('not_num');
            expect(actual).toEqual(expect.arrayContaining([expect.objectContaining(notNumberError)]));
        });

        it('Should return ServiceError with reason NOT_FOUND if Profile with provided id does not exists', async () => {
            const actual = await profileService.delete(12345);
            expect(actual).toEqual(expect.objectContaining(notFoundError));
        });

        it('Should not delete the profile from DB if validation failed', async () => {
            await profileService.delete('not_valid');
            const dbResp = await makeDBQuery(`SELECT * FROM Profile WHERE id="${profileId1}"`);

            expect(dbResp[0]).toEqual({...profile1, id: profileId1});
        });
    });
});