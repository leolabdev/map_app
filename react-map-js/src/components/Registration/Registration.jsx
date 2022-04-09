import React, { useMemo, useState } from 'react'
import { getHumansData } from '../../api/humans/GetHumansData'
import { postNewHuman } from '../../api/humans/PostNewHuman';
import { CircularProgress, Typography, InputLabel, MenuItem, FormControl, Select } from '@material-ui/core';
import Box from '@mui/material/Box';
// import Stack from "@mui/material/Stack";
import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';
import { deleteHumanByUserName } from '../../api/humans/DeleteHumanByUserName';

import classes from './Registration.module.css';

const Registration = () => {

    const [humanPost, setHumanPost] = useState({
        username: '', name: '', addressAdd: {
            city: '', street: '', building: '', lat: '', lon: ''
        }
    })


    const [humansType, setHumansType] = useState("client");
    const [isLoading, setIsLoading] = useState(false);
    const [humans, setHumans] = useState([]);
    const [clients, setClients] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [status, setStatus] = useState(false);
    const [username, setUsername] = useState("");

    useMemo(() => {
        // console.log("hello")
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
    }, [humansType, status])


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
        setTimeout(() => { setStatus(!status) }, 500);
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
    }



    return (
        <div className={classes.container}>
            <h1 style={{ textAlign: 'center' }}>
                Registration Form
            </h1 >
            <Typography variant='h5'  >Client or Manufacturer CRUD form</Typography>
            {isLoading ? (
                <div className={classes.loading}>
                    <CircularProgress size="5rem" />
                </div>
            ) : (
                <>

                    <FormControl>
                        <Box
                            component="form"
                            onSubmit={addNewHuman}
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '98%' },

                            }}
                        >
                            <div>

                                <FormControl style={{ minWidth: '150px', marginBottom: '30px', margin: '1rem' }} className={classes.formControl}>
                                    <InputLabel>Humans's Type</InputLabel>
                                    <Select value={humansType} onChange={(event) => setHumansType(event.target.value)}>

                                        <MenuItem value="client">Client</MenuItem>
                                        <MenuItem value="manufacturer">Manufacturer</MenuItem>

                                    </Select>

                                </FormControl>
                                <TextField
                                    onChange={e => setHumanPost({ ...humanPost, username: e.target.value })}
                                    value={humanPost.username}
                                    required
                                    id="outlined-required"
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
                                    onChange={e => setHumanPost({
                                        ...humanPost, addressAdd: {
                                            ...humanPost.addressAdd,
                                            building: e.target.value
                                        }
                                    })}
                                    value={humanPost.addressAdd.building}
                                    id="outlined-number"
                                    label="Building's number"
                                    helperText="example: '1B'"
                                />



                                <button style={{ justifyContent: "center" }} type='submit'>Create new {humansType}</button>
                            </div>
                        </Box>
                    </FormControl>

                    <FormControl>
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
                    <div container className={classes.humansContainer}>
                    
                        {/* only if we have humans over then map over them */}
                        {humans?.map((human, index) => (
                            <div item key={index} className={classes.humanItem}>
                            {/* // <div item key={index} > */}
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

                </>
            )
            }

        </div>

    )

}

export default Registration