import { ServiceError } from "../../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError";
import ClientService from "../../service/ClientService";
import ClientGenerator from "../test_utils/data/ClientGenerator";
import ProfileGenerator from "../test_utils/data/ProfileGenerator";
import { notFoundError, notNumberError, notStringError, notUniqueError, requiredError, serviceError } from "../test_utils/data/serviceErrors";
import { emptyTable, insertInto, selectById, selectOne } from "../test_utils/db";

describe('ClientService test suite', () => {
    /**
     * @type {ClientService}
     */
    let clientService;
    
    const profileGen = new ProfileGenerator();
    const clientGen = new ClientGenerator();

    const profile = profileGen.create();
    /**
     * @type {number}
     */
    let profileId;
    let clientWithProfile;

    beforeEach(async () => {
        clientService = new ClientService();
        profileId = await insertInto('Profile', profile);
        const client = clientGen.create();
        clientWithProfile = {...client, profileId};
    });

    describe('create()', () => {
        it('Should add new Client to DB if input is valid and return it', async () => {
            const client = clientGen.create();
            const input = {...client, profileId};
            const actual = await clientService.create(input);
            const dbResp = await selectOne('Client', `username="${input.username}"`);

            expect(actual).toEqual(expect.objectContaining({...input, id: expect.any(Number)}));
            expect(dbResp).toEqual(expect.objectContaining({...input, id: expect.any(Number)}));
        });


        /**
         * @type{ {input: {}, output: ServiceError[], message: string}[] }
         */
        const requiredErrors = [
            {input: null, output: expect.objectContaining(requiredError), message: 'provided Client is null' },
            {input: {...clientWithProfile, username: undefined}, output: expect.arrayContaining([expect.objectContaining(requiredError)]), message: 'provided Client has no username' },
            {input: {...clientWithProfile, type: undefined}, output: expect.arrayContaining([expect.objectContaining(requiredError)]), message: 'provided Client has no type' },
            {input: {...clientWithProfile, city: undefined}, output: expect.arrayContaining([expect.objectContaining(requiredError)]), message: 'provided Client has no city' },
            {input: {...clientWithProfile, street: undefined}, output: expect.arrayContaining([expect.objectContaining(requiredError)]), message: 'provided Client has no street' },
            {input: {...clientWithProfile, building: undefined}, output: expect.arrayContaining([expect.objectContaining(requiredError)]), message: 'provided Client has no building' },
            {input: {...clientWithProfile, profileId: undefined}, output: expect.arrayContaining([expect.objectContaining(requiredError)]), message: 'provided Client has no profileId' },
            {input: {...clientWithProfile, lon: undefined}, output: expect.arrayContaining([expect.objectContaining(requiredError)]), message: 'provided Client has no lon' },
            {input: {...clientWithProfile, lat: undefined}, output: expect.arrayContaining([expect.objectContaining(requiredError)]), message: 'provided Client has no lat' }
        ];
        it.each(requiredErrors)(`Should return ServiceError(s) with reason REQUIRED if $message`, async ({input, output}) => {
            const actual = await clientService.create(input);
            expect(actual).toEqual(output);
        });

        /**
         * @type{ {input: {}, output: ServiceError[], message: string}[] }
         */
        const notStringErrors = [
            {input: {...clientWithProfile, username: 45}, output: expect.arrayContaining([expect.objectContaining(notStringError)]), message: 'provided Client username in not a string' },
            {input: {...clientWithProfile, type: true}, output: expect.arrayContaining([expect.objectContaining(notStringError)]), message: 'provided Client type in not a string' },
            {input: {...clientWithProfile, city: 45}, output: expect.arrayContaining([expect.objectContaining(notStringError)]), message: 'provided Client city in not a string' },
            {input: {...clientWithProfile, street: false}, output: expect.arrayContaining([expect.objectContaining(notStringError)]), message: 'provided Client street in not a string' },
            {input: {...clientWithProfile, building: 45}, output: expect.arrayContaining([expect.objectContaining(notStringError)]), message: 'provided Client building in not a string' },
        ];
        it.each(notStringErrors)(`Should return ServiceError(s) with reason NOT_STRING if $message`, async ({input, output}) => {
            const actual = await clientService.create(input);
            expect(actual).toEqual(output);
        });

        /**
         * @type{ {input: {}, output: ServiceError[], message: string}[] }
         */
        const notNumberErrors = [
            {input: {...clientWithProfile, flat: 'str'}, output: expect.arrayContaining([expect.objectContaining(notNumberError)]), message: 'provided Client flat in not a number' },
            {input: {...clientWithProfile, profileId: true}, output: expect.arrayContaining([expect.objectContaining(notNumberError)]), message: 'provided Client profileId in not a number' },
            {input: {...clientWithProfile, lon: 'str'}, output: expect.arrayContaining([expect.objectContaining(notNumberError)]), message: 'provided Client lon in not a number' },
            {input: {...clientWithProfile, lat: false}, output: expect.arrayContaining([expect.objectContaining(notNumberError)]), message: 'provided Client lat in not a number' },
        ];
        it.each(notNumberErrors)(`Should return ServiceError(s) with reason NOT_NUMBER if $message`, async ({input, output}) => {
            const actual = await clientService.create(input);
            expect(actual).toEqual(output);
        });

        it('Should return array of two ServiceErrors if username is not provided and city is not a string', async () => {
            const input = { ...clientWithProfile, username: undefined, city: 345 };

            const actual = await clientService.create(input);

            expect(actual).toHaveLength(2);
            expect(actual).toEqual(expect.arrayContaining([expect.objectContaining(serviceError)]));
        });

        it('Should return ServiceError with reason NOT_UNIQUE if Client with username already exists', async () => {
            await insertInto('Client', clientWithProfile);

            const actual = await clientService.create(clientWithProfile);

            expect(actual).toEqual(expect.objectContaining(notUniqueError));
        });
    });

    describe('readOneByIdAndProfileId()', () => {
        let clientId1;
        beforeEach(async () => {
            clientId1 = await insertInto('Client', clientWithProfile);
        });

        it('Should return Client object if Client with requested id and profileId exists', async () => {
            const actual = await clientService.readOneByIdAndProfileId(clientId1, profileId);
            expect(actual).toEqual({...clientWithProfile, id: clientId1});
        });

        it('Should return null if Client with provided id and profileId does not exists', async () => {
            const actual = await clientService.readOneByIdAndProfileId(12345, 12345);
            expect(actual).toBeNull();
        });
    });

    describe('readAllByProfileId()', () => {
        let clientId1, clientId2, clientId3;
        let clientWithProfile2, clientWithProfile3;
        beforeEach(async () => {
            clientWithProfile2 = clientGen.create({username: 'user2'}, {profileId});
            clientWithProfile3 = clientGen.create({username: 'user3'}, {profileId});
            clientId1 = await insertInto('Client', clientWithProfile);
            clientId2 = await insertInto('Client', clientWithProfile2);
            clientId3 = await insertInto('Client', clientWithProfile3);
        });

        it('Should return an array of all existing Client objects if the pagination param is not provided', async () => {
            const expected = [
                {...clientWithProfile, id: clientId1},
                {...clientWithProfile2, id: clientId2},
                {...clientWithProfile3, id: clientId3}
            ];
            const actual = await clientService.readAllByProfileId(profileId);
            expect(actual).toEqual(expect.arrayContaining(expected));
        });

        it('Should return array of 2 Client objects, if there are more than 2 Client exists and { limit: 2 } is provided as pagination', async () => {
            const actual = await clientService.readAllByProfileId(profileId, { limit: 2 });
            expect(actual).toHaveLength(2);
            expect(actual).not.toBeInstanceOf(ServiceError);
        });

        it('Should return second page with one Client if there is 3 Clients in DB and pagination is set to { limit: 2, offset: 2 }', async () => {
            const actual = await clientService.readAllByProfileId(profileId, { limit: 2, offset: 2 });
            expect(actual).toHaveLength(1);
            expect(actual).not.toBeInstanceOf(ServiceError);
        });

        it('Should return empty array if no Clients exist', async () => {
            await emptyTable('Client')
            const actual = await clientService.readAllByProfileId(profileId);
            expect(actual).toHaveLength(0);
        });
    });

    describe('update()', () => {
        let clientId1;
        let clientToUpdate;
        beforeEach(async () => {
            clientId1 = await insertInto('Client', clientWithProfile);
            const client = clientGen.create();
            clientToUpdate = {...client, id: clientId1};
        });

        /**
         * @type{ {input: {}, output: ServiceError[], message: string}[] }
         */
        const requiredErrors = [
            {input: null, output: expect.objectContaining(requiredError), message: 'provided Client is null' },
            {input: {...clientToUpdate, id: undefined}, output: expect.arrayContaining([expect.objectContaining(requiredError)]), message: 'provided Client has no id' },
        ];
        it.each(requiredErrors)(`Should return ServiceError(s) with reason REQUIRED if $message`, async ({input, output}) => {
            const actual = await clientService.update(input);
            expect(actual).toEqual(output);
        });

        /**
         * @type{ {input: {}, output: ServiceError[], message: string}[] }
         */
        const notStringErrors = [
            {input: {...clientToUpdate, username: 45}, output: expect.arrayContaining([expect.objectContaining(notStringError)]), message: 'provided Client username in not a string' },
            {input: {...clientToUpdate, type: true}, output: expect.arrayContaining([expect.objectContaining(notStringError)]), message: 'provided Client type in not a string' },
            {input: {...clientToUpdate, city: 45}, output: expect.arrayContaining([expect.objectContaining(notStringError)]), message: 'provided Client city in not a string' },
            {input: {...clientToUpdate, street: false}, output: expect.arrayContaining([expect.objectContaining(notStringError)]), message: 'provided Client street in not a string' },
            {input: {...clientToUpdate, building: 45}, output: expect.arrayContaining([expect.objectContaining(notStringError)]), message: 'provided Client building in not a string' },
        ];
        it.each(notStringErrors)(`Should return ServiceError(s) with reason NOT_STRING if $message`, async ({input, output}) => {
            const actual = await clientService.update(input);
            expect(actual).toEqual(output);
        });

        /**
         * @type{ {input: {}, output: ServiceError[], message: string}[] }
         */
        const notNumberErrors = [
            {input: {...clientToUpdate, id: 'str'}, output: expect.arrayContaining([expect.objectContaining(notNumberError)]), message: 'provided Client id in not a number' },
            {input: {...clientToUpdate, flat: 'str'}, output: expect.arrayContaining([expect.objectContaining(notNumberError)]), message: 'provided Client flat in not a number' },
            {input: {...clientToUpdate, lon: 'str'}, output: expect.arrayContaining([expect.objectContaining(notNumberError)]), message: 'provided Client lon in not a number' },
            {input: {...clientToUpdate, lat: false}, output: expect.arrayContaining([expect.objectContaining(notNumberError)]), message: 'provided Client lat in not a number' },
        ];
        it.each(notNumberErrors)(`Should return ServiceError(s) with reason NOT_NUMBER if $message`, async ({input, output}) => {
            const actual = await clientService.update(input);
            expect(actual).toEqual(output);
        });

        it('Should return ServiceError with reason NOT_UNIQUE if Client with username already exists', async () => {
            const client2 = clientGen.create({username: 'client2'});
            await insertInto('Client', {...client2, profileId});

            const actual = await clientService.update({...clientToUpdate, username: client2.username});

            expect(actual).toEqual(expect.objectContaining(notUniqueError));
        });

        it('Should return ServiceError with reason NOT_FOUND if Client with provided id does not exist', async () => {
            const client = clientGen.create({ username: 'client2' });
            const actual = await clientService.update({...client, id: 12345});
            expect(actual).toEqual(expect.objectContaining(notFoundError));
        });

        it('Should return false if nothing was updated', async () => {
            const isSuccess = await clientService.update(clientToUpdate);
            expect(isSuccess).toBe(false);
        });

        it('Should return true if Client was updated successfully', async () => {
            const isSuccess = await clientService.update({...clientToUpdate, city: 'Lahti'});
            expect(isSuccess).toBe(true);
        });
    });

    describe('delete()', () => {
        let clientId;
        beforeEach(async () => {
            clientId = await insertInto('Client', clientWithProfile);
        });

        it('Should return true if Client was deleted successfully and it is removed from DB', async () => {
            const actual = await clientService.delete(clientId);
            const dbResp = await selectById('Client', clientId);

            expect(actual).toBe(true);
            expect(dbResp).toBeNull();
        });

        it('Should return ServiceError with reason REQUIRED if no id provided', async () => {
            const actual = await clientService.delete();
            expect(actual).toEqual(expect.objectContaining(requiredError));
        });

        it('Should return ServiceError with reason NOT_NUMBER if id field is not a number', async () => {
            const actual = await clientService.delete('not_num');
            expect(actual).toEqual(expect.arrayContaining([expect.objectContaining(notNumberError)]));
        });

        it('Should return ServiceError with reason NOT_FOUND if Profile with provided id does not exists', async () => {
            const actual = await clientService.delete(12345);
            expect(actual).toEqual(expect.objectContaining(notFoundError));
        });

        it('Should removes all associated Orders from the DB', async () => {
            const client2 = clientGen.create({username: 'client2'});
            const clientId2 = await insertInto('Client', {...client2, profileId});
            const orderId = await insertInto('OrderData', { senderId: clientId, recipientId: clientId2, profileId });
            await clientService.delete(clientId);

            const dbResp = await selectById('OrderData', orderId);

            expect(dbResp).toBeNull();
        });
    });
});