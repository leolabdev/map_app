import React, { useState, useEffect, createRef } from 'react'
// CircularProgress is loading icon 
import { CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select, Button } from '@material-ui/core';
import Box from '@mui/material/Box';
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

// const List = ({ humans, isLoading, setIsLoading, humansType, setHumansType, getHumansData, setHumans, }) => {
const List = ({ }) => {

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

    const [status, setStatus] = useState(false);

    const [username, setUsername] = useState("");

    // orders logic 
    const [clients, setClients] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);


    // orders's autoinput
    const clientsInputProps = {
        options: clients,
        getOptionLabel: (option) => option.clientUsername,
    };
    const manufacturersInputProps = {
        options: manufacturers,
        getOptionLabel: (option) => option.manufacturerUsername,
    };

    let shipmentAddressInputProps = null;
    let deliveryAddressInputProps = null;


    const [shipmentAddresses, setShipmentAddresses] = useState([{}])
    const [deliveryAddresses, setDeliveryAddresses] = useState([])

    const [manufacturer, setManufacturer] = useState(null);
    // const [shipmentAddressId, setShipmentAddressId] = useState(null);
    const [shipmentAddress, setShipmentAddress] = useState(null);

    const [client, setClient] = useState(null);
    // const [deliveryAddressId, setDeliveryAddressId] = useState(null);
    const [deliveryAddress, setDeliveryAddress] = useState(null);

    const [orders, setOrders] = useState([]);

    // const [chosenClients, setChosenClients] = useState([]);



    useEffect(() => {

        getOrdersData().then((data) => {

            setOrders(data)
            // console.log("helloti", orders)

        })

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



        // if array is empty effect will work only when once when page is loaded
    }, [
        humansType,
        status,
        // manufacturer
    ]);

    useEffect(() => {

        console.log("hello from useeffect", manufacturer?.Addresses)
        setShipmentAddresses(manufacturer && manufacturer?.Addresses)
        setDeliveryAddresses(client && client?.Addresses)
        // setShipmentAddresses(shipmentAddresses = manufacturer => manufacturer?.Addresses)
        //  console.log(shipmentAddresses)
        // setShipmentAddresses(shipmentAddresses => manufacturer?.Addresses.map)
        // // console.log("shipmentAddresses:", shipmentAddresses)


    }, [
        manufacturer, client

    ]);

    // when shipmentAddresses changed we use this effect
    useEffect(() => {

        shipmentAddressInputProps = {
            options: shipmentAddresses,
            getOptionLabel: (option) => option.shipmentAddresses
        }
        deliveryAddressInputProps = {
            options: deliveryAddress,
            getOptionLabel: (option) => option.deliveryAddress
        }

        console.log("shipmentAddresses:", shipmentAddresses)
        console.log("deliveryAddress", deliveryAddress)


    }, [
        shipmentAddresses, deliveryAddress

    ]);





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
        setStatus(!status)
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
        alert("hello")
        e.preventDefault()
        setManufacturer(null)
        setClient(null)
    }









    const classes = useStyles();

    return (


        <div className={classes.container}>
            <h1 style={{ textAlign: 'center' }}>
                First input
            </h1 >
            <Typography variant='h5'  >Client or Manufacturer Post form</Typography>
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
                        Second input
                    </h1 >
                    <Typography variant='h5'  >Order's Post form</Typography>
                    <FormControl>
                        {/* <InputLabel>Post</InputLabel> */}
                        <Box
                            component="form"
                            onSubmit={addNewOrder}
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '100%' },

                            }}
                        // noValidate
                        // autoComplete="off"
                        >
                            {/* clientsInputProps */}

                            <div>

                                <Autocomplete
                                    {...manufacturersInputProps}
                                    id="client-autocomplete"
                                    value={manufacturer}
                                    onChange={(event, newManufacturer) => {
                                        setManufacturer(newManufacturer);
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
                                    onChange={(event, newShipmentAddress) => {
                                        setShipmentAddress(newShipmentAddress);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="shipmentAddress" variant="standard" />
                                    )}
                                />


                                <Autocomplete
                                    {...clientsInputProps}
                                    id="client-autocomplete"
                                    value={client}
                                    onChange={(event, newClient) => {
                                        setClient(newClient);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Choose client" variant="standard" />
                                    )}
                                />

                                <Autocomplete
                                    {...shipmentAddressInputProps}
                                    id="shipmentAddress-autocomplete"
                                    value={shipmentAddress}
                                    onChange={(event, newShipmentAddress) => {
                                        setShipmentAddress(newShipmentAddress);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="deliveryAddresses" variant="standard" />
                                    )}
                                />

                                {/* <Autocomplete
                                    {...deliveryAddressInputProps}
                                    id="deliveryAddresses-autocomplete"
                                    value={deliveryAddresses}
                                    onChange={(event, newDeleveryAddress) => {
                                        setDeliveryAddress(newDeleveryAddress);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="deliveryAddresses" variant="standard" />
                                    )}
                                /> */}

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
                                <button type='submit'>Create order</button>
                            </div>
                        </Box>
                    </FormControl>

                    <br /><br />



                    <OrdersDataTable
                        orders={orders}
                        setOrders={setOrders}
                    />


                </>
            )}


        </div>

    );
}

export default List;