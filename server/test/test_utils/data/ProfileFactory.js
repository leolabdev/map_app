import createFactoryObject from "./createFactoryObject"

/**
 * Class for creating a Profile objects
 */
export default class ProfileFactory{
    #base = {
        username: 'username',
        password: 'password'
    }

    /**
     * Creates a new Profile object
     * @param {{username: string}} uniqueFields fields that must be unique
     * @param {{password: string}=} object other fields that need to to be overridden
     * @returns { {username: string, password: string} }
     */
    create(uniqueFields, object){
        return createFactoryObject(this.#base, uniqueFields, object);
    }
}