import { TextField } from '@mui/material'
import {Checkbox} from '@mui/material/'
import {FormControlLabel} from '@mui/material';
// import InputLabel from '@mui/material/InputLabel';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
import React, { useState, useEffect } from 'react'
// import MyButton from '../UI/button/MyButton'
import MyButton from '../UI/button/MyButton'


import classes from './ShowRouteForm.module.css'
import Autocomplete from "@mui/material/Autocomplete";
import { getHumansData } from "../../api/humans/GetHumansData";
// import { valueToPercent } from '@mui/base';

const ShowRouteForm = ({ setOurShipmentAddress, setOurShipmentAddresses, setOurDeliveryAddress, setOurDeliveryAddresses, ourShipmentAddress, ourShipmentAddresses, ourDeliveryAddress, ourDeliveryAddresses, setVisible, ordersIdForRoutes, addRoute, addOrderMarker, fuelUsage, setFuelUsage, ourStart, setOurStart, ourEnd, setOurEnd, setRouteData, routeData, ordersAddresses, setOrdersAddresses, ordersAddressesFlag, setOrdersAddressesFlag }) => {

    // let [manufacturer, setManufacturer] = useState({});
    // let [client, setClient] = useState({});

    //Checkbox
    const [checked,setChecked] = useState(false)




    let [clients, setClients] = useState([]);
    // let [manufacturers, setManufacturers] = useState([]);

    // let shipmentAddresses = [];
    // let deliveryAddresses = [];
    // const [ourShipmentAddress, setOurShipmentAddress] = useState(null);
    // const [ourDeliveryAddress, setOurDeliveryAddress] = useState(null);

    // let [ourShipmentAddresses, setOurShipmentAddresses] = useState([{city:null, street:null, building:null}])
    // let [ourDeliveryAddresses, setOurDeliveryAddresses] = useState([{city:null, street:null, building:null}])

    useEffect(() => {


        // getHumansData("manufacturer").then((data) => {
        //     // setManufacturers(data)
        //     console.log(data)
        // })
        // getHumansData("client").then((data) => {
        //     setClients(data)
        //     console.log(data)
        // })
        // setOurShipmentAddress(ourShipmentAddresses[0])
        // setOurDeliveryAddress(ourDeliveryAddresses[0])

        // ordersAddresses.map((address) => {
        //     // if (shipmentAddresses.length!==0){
        //         // setShipmentAddresses( address.shipmentAddress)
        //     // }
        //     // if(deliveryAddresses.length!== 0 ){
        //         // setDeliveryAddresses(address.deliveryAddress)
        //     // }
        //     shipmentAddresses.push(address.shipmentAddress)
        //     deliveryAddresses.push(address.deliveryAddress)
        //      return null
        // })

        console.log("ordersAddresses", ordersAddresses)
        console.log("ourShipmentAddresses", ourShipmentAddresses)
        console.log("ourDeliveryAddresses", ourDeliveryAddresses)

    }, [ordersAddresses]);



    // ordersAddresses.map((address) => {
    //     // if (shipmentAddresses.length!==0){
    //         // setShipmentAddresses(address.shipmentAddress)
    //     // }
    //     // if(deliveryAddresses.length!== 0 ){
    //         // setDeliveryAddresses( address.deliveryAddress)
    //     // }
    //     ourShipmentAddresses.push(address.shipmentAddress)
    //     ourDeliveryAddresses.push(address.deliveryAddress)

    // })



    const shipmentAddressesInputProps = {
        options: ourShipmentAddresses,
        getOptionLabel: (option) => `${option.city}, ${option.street} ${option.building}  `,
    }

    const deliveryAddressesInputProps = {
        options: ourDeliveryAddresses,
        getOptionLabel: (option) => `${option.city}, ${option.street} ${option.building}  `,
    }


    // const manufacturersInputProps = {
    //     options: manufacturers,
    //     getOptionLabel: (option) => `${option.manufacturerUsername}, ${option.Addresses[0].city}, ${option.Addresses[0].street} ${option.Addresses[0].building}  `,
    // }


    // const clientsInputProps = {
    //     options: clients,
    //     getOptionLabel: (option) => `${option.clientUsername}, ${option.Addresses[0].city}, ${option.Addresses[0].street} ${option.Addresses[0].building}  `,
    // }






    function showRoute() {


        console.log("ordersIdForRoutes", ordersIdForRoutes)
        console.log("ordersAddresses", ordersAddresses)


        setVisible(false);
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        // window.scrollBy({
        //     top: 1000,
        //     left: 270,
        //     behavior: 'smooth'
        // });

        console.log("orders id in  map request", ordersIdForRoutes)

        let RouteRequestData = {
            orderIds: [
                ...ordersIdForRoutes
            ],

            // start: [ourStart.lon, ourStart.lat],
            // end: [ourEnd.lon, ourEnd.lat],
            fuelusage: fuelUsage,
            isCenterAvoided: checked
        }
        if (Number.isInteger(ourStart)) {
            RouteRequestData.start= ourStart
        }
        else if (ourStart != null) {
            RouteRequestData.start = [ourStart.lon, ourStart.lat]
        }

        if(Number.isInteger(ourEnd)){
            RouteRequestData.end = ourEnd
        }
        else if (ourEnd != null) {
            RouteRequestData.end = [ourEnd.lon, ourEnd.lat]
        }



        console.log("RouteRequestData", RouteRequestData)
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


                    addRoute(data);
                    setRouteData(data.features[0].properties.summary);
                    console.log(routeData)
                    // removeStartMarker();
                    // removeEndMarker();
                    // coordinatesData.coordinates.map((c)=>addOrderMarker(c[1],c[0]))
                    // console.log("ourproblem",data.features[0].properties.summary.orders);
                    const summary = data.features[0].properties.summary
                    const start = data.features[0].properties.summary.start || null;
                    const end = data.features[0].properties.summary.end || null;
                    //6 is name
                    const dataOrders = data.features[0].properties.summary.orders;
                    //   console.log(dataOrders.shipmentAddress.lat, dataOrders.shipmentAddress.lon)


                    //    addOrderMarker(ourStart.lat, ourStart.lon, `<b style="color:green">Start</b><br />`, "Start"); 

                    console.log(dataOrders)
                    // data.features[0].properties.summary.orders[2].slice(1).forEach(
                    summary.orders.forEach(
                        (o) => {
                            addOrderMarker(o.deliveryAddress.lat, o.deliveryAddress.lon,
                                `<b style="color:blue">Client</b><br />
                                <b>${o.Client?.name}</b><br />
                                 AddressId:${o.deliveryAddress?.addressId}<br /> 
                                 City:     ${o.deliveryAddress?.city}<br /> 
                                 Street: ${o.deliveryAddress?.street} ${o.deliveryAddress?.building}<br />
                                 Flat: ${o.deliveryAddress?.flat}<br /> 
                                  `,
                                "Client"
                            )

                            addOrderMarker(o.shipmentAddress.lat, o.shipmentAddress.lon,
                                `<b style="color:orange">Manufacturer</b><br />
                                <b>${o.Manufacturer?.name}</b><br />
                                 AddressId:${o.shipmentAddress?.addressId}<br /> 
                                 City:     ${o.shipmentAddress?.city}<br /> 
                                 Street: ${o.shipmentAddress?.street} ${o.shipmentAddress?.building}<br />
                                 Flat: ${o.shipmentAddress?.flat}<br /> 
                                  `,
                                "Manufacturer"
                            )
                            console.log(o.orderId)
                        }
                    )
                    //start
                    if (start != null) {
                        // addOrderMarker(start.coordinates[1], start.coordinates[0],
                        addOrderMarker(start.shipmentAddress.lat, start.shipmentAddress.lon,
                            `<b style="color:green">Start(Manufacturer)</b><br />
                            <b>${start?.Manufacturer?.name}</b><br /> 
                            AddressId:${start?.shipmentAddress?.addressId}<br /> 
                            City:   ${start?.shipmentAddress?.city}<br /> 
                            Street: ${start?.shipmentAddress?.street} ${start?.shipmentAddress?.building}<br /> 
                            Flat: ${start?.shipmentAddress?.flat}<br />     
                            `, "Start");
                    }
                    //end
                    if (end != null) {
                        console.log(end)
                        // addOrderMarker(end.coordinates[1], end.coordinates[0],
                           addOrderMarker(end.deliveryAddress.lat,end.deliveryAddress.lon,
                            `<b style="color:red">End(Client)</b><br />
                            <b>${end?.Client?.name}</b><br />
                            AddressId:${end?.deliveryAddress?.addressId}<br />  
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
        }
        else {
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
            <div >
                <MyButton
                    onClick={showRoute}
                >
                    Finally Show Route
                </MyButton>
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

        <FormControlLabel
            control={
              <Checkbox checked={checked} onChange={(event)=>{
                setChecked(event.target.checked)
              }} name="isCenterAvoided" />
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
                    console.log("newShipmentAddress", newShipmentAddress);
                    // if (newShipmentAddress.orderId != null) {
                    if (newShipmentAddress!=null) {
                        if ('orderId' in newShipmentAddress) {
                            setOurStart(newShipmentAddress.orderId)
                        }
                        else if (newShipmentAddress != null) {
                            setOurStart({ lat: newShipmentAddress.lat, lon: newShipmentAddress.lon })
                        }
                        else { setOurStart(null) }
                    }    
                   
                    console.log(ourStart)
                }}
                renderInput={(params) => (
                    <TextField {...params} label="Choose Start" variant="standard" />
                )}
            />
            <Autocomplete
                {...deliveryAddressesInputProps}
                id="deliveryAddresses-autocomplete"
                value={ourDeliveryAddress}
                onChange={(event, newDeliveryAddress) => {
                    setOurDeliveryAddress(newDeliveryAddress);

                    // if (newDeliveryAddress != null) {
                    //     setOurEnd({ lat: newDeliveryAddress.lat, lon: newDeliveryAddress.lon });
                    // }
                    // else { setOurEnd(null) }
                    if (newDeliveryAddress!=null) {
                        if ('orderId' in newDeliveryAddress) {
                            setOurEnd(newDeliveryAddress.orderId)
                        }
                        else if (newDeliveryAddress != null) {
                            setOurEnd({ lat: newDeliveryAddress.lat, lon: newDeliveryAddress.lon })
                        }
                        else { setOurEnd(null) }
                    }
                    


                }}
                renderInput={(params) => (
                    <TextField {...params} label="Choose End" variant="standard" />
                )}
            />
            <ShowrouteButton />

        </div>
    )
}

export default ShowRouteForm