import {deleteHumanByTypeAndUsername} from "./humans/DeleteHumanByTypeAndUsername";
import {getHumansDataByType} from "./humans/GetHumansDataByType";
import {postNewHuman} from "./humans/PostNewHuman";
import {deleteOrderByOrderId} from "./orders/DeleteOrderByOrderId";
import {getOrderByOrderId} from "./orders/GetOrderByOrderId";
import {getOrdersData} from "./orders/GetOrdersData";
import {postNewOrder} from "./orders/PostNewOrder";

export const Api = Object.freeze({
    humans : {
        deleteByTypeAndUsername: deleteHumanByTypeAndUsername,
        getDataByType: getHumansDataByType,
        postNew: postNewHuman,
    },
    orders: {
        deleteById : deleteOrderByOrderId,
        getById: getOrderByOrderId,
        getData: getOrdersData,
        postNew: postNewOrder,
    }
});