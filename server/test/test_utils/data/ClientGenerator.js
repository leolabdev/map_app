import generateObject from "./generateObject";

/**
 * Class for creating a Client objects
 */
export default class ClientGenerator{
    #base = {
        username: 'username',
        name: 'name',
        type: 'Recipient',
        city: 'Helsinki',
        street: 'Urheilukatu',
        building: '30',
        flat: 1,
        lat: 60.1880378,
        lon: 24.9197543
    }

    /**
     * Creates a new Client object
     * @param {{username: string}} uniqueFields fields that must be unique
     * @param { {
     * name?: string, type?: "Recipient" | "Sender", 
     * city?: string, street?: string, building?: string, 
     * flat?: number, lat?: number, lon?: number
     * }= } object other fields that need to to be overridden
     *
     * @returns { {
     * username: string, name: string, type: "Recipient" | "Sender", 
     * city: string, street: string, building: string, 
     * flat: number, lat: number, lon: number
     * } }
     */
    create(uniqueFields, object){
        return generateObject(this.#base, uniqueFields, object);
    }

    /**
     * Creates a new Client object, but all fields are optional and of type any.
     *
     * This method can be used for example in cases
     * when there is a need to check validation rules of a method
     *
     * @param {{username?: any}} uniqueFields fields that must be unique
     * @param { {
     * name?: any, type?: any, 
     * city?: any, street?: any, building?: any, 
     * flat?: any, lat?: any, lon?: any
     * }= } object other fields that need to to be overridden
     *
     * @returns { {
     * username?: any, name?: any, type?: any, 
     * city?: any, street?: any, building?: any, 
     * flat?: any, lat?: any, lon?: any
     * } }
     */
    createAny(uniqueFields, object){
        return generateObject(this.#base, uniqueFields, object);
    }
}