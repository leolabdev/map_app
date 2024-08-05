import { ServiceError } from "../../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError";
import OrderDataService from "../../service/OrderDataService";
import { clientRecipient1, clientRecipient2, clientSender1, clientSender2 } from "../test_utils/data/client";
import { profile1 } from "../test_utils/data/profiles";
import { notFoundError, notNumberError, notStringError, notUniqueError, requiredError, serviceError } from "../test_utils/data/serviceErrors";
import { emptyTable, insertInto, selectById, selectFrom, selectOne } from "../test_utils/db";

describe('OrderDataService test suite', () => {
    /**
     * @type {OrderDataService}
     */
    let orderService;
    
    /**
     * @type {number}
     */
    let profileId;
    /**
     * @type {number}
     */
    let recipientId;
    /**
     * @type {number}
     */
    let senderId;
    /**
     * @type {{ senderId: number,  recipientId: number,  profileId: number }}
     */
    let order;

    beforeEach(async () => {
        orderService = new OrderDataService();

        profileId = await insertInto('Profile', profile1);
        recipientId = await insertInto('Client', {...clientRecipient1, profileId});
        senderId = await insertInto('Client', {...clientSender1, profileId});

        order = {profileId, recipientId, senderId};
    });

    describe('create()', () => {
        it('Should add new Order to DB if input is valid and return it', async () => {
            const actual = await orderService.create(order);
            const dbResp = await selectOne('OrderData', `profileId=${order.profileId} AND recipientId=${order.recipientId}`);

            expect(actual).toEqual(expect.objectContaining({...order, id: expect.any(Number)}));
            expect(dbResp).toEqual(expect.objectContaining({...order}));
        });

        /**
         * @type{ {input: {}, output: ServiceError[], message: string}[] }
         */
        const requiredErrors = [
            {input: null, output: expect.objectContaining(requiredError), message: 'provided Order is null' },
            {input: {...order, profileId: undefined}, output: expect.arrayContaining([expect.objectContaining(requiredError)]), message: 'provided Order has no profileId' },
            {input: {...order, recipientId: undefined}, output: expect.arrayContaining([expect.objectContaining(requiredError)]), message: 'provided Order has no recipientId' },
            {input: {...order, senderId: undefined}, output: expect.arrayContaining([expect.objectContaining(requiredError)]), message: 'provided Order has no senderId' },
        ];
        it.each(requiredErrors)(`Should return ServiceError(s) with reason REQUIRED if $message`, async ({input, output}) => {
            const actual = await orderService.create(input);
            expect(actual).toEqual(output);
        });

        /**
         * @type{ {input: {}, output: ServiceError[], message: string}[] }
         */
        const notNumbersErrors = [
            {input: {...order, profileId: 'not_num'}, output: expect.arrayContaining([expect.objectContaining(notNumberError)]), message: 'provided Order profileId in not a number' },
            {input: {...order, recipientId: true}, output: expect.arrayContaining([expect.objectContaining(notNumberError)]), message: 'provided Order recipientId in not a number' },
            {input: {...order, senderId: 'test'}, output: expect.arrayContaining([expect.objectContaining(notNumberError)]), message: 'provided Order senderId in not a number' }
        ];
        it.each(notNumbersErrors)(`Should return ServiceError(s) with reason NOT_NUMBER if $message`, async ({input, output}) => {
            const actual = await orderService.create(input);
            expect(actual).toEqual(output);
        });

        it('Should return array of two ServiceErrors if senderId is not provided and profileId is not a number', async () => {
            const input = { ...order, senderId: undefined, profileId: 'not:num' };

            const actual = await orderService.create(input);

            expect(actual).toHaveLength(2);
            expect(actual).toEqual(expect.arrayContaining([expect.objectContaining(serviceError)]));
        });
    });

    describe('readOneByIdAndProfileId()', () => {
        let orderId;
        beforeEach(async () => {
            orderId = await insertInto('OrderData', order);
        });

        it('Should return Order object if Order with requested id and profileId exists', async () => {
            const actual = await orderService.readOneByIdAndProfileId(orderId, profileId);
            expect(actual).toEqual(expect.objectContaining({...order, id: orderId, Sender: expect.any(Object), Recipient: expect.any(Object)}));
        });

        it('Should return null if Order with provided id and profileId does not exists', async () => {
            const actual = await orderService.readOneByIdAndProfileId(12345, 12345);
            expect(actual).toBeNull();
        });
    });

    describe('readAllByProfileId()', () => {
        let orderId1, orderId2, orderId3;
        beforeEach(async () => {
            orderId1 = await insertInto('OrderData', order);
            orderId2 = await insertInto('OrderData', order);
            orderId3 = await insertInto('OrderData', order);
        });

        it('Should return an array of all existing Order objects if the pagination param is not provided', async () => {
            const expected = [
                {...order, id: orderId1, Sender: expect.any(Object), Recipient: expect.any(Object)},
                {...order, id: orderId2, Sender: expect.any(Object), Recipient: expect.any(Object)},
                {...order, id: orderId3, Sender: expect.any(Object), Recipient: expect.any(Object)}
            ];
            const actual = await orderService.readAllByProfileId(profileId);
            expect(actual).toEqual(expect.arrayContaining(expected));
        });

        it('Should return array of 2 Order objects, if there are more than 2 Order exists and { limit: 2 } is provided as pagination', async () => {
            const actual = await orderService.readAllByProfileId(profileId, { limit: 2 });
            expect(actual).toHaveLength(2);
            expect(actual).not.toBeInstanceOf(ServiceError);
        });

        it('Should return second page with one Order if there is 3 Orders in DB and pagination is set to { limit: 2, offset: 2 }', async () => {
            const actual = await orderService.readAllByProfileId(profileId, { limit: 2, offset: 2 });
            expect(actual).toHaveLength(1);
            expect(actual).not.toBeInstanceOf(ServiceError);
        });

        it('Should return empty array if no Order exist', async () => {
            await emptyTable('OrderData')
            const actual = await orderService.readAllByProfileId(profileId);
            expect(actual).toHaveLength(0);
        });
    });

    describe('update()', () => {
        let orderId;
        let orderWithId;
        beforeEach(async () => {
            orderId = await insertInto('OrderData', order);
            orderWithId = {...order, id: orderId};
        });

         /**
         * @type{ {input: {}, output: ServiceError[], message: string}[] }
         */
         const requiredErrors = [
            {input: null, output: expect.objectContaining(requiredError), message: 'provided Order is null' },
            {input: {...order, id: undefined}, output: expect.arrayContaining([expect.objectContaining(requiredError)]), message: 'provided Order has no id' }
        ];
        it.each(requiredErrors)(`Should return ServiceError(s) with reason REQUIRED if $message`, async ({input, output}) => {
            const actual = await orderService.update(input);
            expect(actual).toEqual(output);
        });

        /**
         * @type{ {input: {}, output: ServiceError[], message: string}[] }
         */
        const notNumbersErrors = [
            {input: {...order, profileId: 'not_num'}, output: expect.arrayContaining([expect.objectContaining(notNumberError)]), message: 'provided Order profileId in not a number' },
            {input: {...order, recipientId: true}, output: expect.arrayContaining([expect.objectContaining(notNumberError)]), message: 'provided Order recipientId in not a number' },
            {input: {...order, senderId: 'test'}, output: expect.arrayContaining([expect.objectContaining(notNumberError)]), message: 'provided Order senderId in not a number' }
        ];
        it.each(notNumbersErrors)(`Should return ServiceError(s) with reason NOT_NUMBER if $message`, async ({input, output}) => {
            const actual = await orderService.update(input);
            expect(actual).toEqual(output);
        });


        it('Should return ServiceError with reason NOT_FOUND if Client with provided id does not exist', async () => {
            const actual = await orderService.update({...order, id: 12345});
            expect(actual).toEqual(expect.objectContaining(notFoundError));
        });

        it('Should return false if nothing was updated', async () => {
            const isSuccess = await orderService.update(orderWithId);
            expect(isSuccess).toBe(false);
        });

        it('Should return true if Order was updated successfully', async () => {
            const newSenderId = await insertInto('Client', {...clientSender2, profileId});
            const isSuccess = await orderService.update({...orderWithId, senderId: newSenderId});
            expect(isSuccess).toBe(true);
        });
    });

    describe('delete()', () => {
        let clientId;
        beforeEach(async () => {
            clientId = await insertInto('Client', clientWithProfile1);
        });

        it('Should return true if Client was deleted successfully and it is removed from DB', async () => {
            const actual = await orderService.delete(clientId);
            const dbResp = await selectById('Client', clientId);

            expect(actual).toBe(true);
            expect(dbResp).toBeNull();
        });

        it('Should return ServiceError with reason REQUIRED if no id provided', async () => {
            const actual = await orderService.delete();
            expect(actual).toEqual(expect.objectContaining(requiredError));
        });

        it('Should return ServiceError with reason NOT_NUMBER if id field is not a number', async () => {
            const actual = await orderService.delete('not_num');
            expect(actual).toEqual(expect.arrayContaining([expect.objectContaining(notNumberError)]));
        });

        it('Should return ServiceError with reason NOT_FOUND if Profile with provided id does not exists', async () => {
            const actual = await orderService.delete(12345);
            expect(actual).toEqual(expect.objectContaining(notFoundError));
        });

        it('Should removes all associated Orders from the DB', async () => {
            const clientId2 = await insertInto('Client', {...clientRecipient2, profileId});
            const orderId = await insertInto('OrderData', { senderId: clientId, recipientId: clientId2, profileId });
            await orderService.delete(clientId);

            const dbResp = await selectById('OrderData', orderId);

            expect(dbResp).toBeNull();
        });
    });
});


/*
describe('ClientService test suite', () => {
    describe('', () => {
        it('Should', async () => {

        });
    });
});
*/