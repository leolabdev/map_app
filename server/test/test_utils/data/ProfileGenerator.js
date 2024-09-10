import generateObject from "./generateObject";

/**
 * Class for creating a Profile objects
 */
export default class ProfileGenerator{
    #base = {
        username: 'username',
        password: 'password'
    }

    /**
     * Creates a new Profile object
     * @param {{username?: string}=} uniqueFields fields that must be unique
     * @param {{password?: string}=} object other fields that need to to be overridden
     * @returns { {username: string, password: string} }
     */
    create(uniqueFields, object){
        return generateObject(this.#base, uniqueFields, object);
    }

    /**
     * Creates a new Profile object, but all fields are optional and of type any.
     *
     * This method can be used for example in cases
     * when there is a need to check validation rules of a method
     *
     * @param {{username?: any}=} uniqueFields fields that must be unique
     * @param {{password?: any}=} object other fields that need to to be overridden
     * @returns { {username?: any, password?: any} }
     */
    createAny(uniqueFields, object){
        return generateObject(this.#base, uniqueFields, object);
    }
}