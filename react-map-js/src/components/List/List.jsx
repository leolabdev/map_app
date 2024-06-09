import React, { useState, useEffect } from 'react'
// CircularProgress is loading icon 
import { CircularProgress, Typography, FormControl } from '@material-ui/core';
import Stack from "@mui/material/Stack";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import OrdersDataTable from '../DataTables/OrdersDataTable';
import useStyles from './styles.js';
import MyButton from '../UI/button/MyButton';
import { getHumansDataByType } from '../../api/humans/GetHumansDataByType'
import { getOrdersData } from '../../api/orders/GetOrdersData';
import { postNewOrder } from '../../api/orders/PostNewOrder';


const List = ({
    currentPosition,
    setOurShipmentAddresses,
    setOurDeliveryAddresses,
    setOrdersAddresses,
    setOrdersIdForRoutes,
    modal,
    setModal,
}) => {

    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingOrders, setIsLoadingOrders] = useState(false)
    const [isLoadingOrdersFlag, setIsLoadingOrdersFlag] = useState(false)

    // orders logic 
    const [orderPost, setOrderPost] = useState({
        manufacturerUsername: '', clientUsername: '', shipmentAddressId: '', deliveryAddressId: ''
    })


    const [clients, setClients] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [shipmentAddresses, setShipmentAddresses] = useState([

        {
            city: '', street: '', building: '', annotation: 'Please choose a manufacturer first',
        }

    ])
    const [deliveryAddresses, setDeliveryAddresses] = useState([

        {
            city: '', street: '', building: '', annotation: 'Please choose a client first',
        }

    ])

    // orders's autoinput logic , they help to  display current value in the autoinput and from them we make the orderpost
    const [manufacturer, setManufacturer] = useState(null);
    const [shipmentAddress, setShipmentAddress] = useState(null);
    const [client, setClient] = useState(null);
    const [deliveryAddress, setDeliveryAddress] = useState(null);

    // state for saving orders
    const [orders, setOrders] = useState([]);

    // props for autoinputs
    const clientsInputProps = {
        options: clients, getOptionLabel: (option) => option.clientUsername,
    }
    const manufacturersInputProps = {
        options: manufacturers, getOptionLabel: (option) => option.manufacturerUsername,
    }

    const shipmentAddressInputProps = {
        options: shipmentAddresses,
        getOptionLabel: (option) => (option?.annotation ? option.annotation : "") + (option?.street && option.street) + " " + (option?.building && option.building) + " " + (option?.city && option.city),
    }
    const deliveryAddressInputProps = {
        options: deliveryAddresses,
        getOptionLabel: (option) => (option?.annotation ? option.annotation : "") + (option?.street && option.street) + " " + (option?.building && option.building) + " " + (option?.city && option.city),
    };

    //on component mount we get clients and manufacturers data
    useEffect(() => {
        setIsLoading(true)

        getHumansDataByType("client").then((data) => {
            setClients(data)
        })

        getHumansDataByType("manufacturer").then((data) => {
            setManufacturers(data)
        })
        setIsLoading(false)
    }, []);

    // when we get a manufacturer, we can get from it addresses 
    useEffect(() => {
        try {
            setShipmentAddress(null);
            if (manufacturer?.Addresses != null) {
                setShipmentAddresses(manufacturer?.Addresses)
            }
        } catch (e) {
            console.log(e);
        }
    }, [manufacturer]);

    // when we get a client, we can get from it addresses 
    useEffect(() => {
        try {
            setDeliveryAddress(null);
            if (client?.Addresses != null) {
                setDeliveryAddresses(client && client?.Addresses)
            }

        } catch (e) {
            console.log(e);
        }
    }, [client]);

    // here we get orders data 
    useEffect(() => {
        setIsLoadingOrders(true)
        getOrdersData().then((data) => {
            if (data != null) {
                setOrders(data)
                setIsLoadingOrders(false)
            }
        })
    }, [isLoadingOrdersFlag]);

    // for the order add button 
    function addNewOrder(e) {
        // no update page after sending a post
        e.preventDefault()
        const newOrderPost = {
            ...orderPost
        }
        postNewOrder(newOrderPost)
        setOrderPost({
            manufacturerUsername: '', clientUsername: '', shipmentAddressId: '', deliveryAddressId: ''
        })
        // reset fields
        setManufacturer(null);
        setClient(null);
        setShipmentAddress(null);
        setDeliveryAddress(null);
        setIsLoadingOrdersFlag(!isLoadingOrdersFlag)
    }

    const classes = useStyles();

    return (
        <div className={classes.container}>

            {isLoading ? (<div className={classes.loading}>
                <CircularProgress size="5rem" />
            </div>) : (<>
                <h1 style={{ textAlign: 'center' }}>
                    Second Form
                </h1>
                <Typography variant='h5'>Order's CRUD form</Typography>
                <FormControl>
                    <Stack
                        component="form"
                        onSubmit={addNewOrder}
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '250px' },
                        }}
                    >
                        <div>
                            <Autocomplete
                                {...manufacturersInputProps}
                                id="manufacturer-autocomplete"
                                value={manufacturer}
                                onChange={(event, newManufacturer) => {
                                    setManufacturer(newManufacturer);
                                    setOrderPost({
                                        ...orderPost, manufacturerUsername: newManufacturer.manufacturerUsername
                                    });
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Choose manufacturer" variant="standard" />)}
                            />

                            <Autocomplete
                                {...shipmentAddressInputProps}
                                id="shipmentAddress-autocomplete"
                                value={shipmentAddress}
                                onChange={(event, newShipmentAddress) => {
                                    if (newShipmentAddress.annotation == null) {
                                        setShipmentAddress(newShipmentAddress);
                                        setOrderPost({
                                            ...orderPost, shipmentAddressId: newShipmentAddress.addressId
                                        });
                                    } else {
                                        setShipmentAddress(null)
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Shipment Address" variant="standard" />)}
                            />

                            <Autocomplete
                                {...clientsInputProps}
                                id="client-autocomplete"
                                value={client}
                                onChange={(event, newClient) => {
                                    setClient(newClient);
                                    setOrderPost({ ...orderPost, clientUsername: newClient.clientUsername });
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Choose client" variant="standard" />)}
                            />

                            <Autocomplete
                                {...deliveryAddressInputProps}
                                id="deliveryAddresses-autocomplete"
                                value={deliveryAddress}
                                onChange={(event, newDeleveryAddress) => {
                                    if (newDeleveryAddress.annotation == null) {
                                        setDeliveryAddress(newDeleveryAddress);
                                        setOrderPost({
                                            ...orderPost, deliveryAddressId: newDeleveryAddress.addressId
                                        });
                                    } else {
                                        setDeliveryAddress(null)
                                    }

                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Delivery Addresses" variant="standard" />)}
                            />
                            <br />
                            <MyButton type='submit'>Create order</MyButton>
                        </div>
                    </Stack>
                </FormControl>

                <br /><br />

                {isLoadingOrders ? (<div
                    className={classes.loading}
                >
                    <CircularProgress size="5rem" />
                </div>) : (

                    <OrdersDataTable
                        currentPosition={currentPosition}
                        setOurShipmentAddresses={setOurShipmentAddresses}
                        setOurDeliveryAddresses={setOurDeliveryAddresses}
                        modal={modal}
                        setModal={setModal}
                        orders={orders}
                        setOrders={setOrders}
                        setOrdersIdForRoutes={setOrdersIdForRoutes}
                        setOrdersAddresses={setOrdersAddresses}
                    />)}
            </>)}

        </div>

    );
}

export default List;