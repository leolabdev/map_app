import React, { useState, useEffect, createRef } from 'react'
// CircularProgress is loading icon 
import { CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select, Button } from '@material-ui/core';
import Box from '@mui/material/Box';
import Stack from "@mui/material/Stack";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import OrdersDataTable from '../DataTables/OrdersDataTable';


import useStyles from './styles.js';
import classes1 from './List.module.css';
import MyButton from '../../UI/button/MyButton';
import { postNewHuman } from '../../api/humans/PostNewHuman';
import { getHumansData } from '../../api/humans/GetHumansData'
import { deleteHumanByUserName } from '../../api/humans/DeleteHumanByUserName';
import { getOrdersData } from '../../api/orders/GetOrdersData';
import { postNewOrder } from '../../api/orders/PostNewOrder';

// const List = ({ humans, isLoading, setIsLoading, humansType, setHumansType, getHumansData, setHumans, }) => {
const List = ({ start, setStart, end, setEnd ,orderPoints, setOrderPoints}) => {

    // Post form
    // const [post, setPost] = useState({ username: '', name: '', city: '', street: '', building: '', lat: '', lon: '' })
    const [humanPost, setHumanPost] = useState({
        username: '', name: '', addressAdd: {
            city: '', street: '', building: '', lat: '', lon: ''
        }
    })
    const [humans, setHumans] = useState([]);
    const [humansType, setHumansType] = useState("client");
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingOrders, setIsLoadingOrders] = useState(false)
    const [isLoadingOrdersFlag, setIsLoadingOrdersFlag] = useState(false)

    const [status, setStatus] = useState(false);

    const [username, setUsername] = useState("");

    // orders logic 

    const [orderPost, setOrderPost] = useState({
        manufacturerUsername: '', clientUsername: '', shipmentAddressId:'',
        deliveryAddressId: ''
    })


    const [clients, setClients] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [shipmentAddresses, setShipmentAddresses] = useState([

        {
            addressId: 0,
            city: 'lahti',
            street: 'alekskatu',
            building: '2',
            flat: null,
            lon: 60.2,
            lat: 40.3,
            AsShipmentAddress: {
                manufacturerUsername: 'hello',
                addressId: 0
            }
        }

    ])
    const [deliveryAddresses, setDeliveryAddresses] = useState([])

    // orders's autoinput
    const [manufacturer, setManufacturer] = useState(null);
    //const [shipmentAddressId, setShipmentAddressId] = useState(null);
    const [shipmentAddress, setShipmentAddress] = useState(null);

    const [client, setClient] = useState(null);
    //const [deliveryAddressId, setDeliveryAddressId] = useState(null);
    const [deliveryAddress, setDeliveryAddress] = useState(null);

    const [orders, setOrders] = useState([]);


    const clientsInputProps = {
        options: clients,
        getOptionLabel: (option) => option.clientUsername,
    }
    const manufacturersInputProps = {
        options: manufacturers,
        getOptionLabel: (option) => option.manufacturerUsername,
    }
    
    let shipmentAddressInputProps = {
        options: shipmentAddresses,
        getOptionLabel: (option) => option.street + " " + option.building + ", " + option.city,
    }
    let deliveryAddressInputProps = {
        options: deliveryAddresses,
        getOptionLabel: (option) => option.street + " " + option.building + ", " + option.city,
    };

    
    
    // const [chosenClients, setChosenClients] = useState([]);

    useEffect(() => {
        setIsLoading(true)

        getHumansData(humansType)
            .then((data) => {
                setHumans(data)
                setIsLoading(false)
            })

        getHumansData("client").then((data) => {
            setClients(data)
        })

        getHumansData("manufacturer").then((data) => {
            setManufacturers(data)
        })
        // console.log(orders)
        // orders.map(order => console.log("hello", order.deliveryAddress))

        // getOrdersData().then((data) => {

        //     setOrders(data)
        //     console.log("helloti", orders)
        //     // setIsLoading(true)
        // })

        // if array is empty effect will work only when once when page is loaded
    }, [
        humansType,
        status,
        // manufacturer
    ]);

    


    useEffect( () => {
        try{
            setShipmentAddress(null);
            setShipmentAddresses(manufacturer?.Addresses);
            console.log("heer222e",shipmentAddresses)
        }catch (e){
            console.log(e);
        }
    }, [
        manufacturer
    ]);

    useEffect(() => {
        try{
            setDeliveryAddress(null);
            setDeliveryAddresses(client && client?.Addresses)
        }catch (e){
            console.log(e);
        }
    }, [
        client
    ]);

    useEffect(() => {
        setIsLoadingOrders(true)
        getOrdersData().then((data) => {

            setOrders(data)
            console.log("helloti", orders)
            setTimeout(() => {   setIsLoadingOrders(false) }, 1000);
            // setIsLoadingOrders(false)
        })
        // console.log(result)
        // setIsLoading(true)

    }, [isLoadingOrdersFlag]);


    function addNewHuman(e) {
        // desabled autoupdating
        e.preventDefault()
        const newPost = {
            ...humanPost
        }
        postNewHuman(humansType, newPost)

        // console.log("humans:", humans)
        // console.log("post:", newPost)
        // setHumans(humans, newPost)
        setTimeout(() => {   setStatus(!status) }, 500);
        console.log(humanPost)
        // createHuman(humansType, newPost)
        // setPost({ username: '', name: '', city: '', street: '', building: '', lat: '', lon: '' })
        setHumanPost({
            username: '', name: '', addressAdd: {
                city: '', street: '', building: '', lat: '', lon: ''
            }
        })
        console.log(humanPost)
    }


    function remove(e) {
        e.preventDefault()
        deleteHumanByUserName(humansType, username)
        setStatus(!status)
        setUsername("")
        // setHumans(humans.filter(p => p.id !== human.id))
    }

    function addNewOrder(e) {
        e.preventDefault()
        
        const newOrderPost = {
            ...orderPost
        }
        postNewOrder(newOrderPost)
        // need repair to autoupdate
        setOrderPost({
            manufacturerUsername: '', clientUsername: '', shipmentAddressId:'',
            deliveryAddressId: ''
        })
        setManufacturer(null);
        setClient(null);
        setShipmentAddress(null);
        setDeliveryAddress(null);
        setIsLoadingOrdersFlag(!isLoadingOrdersFlag)
        // setTimeout(() => {
        //     setIsLoadingOrdersFlag(!isLoadingOrdersFlag)
        // }, 100);
    }
    
    const classes = useStyles();

    return (


        <div className={classes.container}>
            <h1 style={{ textAlign: 'center' }}>
                First Form
            </h1 >
            <Typography variant='h5'  >Client or Manufacturer CRUD form</Typography>
            {isLoading ? (
                <div className={classes.loading}>
                    <CircularProgress size="5rem" />
                </div>
            ) : (
                <>


                    <FormControl>
                        {/* <InputLabel>Post new human</InputLabel> */}
                        <Box
                            component="form"
                            onSubmit={addNewHuman}
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '100%' },

                            }}
                        // noValidate
                        // autoComplete="off"
                        >
                            <div>

                                <FormControl className={classes.formControl}>
                                    <InputLabel>Humans's Type</InputLabel>
                                    <Select value={humansType} onChange={(event) => setHumansType(event.target.value)}>

                                        <MenuItem value="client">Client</MenuItem>
                                        <MenuItem value="manufacturer">Manufacturer</MenuItem>

                                    </Select>

                                </FormControl>
                                <TextField
                                    // onChange={e => setTitle(e.target.value)}
                                    onChange={e => setHumanPost({ ...humanPost, username: e.target.value })}
                                    value={humanPost.username}
                                    required
                                    id="outlined-required"
                                    // label="Username"
                                    label={`${humansType}Username`}
                                    autoComplete="current-username"
                                />
                                <TextField
                                    onChange={e => setHumanPost({ ...humanPost, name: e.target.value })}
                                    value={humanPost.name}
                                    required
                                    id="outlined-required"
                                    label="Name"
                                    helperText="Firstname and Lastname"
                                />
                                <TextField

                                    disabled
                                    id="filled-disabled"
                                    label=" Give Address ↓"
                                    defaultValue="Address"
                                    variant="filled"
                                />
                                <TextField
                                    required
                                    // onChange={e => setPost({ ...post, city: e.target.value })}
                                    onChange={e => setHumanPost({
                                        ...humanPost, addressAdd: {
                                            ...humanPost.addressAdd,
                                            city: e.target.value
                                        }
                                    })}
                                    value={humanPost.addressAdd.city}

                                    id="outlined-required"
                                    label="City"
                                    helperText="example: 'Helsinki'"
                                />
                                <TextField
                                    // onChange={e => setPost({ ...post, street: e.target.value })}
                                    onChange={e => setHumanPost({
                                        ...humanPost, addressAdd: {
                                            ...humanPost.addressAdd,
                                            street: e.target.value
                                        }
                                    })}
                                    value={humanPost.addressAdd.street}
                                    required
                                    id="outlined-required"
                                    label="Street"
                                    helperText="example:'Porvoonkatu'"
                                />
                                <TextField
                                    // onChange={e => setPost({ ...post, building: e.target.value })}
                                    onChange={e => setHumanPost({
                                        ...humanPost, addressAdd: {
                                            ...humanPost.addressAdd,
                                            building: e.target.value
                                        }
                                    })}
                                    value={humanPost.addressAdd.building}
                                    id="outlined-number"
                                    label="Building's number"
                                    // type="number"
                                    // InputLabelProps={{
                                    //     shrink: true,
                                    // }}
                                    helperText="example: '1B'"
                                />


                                {/* <button onClick={addNewHuman}>Create new Human</button> */}

                                <button style={{ justifyContent: "center" }} type='submit'>Create new {humansType}</button>
                                {/* <MyButton onClick={createHuman} >send</MyButton> */}

                                {/* <Button variant="contained" size="large">send</Button> */}
                            </div>
                        </Box>
                    </FormControl>
                    <FormControl>
                        {/* <InputLabel>Post new human</InputLabel> */}
                        <Box
                            component="form"
                            onSubmit={remove}
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '100%' },

                            }}
                        // noValidate
                        // autoComplete="off"
                        >
                            <div>
                                <TextField
                                    onChange={e => setUsername(e.target.value)}
                                    value={username}
                                    required
                                    id="outlined-required"
                                    // label="Username"
                                    label={`${humansType}Username`}
                                // autoComplete="current-username"
                                />

                                <br />
                                <button type='submit'>Delete {humansType} by username</button>
                            </div>
                        </Box>
                    </FormControl>
                    <br />
                    <br />


                    <div container className={classes.listcontainer}>
                        {/* only if we have humans over then map over them */}
                        {humans?.map((human, index) => (
                            <div item key={index} className={classes1.listItem}>
                                <br />
                                <div>
                                    <b>Id:</b>{index} <b>{humansType}Username:</b>  {human?.clientUsername || human?.manufacturerUsername}, <b>Name:</b>  {human?.name}, <b>address: </b> {human?.Addresses[0]?.street || "Null"},  <b>FullAddress:</b>  {JSON.stringify(human?.Addresses)} ,
                                    {/* {human?.Addresses?.building} {human?.Addresses?.city}{human?.Addresses?.flat},{human?.Addresses?.lat} {human?.Addresses?.lon}{human?.Addresses?.street} */}


                                </div>
                                {/* <button>update</button> */}
                            </div>
                        ))}
                    </div>
                    <br />

                    <h1 style={{ textAlign: 'center' }}>
                        Second Form
                    </h1 >
                    <Typography variant='h5'  >Order's CRUD form</Typography>
                    <FormControl>
                        {/* <InputLabel>Post</InputLabel> */}
                        {/* <Box */}
                        <Stack
                            component="form"
                            onSubmit={addNewOrder}
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '250px' },

                            }}
                        // noValidate
                        // autoComplete="off"
                        >
                            {/* clientsInputProps */}

                            <div>
                            {/* onChange={e => setHumanPost({ ...humanPost, name: e.target.value })} */}
                                <Autocomplete
                                    {...manufacturersInputProps}
                                    id="client-autocomplete"
                                    value={manufacturer}
                                    onChange={ (event, newManufacturer) => {
                                        
                                        setManufacturer(newManufacturer);
                                        setOrderPost({...orderPost, manufacturerUsername: newManufacturer.manufacturerUsername});
                                        // setHumanPost({ ...humanPost, name: e.target.value })
                                        //  setTimeout(() => {   console.log("here is manuf",orderPost) }, 2000);
                                        
                                        // console.log("our manufacturer is", newManufacturer)


                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Choose manufacturer" variant="standard" />
                                    )}
                                />


                                {/* {manufacturer && manufacturer.Addresses} */}
                                <Autocomplete
                                    {...shipmentAddressInputProps}
                                    id="shipmentAddress-autocomplete"
                                    value={shipmentAddress}
                                    onChange={(event, newShipmentAddress ) => {
                                        setShipmentAddress(newShipmentAddress);
                                        setOrderPost({...orderPost, shipmentAddressId: newShipmentAddress.addressId});
                                        // console.log(orderPost)
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Shipment Address" variant="standard" />
                                    )}
                                />


                                <Autocomplete
                                    {...clientsInputProps}
                                    id="client-autocomplete"
                                    value={client}
                                    onChange={(event, newClient) => {
                                        setClient(newClient);
                                        setOrderPost({...orderPost, clientUsername: newClient.clientUsername});
                                         
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Choose client" variant="standard" />
                                    )}
                                />

                                <Autocomplete
                                    {...deliveryAddressInputProps}
                                    id="deliveryAddresses-autocomplete"
                                    value={deliveryAddress}
                                    onChange={(event, newDeleveryAddress) => {
                                        setDeliveryAddress(newDeleveryAddress);
                                        setOrderPost({...orderPost, deliveryAddressId: newDeleveryAddress.addressId});
                                        
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Delivery Addresses" variant="standard" />
                                    )}
                                />
                               


                                {/* const shipmentAddressIdInputProps = {
                                    options: manufacturer.Addresses,
                                getOptionLabel: (option) => option.Addresses
    }
                                const deliveryAddressIdIdInputProps = {
                                    options: manufacturer.Addresses,
                                     getOptionLabel: (option) => option.Addresses
    } */}

                                {/* template for multiple clients */}
                                {/* <Autocomplete
                                    multiple
                                    id="client-autocomplete"
                                    options={clients}

                                    // onChange={(event, newClient) => {
                                    //     setChosenClients(...chosenClients, newClient);
                                    // }}
                                    getOptionLabel={(option) => option.clientUsername}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            label="Choose clients"
                                        />
                                    )}
                                /> */}



                                {/* <TextField
                                    onChange={e => setUsername(e.target.value)}
                                    value={username}
                                    required
                                    id="outlined-required"
                                    // label="Username"
                                    label={`${humansType}Username`}
                                // autoComplete="current-username"
                                /> */}



                                <br />
                                <button type='submit'>Create order</button>
                            </div>
                            {/* </Box> */}
                        </Stack>
                    </FormControl>

                    <br /><br />

                
                    {isLoadingOrders ? (
                <div 
                // className={classes.loading}
                >
                    <CircularProgress size="5rem" />
                </div>
            ) : (
                    <OrdersDataTable
                        start={start}
                        setStart={setStart}
                        end={end}
                        setEnd={setEnd}

                        orders={orders}
                        setOrders={setOrders}

                        orderPoints={orderPoints}
                        setOrderPoints={setOrderPoints}
                    />
            )}

                </>
            )}


        </div>

    );
}

export default List;