import React, { useState, useEffect, createRef } from 'react'
// CircularProgress is loading icon 
import { CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select, Button } from '@material-ui/core';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import DataTable from '../DataTable/DataTable';


import useStyles from './styles.js';
import classes1 from './List.module.css';
import MyButton from '../../UI/button/MyButton';
import { postNewHuman } from '../../api/humans/PostNewHuman';
import { getHumansData } from '../../api/humans/GetHumansData'
import { deleteHumanByUserName } from '../../api/humans/DeleteHumanByUserName';

// const List = ({ humans, isLoading, setIsLoading, humansType, setHumansType, getHumansData, setHumans, }) => {
const List = ({ }) => {

    // Post form
    // const [post, setPost] = useState({ username: '', name: '', city: '', street: '', building: '', lat: '', lon: '' })
    const [post, setPost] = useState({
        username: '', name: '', addressAdd: {
            city: '', street: '', building: '', lat: '', lon: ''
        }
    })
    const [humans, setHumans] = useState([]);
    const [humansType, setHumansType] = useState("client");
    const [isLoading, setIsLoading] = useState(false)

    const [status, setStatus] = useState(false)

    const [username, setUsername] = useState("")


    function addNewPost(e) {
        // desabled autoupdating
        e.preventDefault()
        const newPost = {
            ...post
        }
        postNewHuman(humansType, newPost)

        // console.log("humans:", humans)
        // console.log("post:", newPost)
        // setHumans(humans, newPost)
        setStatus(!status)
        console.log(post)
        // createHuman(humansType, newPost)
        // setPost({ username: '', name: '', city: '', street: '', building: '', lat: '', lon: '' })
        setPost({
            username: '', name: '', addressAdd: {
                city: '', street: '', building: '', lat: '', lon: ''
            }
        })
        console.log(post)
    }


    function removePost(e) {
        e.preventDefault()
        deleteHumanByUserName(humansType, username)
        setStatus(!status)
        setUsername("")
        // setHumans(humans.filter(p => p.id !== human.id))
    }





    useEffect(() => {

        setIsLoading(true)

        getHumansData(humansType)


            .then((data) => {

                setHumans(data)

                setIsLoading(false)
            })

        // if array is empty effect will work only when once when page is loaded
    }, [
        humansType,
        status
    ]);

    // useEffect(() => {

    //     setHumans(...humans, post)

    //     // if array is empty effect will work only when once when page is loaded
    // }, [
    //     //humansType,
    //     status
    // ]);




    const classes = useStyles();

    return (


        <div className={classes.container}>
            <h1 style={{ textAlign: 'center' }}>
                First input
            </h1 >
            <Typography variant='h5'  >User or Manufacturer Post form</Typography>
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
                            onSubmit={addNewPost}
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
                                    onChange={e => setPost({ ...post, username: e.target.value })}
                                    value={post.username}
                                    required
                                    id="outlined-required"
                                    // label="Username"
                                    label={`${humansType}Username`}
                                    autoComplete="current-username"
                                />
                                <TextField
                                    onChange={e => setPost({ ...post, name: e.target.value })}
                                    value={post.name}
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
                                    onChange={e => setPost({
                                        ...post, addressAdd: {
                                            ...post.addressAdd,
                                            city: e.target.value
                                        }
                                    })}
                                    value={post.addressAdd.city}

                                    id="outlined-required"
                                    label="City"
                                    helperText="example: 'Helsinki'"
                                />
                                <TextField
                                    // onChange={e => setPost({ ...post, street: e.target.value })}
                                    onChange={e => setPost({
                                        ...post, addressAdd: {
                                            ...post.addressAdd,
                                            street: e.target.value
                                        }
                                    })}
                                    value={post.addressAdd.street}
                                    required
                                    id="outlined-required"
                                    label="Street"
                                    helperText="example:'Porvoonkatu'"
                                />
                                <TextField
                                    // onChange={e => setPost({ ...post, building: e.target.value })}
                                    onChange={e => setPost({
                                        ...post, addressAdd: {
                                            ...post.addressAdd,
                                            building: e.target.value
                                        }
                                    })}
                                    value={post.addressAdd.building}
                                    id="outlined-number"
                                    label="Building's number"
                                    // type="number"
                                    // InputLabelProps={{
                                    //     shrink: true,
                                    // }}
                                    helperText="example: '1B'"
                                />


                                {/* <button onClick={addNewPost}>Create new Human</button> */}

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
                            onSubmit={removePost}
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '100%' },

                            }}
                        // noValidate
                        // autoComplete="off"
                        >
                            <div>
                                <TextField
                                    // onChange={e => setTitle(e.target.value)}
                                    onChange={e => setUsername(e.target.value)}
                                    value={username}
                                    required
                                    id="outlined-required"
                                    // label="Username"
                                    label={`${humansType}Username`}
                                // autoComplete="current-username"
                                />

                                {/* <button onClick={addNewPost}>Create new Human</button> */}
                                <br />
                                <button type='submit'>Delete {humansType} by username</button>
                                {/* <MyButton onClick={createHuman} >send</MyButton> */}

                                {/* <Button variant="contained" size="large">send</Button> */}
                            </div>
                        </Box>
                    </FormControl>
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


                    <div></div>

                    <DataTable />


                </>
            )}


        </div>

    );
}

export default List;