import { TextField } from '@mui/material'
import React, { useState, useEffect } from 'react'
// import MyButton from '../UI/button/MyButton'
import MyButton from '../UI/button/MyButton'


import classes from './ShowRouteForm.module.css'

const ShowRouteForm = ({ ordersIdForRoutes, addRoute, addOrderMarker, fuelUsage, setFuelUsage, start, setStart, end, setEnd, setRouteData, routeData }) => {






    function showRoute() {







        console.log("orders id in  map request", ordersIdForRoutes)

        let sendOrdersIdForRoutesData = {
            orderIds: [
                ...ordersIdForRoutes
            ],
            start: [start.lon, start.lat],
            end: [end.lon, end.lat],
            fuelusage: fuelUsage
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
                    setRouteData(data.features[0].properties.summary);
                    console.log(routeData)
                    // removeStartMarker();
                    // removeEndMarker();
                    // coordinatesData.coordinates.map((c)=>addOrderMarker(c[1],c[0]))
                    console.log(data.features[0].properties.summary.orders)
                    data.features[0].properties.summary.orders[2].forEach(
                        (o) => {
                            addOrderMarker(o.deliveryAddress.lat, o.deliveryAddress.lon,
                                `<b style="color:red">Client</b><br />
                                <b>${o.Client.name}</b><br />
                                 AddressId:${o.deliveryAddress.addressId}<br /> 
                                 City:     ${o.deliveryAddress.city}<br /> 
                                 Street: ${o.deliveryAddress.street}<br />
                                 Building: ${o.deliveryAddress.building}<br />
                                 Flat: ${o.deliveryAddress.flat}<br /> 
                                  `,
                                  "Client"
                                  )

                            addOrderMarker(o.shipmentAddress.lat, o.shipmentAddress.lon,
                                `<b style="color:blue">Manufacturer</b><br />
                                <b>${o.Manufacturer.name}</b><br />
                                 AddressId:${o.shipmentAddress.addressId}<br /> 
                                 City:     ${o.shipmentAddress.city}<br /> 
                                 Street: ${o.shipmentAddress.street}<br />
                                 Building: ${o.shipmentAddress.building}<br />
                                 Flat: ${o.shipmentAddress.flat}<br /> 
                                  `,
                                  "Manufacturer"
                                  )
                            console.log(o.orderId)
                        }
                    )
                    addOrderMarker(start.lat, start.lon, `<b style="color:green">Start</b><br />`,"Start");
                    addOrderMarker(end.lat, end.lon,`<b style="color:purple">End</b><br />`,"End");

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
        else {
            alert("plz select a order/orders")
            return (null)
        }
    }


    function ShowrouteButton() {
        return (
            <div >
                <MyButton
                    onClick={showRoute}
                >
                    Finally Show Route
                </MyButton>
                {/* <button onClick={showRoute} >Show Route</button> */}
            </div>
        )
    }







    return (
        <div className={classes.formContainer} >

            <TextField
                onChange={e => setFuelUsage(e.target.value)}
                value={fuelUsage}
                required
                id="outlined-required"
                label={`CarFuel_Usage`}
            />

            <TextField
                onChange={e => setStart({ ...start, lat: e.target.value })}
                value={start.lat}
                required
                id="outlined-required"
                type="number"
                label={`start lat`}
            />

            <TextField
                onChange={e => setStart({ ...start, lon: e.target.value })}
                value={start.lon}
                required
                id="outlined-required"
                type="number"
                label={`start lon`}
            />

            <TextField
                onChange={e => setEnd({ ...end, lat: e.target.value })}
                value={end.lat}
                required
                id="outlined-required"
                type="number"
                label={`end lat`}
            />

            <TextField
                onChange={e => setEnd({ ...end, lon: e.target.value })}
                value={end.lon}
                required
                id="outlined-required"
                type="number"
                label={`end lon`}
            />

            {/* <button>hello</button> */}
            <ShowrouteButton />

        </div>
    )
}

export default ShowRouteForm