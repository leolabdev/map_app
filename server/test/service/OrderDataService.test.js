import { ServiceError } from "../../router/api/v2/routeBuilder/core/service/dataExtractors/error/ServiceError";
import OrderDataService from "../../service/OrderDataService";
import { notArrayError, notFoundError, notNumberError, requiredError, serviceError } from "../test_utils/data/serviceErrors";
import { emptyTable, insertInto, selectById, selectFrom, selectOne } from "../test_utils/db";
import ProfileGenerator from "../test_utils/data/ProfileGenerator";
import ClientGenerator from "../test_utils/data/ClientGenerator";

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

    const profileGen = new ProfileGenerator();
    const clientGen = new ClientGenerator();

    beforeEach(async () => {
        orderService = new OrderDataService();

        const profile = profileGen.create();
        profileId = await insertInto('Profile', profile);

        const sender = clientGen.create({username: 'sender1'}, { type: 'Sender' });
        recipientId = await insertInto('Client', {...sender, profileId});

        const recipient = clientGen.create({username: 'recipient1'}, { type: 'Recipient' });
        senderId = await insertInto('Client', {...recipient, profileId});

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

    describe('readOneById()', () => {
        let orderId;
        beforeEach(async () => {
            orderId = await insertInto('OrderData', order);
        });

        it('Should return Order object if Order with requested id exists', async () => {
            const actual = await orderService.readOneById(orderId);
            expect(actual).toEqual(expect.objectContaining({...order, id: orderId}));
        });

        it('Should return ServiceError with reason REQUIRED if id is not specified', async () => {
            const actual = await orderService.readOneById();
            expect(actual).toEqual(expect.objectContaining(requiredError));
        });

        it('Should return ServiceError with reason NOT_NUMBER if id is not number', async () => {
            const actual = await orderService.readOneById('not_num');
            expect(actual).toEqual(expect.arrayContaining([expect.objectContaining(notNumberError)]));
        });

        it('Should return null if Order with provided id does not exists', async () => {
            const actual = await orderService.readOneById(12345);
            expect(actual).toBeNull();
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

    describe('readAllByIds()', () => {
        let orderId1, orderId2;
        beforeEach(async () => {
            orderId1 = await insertInto('OrderData', order);
            const sender2 = clientGen.create({username: 'sender2'}, { type: 'Sender' });
            const senderId2 = await insertInto('Client', {...sender2, profileId});

            const recipient2 = clientGen.create({username: 'recipient2'}, { type: 'Recipient' });
            const recipientId2 = await insertInto('Client', {...recipient2, profileId});
            orderId2 = await insertInto('OrderData', {profileId, senderId: senderId2, recipientId: recipientId2});
        });

        it('Finds all existing Orders and returns Order objects array with Sender and Recipient fields', async () => {
            const actual = await orderService.readAllByIds([orderId1, orderId2]);
            expect(actual).toHaveLength(2);
            expect(actual).toEqual(expect.arrayContaining([expect.objectContaining({Sender: expect.any(Object), Recipient: expect.any(Object)})]));
        });

        it('Should return empty array if no Orders exist', async () => {
            await emptyTable('OrderData')
            const actual = await orderService.readAllByIds([orderId1, orderId2]);
            expect(actual).toEqual([]);
        });
    });

    describe('readOrderIdsByProfileIdAndIds()', () => {
        let orderId1, orderId2;
        beforeEach(async () => {
            orderId1 = await insertInto('OrderData', order);

            const sender2 = clientGen.create({username: 'sender2'}, { type: 'Sender' });
            const senderId2 = await insertInto('Client', {...sender2, profileId});

            const recipient2 = clientGen.create({username: 'recipient2'}, { type: 'Recipient' });
            const recipientId2 = await insertInto('Client', {...recipient2, profileId});
            orderId2 = await insertInto('OrderData', {profileId, senderId: senderId2, recipientId: recipientId2});
        });

        it('Finds all existing Orders ids for specified profile and returns them', async () => {
            const actual = await orderService.readOrderIdsByProfileIdAndIds(profileId, [orderId1, orderId2]);
            expect(actual).toHaveLength(2);
            expect(actual).toEqual(expect.arrayContaining([expect.any(Number)]));
        });

        it('Should return ServiceError with NOT_FOUND reason if no Orders exist for the provided profile id', async () => {
            const actual = await orderService.readOrderIdsByProfileIdAndIds(12345, [orderId1, orderId2]);
            expect(actual).toEqual(expect.objectContaining(notFoundError));
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
            const newSender = clientGen.create({username: 'sender2'});
            const newSenderId = await insertInto('Client', {...newSender, profileId});
            const isSuccess = await orderService.update({...orderWithId, senderId: newSenderId});
            expect(isSuccess).toBe(true);
        });
    });

    describe('delete()', () => {
        let orderId;
        beforeEach(async () => {
            orderId = await insertInto('OrderData', order);
        });

        it('Should return true if Order was deleted successfully and it is removed from DB', async () => {
            const actual = await orderService.delete(orderId);
            const dbResp = await selectById('OrderData', orderId);

            expect(actual).toBe(true);
            expect(dbResp).toBeNull();
        });

        it('Should return ServiceError with reason REQUIRED if no id provided', async () => {
            const actual = await orderService.delete();
            expect(actual).toEqual(expect.objectContaining(requiredError));
        });

        it('Should return ServiceError with reason NOT_FOUND if Order with provided id does not exists', async () => {
            const actual = await orderService.delete(12345);
            expect(actual).toEqual(expect.objectContaining(notFoundError));
        });
    });

    describe('deleteByCondition()', () => {
        let orderId;
        beforeEach(async () => {
            orderId = await insertInto('OrderData', order);
        });

        it('Should return true if Order was deleted successfully and it is removed from DB', async () => {
            const actual = await orderService.deleteByCondition({where: { senderId: order.senderId }});
            const dbResp = await selectById('OrderData', orderId);

            expect(actual).toBe(true);
            expect(dbResp).toBeNull();
        });

        it('Should return ServiceError with reason REQUIRED if no id provided', async () => {
            const actual = await orderService.delete();
            expect(actual).toEqual(expect.objectContaining(requiredError));
        });

        it('Should return false if Order with provided id does not exists', async () => {
            const actual = await orderService.deleteByCondition({where: {senderId: 12345}});
            expect(actual).toBe(false);
        });
    });

    describe('deleteProfileOrdersByIds()', () => {
        let orderId1, orderId2;
        beforeEach(async () => {
            orderId1 = await insertInto('OrderData', order);

            const sender2 = clientGen.create({username: 'sender2'}, {type: 'Sender'});
            const senderId2 = await insertInto('Client', {...sender2, profileId});
            const recipient2 = clientGen.create({username: 'recipient2'}, {type: 'Recipient'});
            const recipientId2 = await insertInto('Client', {...recipient2, profileId});
            orderId2 = await insertInto('OrderData', {profileId, senderId: senderId2, recipientId: recipientId2});
        });

        it('Should remove all Orders by provided ids and profile id and return true', async () => {
            const actual = await orderService.deleteProfileOrdersByIds([orderId1, orderId2], profileId);
            const dbResp = await selectFrom('OrderData', `profileId="${profileId}"`);

            expect(actual).toBe(true);
            expect(dbResp).toBeNull();
        });

        it('Should return ServiceError with reason REQUIRED if order ids are not specified', async () => {
            const actual = await orderService.deleteProfileOrdersByIds();
            expect(actual).toEqual(expect.objectContaining(requiredError));
        });

        it('Should return ServiceError with reason NOT_ARRAY if order ids are not array', async () => {
            const actual = await orderService.deleteProfileOrdersByIds('not_array');
            expect(actual).toEqual(expect.arrayContaining([expect.objectContaining(notArrayError)]));
        });

        it('Should return false if Orders with provided ids do not exists', async () => {
            const actual = await orderService.deleteProfileOrdersByIds([1235, 1234], profileId);
            expect(actual).toBe(false);
        });

        it('Should not remove Orders with other profile ids', async () => {
            const profile2 = profileGen.create({username: 'user2'});
            const otherProfileId = await insertInto('Profile', profile2);
            const orderWithOtherProfileId = await insertInto('OrderData', {...order, profileId: otherProfileId});

            await orderService.deleteProfileOrdersByIds([orderId1, orderId2], profileId);

            const dbResp = await selectById('OrderData', orderWithOtherProfileId);
            
            expect(dbResp).not.toBeNull();
        });
    });
});