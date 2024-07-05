export const OrderCreateReq = {
    senderId: true,
    recipientId: true
}

export const OrderUpdateReq = {
    id: true,
    senderId: true,
    recipientId: true
}

export const OrderDoneReq = {
    orderIds: true
}