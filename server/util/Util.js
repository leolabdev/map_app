class Util {
    getOrdersCities(orders){
        const cities = new Set();
        for(let i=0; i<orders.length; i++){
            const {shipmentAddress, deliveryAddress} = orders[i];
            cities.add(shipmentAddress.city);
            cities.add(deliveryAddress.city);
        }

        return cities;
    }
}
module.exports = Util;