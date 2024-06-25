export const OrderCreateReq = {
    senderId: true,
    recipientId: true
}
export const OrderCreateRes = {
    senderId: true,
    recipientId: true
}

export const OrderReadRes = {
    senderId: true,
    recipientId: true,
    Sender: true,
    Recipient: true
}

export const OrderUpdateReq = {
    id: true,
    senderId: true,
    recipientId: true
}