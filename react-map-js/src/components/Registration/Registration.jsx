import React, { useState ,useEffect} from 'react'
import {
    CircularProgress,
    InputLabel,
    MenuItem,
    Select,
    FormLabel,
    FormGroup
} from '@material-ui/core';
import { FormControl } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import MyButton from '../UI/button/MyButton';
import HumanList from "./HumanList";
import classes from './Registration.module.css';
import {Api} from "../../shared/api";

/**
 * Registration element for Registration page shows form and list of humans
 * @returns {JSX.Element}
 * @constructor
 */
const Registration = () => {
    const [humanPost, setHumanPost] = useState({
        username: '', name: '', addressAdd: {
            city: '', street: '', building: '', lat: '', lon: ''
        }
    })

    const [humansType, setHumansType] = useState("client");
    const [userType, setUserType] = useState("client");
    const [isLoading, setIsLoading] = useState(false);
    const [humans, setHumans] = useState([]);
    const [status, setStatus] = useState(false);

    /**
     * Updates when userType or status switches state and gets humans from database
     */
    useEffect(() => {
        setIsLoading(true)
        Api.humans.getDataByType(userType)
            .then((data) => {
                setHumans(data)
                setIsLoading(false)
            })
    }, [userType, status])

    /**
     * Adds new human to database using postNewHuman() function from react-map-js/.../humans/PostNewHuman.js
     * @param e
     */
    function addNewHuman(e) {
        // desabled autoupdating
        e.preventDefault()
        const newPost = {
            ...humanPost
        }

        Api.humans.postNew(humansType, newPost)

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

    return (
        <div className={classes.container}>
            {isLoading ? (
                <div className={classes.loading}>
                    <CircularProgress size="5rem" />
                </div>
            ) : (
                <FormControl>
                    <Box
                        component="form"
                        onSubmit={addNewHuman}
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '98%' },

                        }}
                    >
                        <div  className={classes.formContent}>
                            <h1> Registration Form</h1 >
                            <FormControl className={classes.fieldset} component="fieldset" >
                                <FormLabel component="Legend">User Information</FormLabel>
                                <FormGroup row>
                                    <TextField
                                        onChange={e => setHumanPost({ ...humanPost, username: e.target.value })}
                                        value={humanPost.username}
                                        required
                                        id="outlined-required"
                                        label={`Username`}
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
                                    <FormControl style={{ minWidth: '150px', marginBottom: '30px', margin: '1rem' }}>
                                        <InputLabel>Type</InputLabel>
                                        <Select value={humansType} onChange={(event) => setHumansType(event.target.value)}>
                                            <MenuItem value="client">Client</MenuItem>
                                            <MenuItem value="manufacturer">Manufacturer</MenuItem>
                                        </Select>
                                    </FormControl>
                                </FormGroup>
                            </FormControl>

                            <FormControl className={classes.fieldset} component="fieldset" >
                                <FormLabel component="Legend">Address</FormLabel>
                                <FormGroup row>
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
                                </FormGroup>
                            </FormControl>
                            {/* <button style={{ justifyContent: "center" }} type='submit'>Create new {humansType}</button> */}
                        </div>
                        <MyButton type='submit'> Create new {humansType} </MyButton>
                    </Box>
                    <div  className={classes.formContent}>
                        <h1>Registered users</h1 >
                        <FormControl className={classes.fieldset} component="fieldset" >
                            <FormLabel component="Legend">Users</FormLabel>
                            <FormGroup column>
                                <FormControl style={{ minWidth: '150px', marginBottom: '30px', margin: '0px', width: "fit-content"}}>
                                    <InputLabel>Type</InputLabel>
                                    <Select value={userType} onChange={(event) => setUserType(event.target.value)}>
                                        <MenuItem value="client">Client</MenuItem>
                                        <MenuItem value="manufacturer">Manufacturer</MenuItem>
                                    </Select>
                                </FormControl>
                                <HumanList type={userType} humans={humans}/>
                            </FormGroup>
                        </FormControl>
                    </div>
                </FormControl>
            )
            }
        </div>
    )
}

export default Registration