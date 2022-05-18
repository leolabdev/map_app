import {TextField} from '@mui/material'
import {Checkbox} from '@mui/material/'
import {FormControlLabel} from '@mui/material';
// import InputLabel from '@mui/material/InputLabel';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
import React, {useState, useEffect} from 'react'
// import MyButton from '../UI/button/MyButton'
import MyButton from '../UI/button/MyButton'


import classes from './ShowRouteForm.module.css'
import Autocomplete from "@mui/material/Autocomplete";
import {getHumansData} from "../../api/humans/GetHumansData";
// import { valueToPercent } from '@mui/base';

const ShowRouteForm = ({
                           setAllowPositionMarker,
                           setOurShipmentAddress,
                           setOurShipmentAddresses,
                           setOurDeliveryAddress,
                           setOurDeliveryAddresses,
                           ourShipmentAddress,
                           ourShipmentAddresses,
                           ourDeliveryAddress,
                           ourDeliveryAddresses,
                           setVisible,
                           ordersIdForRoutes,
                           addRoute,
                           addOrderMarker,
                           fuelUsage,
                           setFuelUsage,
                           ourStart,
                           setOurStart,
                           ourEnd,
                           setOurEnd,
                           setRouteData,
                           routeData,
                           ordersAddresses,
                           setOrdersAddresses,
                           ordersAddressesFlag,
                           setOrdersAddressesFlag
                       }) => {


    //Checkbox
    const [checked, setChecked] = useState(false)
    let [clients, setClients] = useState([]);


    const shipmentAddressesInputProps = {
        options: ourShipmentAddresses,
        getOptionLabel: (option) => `${option.city ? option.city : ""}${option.street ? option.street : ""} ${option.building ? option.building : ""}${option.name ? option.name : ""}`,
    }

    const deliveryAddressesInputProps = {
        options: ourDeliveryAddresses,
        getOptionLabel: (option) => `${option.city}, ${option.street} ${option.building}  `,
    }

    function showRoute() {
        setVisible(false);
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        let RouteRequestData = {
            orderIds: [
                ...ordersIdForRoutes
            ],
            fuelusage: fuelUsage,
            isCenterAvoided: checked
        }
        if (Number.isInteger(ourStart)) {
            RouteRequestData.start = ourStart
        } else if (ourStart != null) {
            RouteRequestData.start = [ourStart.lon, ourStart.lat]
        }

        if (Number.isInteger(ourEnd)) {
            RouteRequestData.end = ourEnd
        } else if (ourEnd != null) {
            RouteRequestData.end = [ourEnd.lon, ourEnd.lat]
        }

        if (RouteRequestData.orderIds.length !== 0) {
            fetch('http://localhost:8081/api/v1/routing/orders', {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(RouteRequestData),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);

                    setAllowPositionMarker(false)
                    addRoute(data);
                    setRouteData(data.features[0].properties.summary);
                    const summary = data.features[0].properties.summary
                    const start = data.features[0].properties.summary.start || null;
                    const end = data.features[0].properties.summary.end || null;

                    summary.orders.forEach(
                        (o) => {

                            addOrderMarker(o.deliveryAddress.lat, o.deliveryAddress.lon,
                                `<b style="color:blue">Client</b><br />
                                <b>${o.Client?.name}</b><br />
                                 OrderId:${o?.orderId}<br /> 
                                 City:     ${o.deliveryAddress?.city}<br /> 
                                 Street: ${o.deliveryAddress?.street} ${o.deliveryAddress?.building}<br />
                                 Flat: ${o.deliveryAddress?.flat}<br /> 
                                  `,
                                "Client"
                            )
                            addOrderMarker(o.shipmentAddress.lat, o.shipmentAddress.lon,
                                `<b style="color:orange">Manufacturer</b><br />
                                 <b>${o.Manufacturer?.name}</b><br />
                                 OrderId:${o?.orderId}<br /> 
                                 City:     ${o.shipmentAddress?.city}<br /> 
                                 Street: ${o.shipmentAddress?.street} ${o.shipmentAddress?.building}<br />
                                 Flat: ${o.shipmentAddress?.flat}<br /> 
                                  `,
                                "Manufacturer"
                            )
                        }
                    )
                    //start
                    if (start != null) {
                        if (start.type === "address") {
                            setAllowPositionMarker(false)
                            addOrderMarker(start.coordinates[1], start.coordinates[0],
                                `<b style="color:green">Start(Current Position)</b><br />
                            City:   ${start?.city}<br /> 
                            Street: ${start?.streetAddress}<br />   
                            `, "Start");
                        } else {
                            setAllowPositionMarker(true)
                            // addOrderMarker(start.coordinates[1], start.coordinates[0],
                            addOrderMarker(start.shipmentAddress.lat, start.shipmentAddress.lon,
                                `<b style="color:green">Start(Manufacturer)</b><br />
                            <b>${start?.Manufacturer?.name}</b><br /> 
                            OrderId:${start?.orderId}<br /> 
                            City:   ${start?.shipmentAddress?.city}<br /> 
                            Street: ${start?.shipmentAddress?.street} ${start?.shipmentAddress?.building}<br /> 
                            Flat: ${start?.shipmentAddress?.flat}<br />     
                            `, "Start");
                        }
                    }
                    //end
                    if (end != null) {
                        // addOrderMarker(end.coordinates[1], end.coordinates[0],
                        addOrderMarker(end.deliveryAddress.lat, end.deliveryAddress.lon,
                            `<b style="color:red">End(Client)</b><br />
                            <b>${end?.Client?.name}</b><br />
                            OrderId:${end?.orderId}<br />  
                            City:   ${end?.deliveryAddress?.city}<br /> 
                            Street: ${end?.deliveryAddress?.street} ${end?.deliveryAddress?.building}<br />  
                            Flat: ${end?.deliveryAddress?.flat}<br /> 
                            `, "End");
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

            return (
                null
            )
        } else {
            window.scrollTo({
                top: 1000,
                behavior: "smooth"
            });
            alert("plz select a order/orders")
            return (null)
        }
    }


    function ShowrouteButton() {
        return (
            <div>
                <MyButton
                    onClick={showRoute}
                >
                    Finally Show Route
                </MyButton>
            </div>
        )
    }

    return (
        <div className={classes.formContainer}>

            <TextField
                onChange={e => setFuelUsage(e.target.value)}
                value={fuelUsage}
                required
                id="outlined-required"
                label={`CarFuel_Usage`}
            />

            <FormControlLabel
                control={
                    <Checkbox checked={checked} onChange={(event) => {
                        setChecked(event.target.checked)
                    }} name="isCenterAvoided"/>
                }
                label="Avoid Center?"
                labelPlacement="end"
            />


            <Autocomplete
                {...shipmentAddressesInputProps}
                id="shipmentAddresses-autocomplete"
                value={ourShipmentAddress}
                onChange={(event, newShipmentAddress) => {
                    setOurShipmentAddress(newShipmentAddress);
                    if (newShipmentAddress != null) {
                        if ('orderId' in newShipmentAddress) {
                            setOurStart(newShipmentAddress.orderId)
                        } else if (newShipmentAddress.type === 'position') {
                            setOurStart({lat: newShipmentAddress.lat, lon: newShipmentAddress.lon})
                        } else {
                            setOurStart(null)
                        }
                    }
                }}
                renderInput={(params) => (
                    <TextField {...params} label="Choose Start" variant="standard"/>
                )}
            />
            <Autocomplete
                {...deliveryAddressesInputProps}
                id="deliveryAddresses-autocomplete"
                value={ourDeliveryAddress}
                onChange={(event, newDeliveryAddress) => {
                    setOurDeliveryAddress(newDeliveryAddress);
                    if (newDeliveryAddress != null) {
                        if ('orderId' in newDeliveryAddress) {
                            setOurEnd(newDeliveryAddress.orderId)
                        } else if (newDeliveryAddress != null) {
                            setOurEnd({lat: newDeliveryAddress.lat, lon: newDeliveryAddress.lon})
                        } else {
                            setOurEnd(null)
                        }
                    }


                }}
                renderInput={(params) => (
                    <TextField {...params} label="Choose End" variant="standard"/>
                )}
            />
            <ShowrouteButton/>
        </div>
    )
}

export default ShowRouteForm