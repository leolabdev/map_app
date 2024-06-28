export const OrderCreateReq = {
    senderId: true,
    recipientId: true
}
export const OrderCreateRes = {
    id: true,
    senderId: true,
    recipientId: true,
    createdAt: true
}

export const OrderReadRes = {
    id: true,
    senderId: true,
    recipientId: true,
    createdAt: true
}

export const OrderUpdateReq = {
    id: true,
    senderId: true,
    recipientId: true
}