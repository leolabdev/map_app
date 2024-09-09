import createFactoryObject from "./createFactoryObject"

/**
 * Class for creating a Client objects
 */
export default class ClientFactory{
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
     * }= }
     */
    create(uniqueFields, object){
        return createFactoryObject(this.#base, uniqueFields, object);
    }
}