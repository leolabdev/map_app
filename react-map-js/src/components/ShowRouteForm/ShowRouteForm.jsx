import React from 'react'
// import MyButton from '../UI/button/MyButton'
import MyButton from '../UI/Button/MyButton'


import classes from './ShowRouteForm.module.css'

const ShowRouteForm = ({ordersIdForRoutes,addRoute,addOrderMarker}) => {

    console.log("gg",addRoute)

    function showRoute() {

        

        console.log("orders id in  map request", ordersIdForRoutes)

        let sendOrdersIdForRoutesData={
            orderIds: [
                ...ordersIdForRoutes
            ],
            fuelusage: 5.7
        }

        console.log(sendOrdersIdForRoutesData)
        if (sendOrdersIdForRoutesData.orderIds.length !== 0) {
            fetch('http://localhost:8081/api/v1/routing/orders', {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sendOrdersIdForRoutesData),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    
                    addRoute(data);
                    // removeStartMarker();
                    // removeEndMarker();
                    // coordinatesData.coordinates.map((c)=>addOrderMarker(c[1],c[0]))
                    console.log(data.features[0].properties.summary.orders[2])
                    data.features[0].properties.summary.orders[2].forEach(
                        (o)=>{
                            addOrderMarker(o.deliveryAddress.lat,o.deliveryAddress.lon)
                            addOrderMarker(o.shipmentAddress.lat,o.shipmentAddress.lon)
                            console.log(o.orderId)
                        }
                    )
                    // data.coordinates.map((c)=>addOrderMarker(c[1],c[0]))
    
                    // addStartMarker(coordinatesData.coordinates[0][1], coordinatesData.coordinates[0][0]);
                    // addEndMarker(coordinatesData.coordinates[1][1], coordinatesData.coordinates[1][0]);
                })  
                .catch((error) => {
                    console.error('Error:', error);
                });
    
            return (
                null
            )
        }
        else{
            alert("plz select a order/orders")
            return (null)
        }
    }

        
    function ShowrouteButton() {
        return (
            <div className={classes.showRouteButton}>
            <MyButton
            onClick={showRoute}
            >
            Show Route
            </MyButton>
            {/* <button onClick={showRoute} >Show Route</button> */}
            </div>
        )
    } 







  return (
    <div>
        
        <ShowrouteButton/>

    </div>
  )
}

export default ShowRouteForm