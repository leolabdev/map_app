import { User } from "../../../../../../../router/api/v2/routeBuilder/core/authentication/User";

describe('User class test suite', () => {
    describe('constructor', () => {
        it('Should create an User instance with a public id field specified in the constructor', () => {
            const idToSet = 1;

            const createdUser = new User(idToSet);

            expect(createdUser).toBeInstanceOf(User);
            expect(createdUser.id).toBe(idToSet);
        });
    });
});