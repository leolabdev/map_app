import { Op } from "sequelize";
import { ServiceError } from "../../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError";
import ProfileService from "../../service/ProfileService";
import { emptyTable, insertInto, selectById, selectFrom } from "../test_utils/db";
import {requiredError, notStringError, notNumberError, notUniqueError, notFoundError, serviceError} from '../test_utils/data/serviceErrors';
import ProfileGenerator from "../test_utils/data/ProfileGenerator";

describe('ProfileService test suite', () => {
    /**
     * @type {ProfileService}
     */
    let profileService;

    const profileGen = new ProfileGenerator();

    beforeEach(() => {
        profileService = new ProfileService();
    });

    describe('create()', () => {
        /**
         * @type{ {input: {}, output: ServiceError[], message: string}[] }
         */
        const requiredErrors = [
            {input: null, output: expect.objectContaining(requiredError), message: 'provided Profile is null' },
            {input: profileGen.createAny({username: undefined}), output: expect.arrayContaining([expect.objectContaining(requiredError)]), message: 'provided Profile has no username' },
            {input: profileGen.createAny({username: 'user'}, { password: undefined }), output: expect.arrayContaining([expect.objectContaining(requiredError)]), message: 'provided Profile has no password' },
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
            {input: profileGen.createAny({username: 1}), output: expect.arrayContaining([expect.objectContaining(notStringError)]), message: 'provided Profile username in not a string' },
            {input: profileGen.createAny({username: 'user'}, { password: true }), output: expect.arrayContaining([expect.objectContaining(notStringError)]), message: 'provided Profile password in not a string' }
        ];
        it.each(notStringErrors)(`Should return ServiceError(s) with reason NOT_STRING if $message`, async ({input, output}) => {
            const actual = await profileService.create(input);
            expect(actual).toEqual(output);
        });

        it('Should return ServiceError with reason NOT_UNIQUE if Profile with username already exists', async () => {
            const existingProfile = profileGen.create({username: 'user1'});

            await insertInto('Profile', existingProfile);

            const actual = await profileService.create(existingProfile);

            expect(actual).toEqual(expect.objectContaining(notUniqueError));
        });

        it('Should return array of two ServiceErrors if username is not provided and password is not a string', async () => {
            const input = profileGen.createAny({username: undefined}, {password: 34});

            const actual = await profileService.create(input);

            expect(actual).toHaveLength(2);
            expect(actual).toEqual(expect.arrayContaining([expect.objectContaining(serviceError)]));
        });

        it('Should not add anything to DB if validation failed', async () => {
            const input = profileGen.createAny({username: undefined}, {password: 34});

            await profileService.create(input);

            const dbResp = await selectFrom('Profile');

            expect(dbResp).toBeNull();
        });

        it('Should add new Profile to DB if input is valid and return the created Profile', async () => {
            const profileToCreate = profileGen.create();
            const actual = await profileService.create(profileToCreate);

            const dbResp = await selectFrom('Profile', `username="${profileToCreate.username}"`);

            expect(actual).toEqual(expect.objectContaining({...profileToCreate, password: expect.any(String), id: expect.any(Number)}));
            expect(dbResp[0]).toEqual(expect.objectContaining({username: profileToCreate.username}));
        });

        it('Should hash a provided password', async () => {
            const profileToCreate = profileGen.create();
            await profileService.create(profileToCreate);

            const dbResp = await selectFrom('Profile', `username="${profileToCreate.username}"`);

            expect(dbResp[0].password).not.toBe(profileToCreate.password);
        });
    });

    describe('authenticate()', () => {
        const profile = profileGen.create();

        beforeEach(async () => {
            await profileService.create(profile);
        });

        it('Should return object with accessToken, expiresOn, username and password fields if credentials are valid', async () => {
            const actual = await profileService.authenticate(profile);

            expect(actual).toEqual(expect.objectContaining({
                ...profile, 
                accessToken: expect.any(String), 
                expiresOn: expect.any(Number)
            }));
        });

        /**
         * @type{ {input: {}, output: ServiceError[], message: string}[] }
         */
        const requiredErrors = [
            {input: null, output: expect.objectContaining(requiredError), message: 'provided credentials are null' },
            {input: profileGen.createAny({username: undefined}), output: expect.arrayContaining([expect.objectContaining(requiredError)]), message: 'provided credentials have no username' },
            {input: profileGen.createAny({username: 'user1'}, {password: undefined}), output: expect.arrayContaining([expect.objectContaining(requiredError)]), message: 'provided credentials have no password' },
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
            {input: profileGen.createAny({username: 1}), output: expect.arrayContaining([expect.objectContaining(notStringError)]), message: 'provided credentials username in not a string' },
            {input: profileGen.createAny({username: 'user'}, { password: 1 }), output: expect.arrayContaining([expect.objectContaining(notStringError)]), message: 'provided credentials password in not a string' }
        ];
        it.each(notStringErrors)(`Should return ServiceError(s) with reason NOT_STRING if $message`, async ({input, output}) => {
            const actual = await profileService.authenticate(input);
            expect(actual).toEqual(output);
        });

        it('Should return array of two ServiceErrors if username is not provided and password is not a string', async () => {
            const input = profileGen.createAny({username: undefined}, { password: 34 });

            const actual = await profileService.authenticate(input);

            expect(actual).toHaveLength(2);
            expect(actual).toEqual(expect.arrayContaining([expect.objectContaining(serviceError)]));
        });

        it('Should return null if password is invalid', async () => {
            const actual = await profileService.authenticate({...profile, password: 'wrong_password'});

            expect(actual).toBeNull();
        });

        it('Should return null if profile does not exists', async () => {
            const actual = await profileService.authenticate({username: 'non_existing', password: 'wrong_password'});

            expect(actual).toBeNull();
        });

        it('Should return right expiresOn field, which should be after 12h from the creation moment', async () => {
            const expected = Date.now() + 12 * 60 * 60 * 1000;

            const { expiresOn } = await profileService.authenticate(profile);

            const difference = Math.abs(expiresOn - expected);
            const oneMinute = 60000;

            expect(difference).toBeLessThan(oneMinute);
        });
    });

    describe('read()', () => {
        const profile = profileGen.create();
        let profileId1;
        beforeEach(async () => {
            profileId1 = await insertInto('Profile', profile);
        });

        it('Should return Profile object if Profile with requested id exists', async () => {
            const actual = await profileService.read(profileId1);
            expect(actual).toEqual({...profile, id: profileId1});
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
        const profile = profileGen.create();

        let profileId1;
        beforeEach(async () => {
            profileId1 = await insertInto('Profile', profile);
        });

        it('Should return Profile object if Profile with requested username exists', async () => {
            const actual = await profileService.searchByUserName(profile.username);
            expect(actual).toEqual({...profile, id: profileId1});
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
        const profile1 = profileGen.create({username: 'user1'});
        const profile2 = profileGen.create({username: 'user2'});
        const profile3 = profileGen.create({username: 'user3'});

        let profileId1, profileId2, profileId3;
        
        beforeEach(async () => {
            profileId1 = await insertInto('Profile', profile1);
            profileId2 = await insertInto('Profile', profile2);
            profileId3 = await insertInto('Profile', profile3);
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
            await emptyTable('Profile')
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
        const profile = profileGen.create();

        let profileId1;
        beforeEach(async () => {
            profileId1 = await insertInto('Profile', profile);
        });

        it('Should return true if Profile was updated successfully and update the Profile in DB', async () => {
            const updateObj = {...profile, password: 'newPassword', id: profileId1};

            const isSuccess = await profileService.update(updateObj);
            const dbResp = await selectById('Profile', profileId1);

            expect(isSuccess).toBe(true);
            expect(dbResp).toEqual(updateObj);
        });

        /**
         * @type{ {input: {}, output: ServiceError[], message: string}[] }
         */
        const requiredErrors = [
            {input: null, output: expect.objectContaining(requiredError), message: 'provided Profile is null' },
            {input: profileGen.create(), output: expect.arrayContaining([expect.objectContaining(requiredError)]), message: 'provided Profile has no id' }
        ];
        it.each(requiredErrors)(`Should return ServiceError(s) with reason REQUIRED if $message`, async ({input, output}) => {
            const actual = await profileService.update(input);
            expect(actual).toEqual(output);
        });

        it(`Should return ServiceError array with reason NOT_NUMBER if id is not number`, async () => {
            const actual = await profileService.update({...profile, id: 'not_num'});
            expect(actual).toEqual(expect.arrayContaining([expect.objectContaining(notNumberError)]));
        });

        /**
         * @type{ {input: {}, output: ServiceError[], message: string}[] }
         */
        const notStringErrors = [
            {input: {id: profileId1, ...profileGen.createAny({username: 1})}, output: expect.arrayContaining([expect.objectContaining(notStringError)]), message: 'provided Profile username in not a string' },
            {input: {id: profileId1, ...profileGen.createAny({username: 'user1'}, {password: 1})}, output: expect.arrayContaining([expect.objectContaining(notStringError)]), message: 'provided Profile password in not a string' }
        ];
        it.each(notStringErrors)(`Should return ServiceError(s) with reason NOT_STRING if $message`, async ({input, output}) => {
            const actual = await profileService.update(input);
            expect(actual).toEqual(output);
        });

        it('Should return ServiceError with reason NOT_UNIQUE if Profile with username already exists', async () => {
            const profile2 = profileGen.create({username: 'user2'});
            const profileId2 = await insertInto('Profile', profile2);

            const actual = await profileService.update({...profile, id: profileId2});

            expect(actual).toEqual(expect.objectContaining(notUniqueError));
        });

        it('Should return ServiceError with reason NOT_FOUND if Profile with provided id does not exist', async () => {
            const profile2 = profileGen.create({username: 'user2'});
            const actual = await profileService.update({...profile2, id: 1234});
            expect(actual).toEqual(expect.objectContaining(notFoundError));
        });

        it('Should not update anything to DB if validation failed', async () => {
            const input = { ...profileGen.create({username: undefined}, {password: 123}), id: profileId1 };

            await profileService.update(input);

            const dbResp = await selectById('Profile', profileId1);

            expect(dbResp).toEqual({...profile, id: profileId1});
        });

        it('Should return false if nothing was updated', async () => {
            const isSuccess = await profileService.update({id: profileId1});
            expect(isSuccess).toBe(false);
        });
    });

    describe('delete()', () => {
        const profile = profileGen.create({username: 'user1'});
        let profileId1;
        beforeEach(async () => {
            profileId1 = await insertInto('Profile', profile);
        });

        it('Should return true if Profile was deleted successfully and it is removed from DB', async () => {
            const actual = await profileService.delete(profileId1);
            const dbResp = await selectById('Profile', profileId1);

            expect(actual).toBe(true);
            expect(dbResp).toBeNull();
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
            const dbResp = await selectById('Profile', profileId1);

            expect(dbResp).toEqual({...profile, id: profileId1});
        });
    });
});