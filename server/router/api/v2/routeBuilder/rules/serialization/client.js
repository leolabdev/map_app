export const ClientCreateReq = {
    username: true,
    name: true,
    type: true,
    city: true,
    street: true,
    building: true,
    flat: true
}
export const ClientCreateRes = {
    id: true,
    username: true,
    name: true,
    type: true,
    city: true,
    street: true,
    building: true,
    flat: true,
    lat: true, 
    lon: true
}

export const ClientReadRes = {
    id: true,
    username: true,
    name: true,
    type: true,
    city: true,
    street: true,
    building: true,
    flat: true,
    lat: true, 
    lon: true
}

export const ClientUpdateReq = {
    id: true,
    username: true,
    name: true,
    type: true,
    city: true,
    street: true,
    building: true,
    flat: true
}