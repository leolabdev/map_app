import React, { useState, useEffect, createRef } from 'react'
// CircularProgress is loading icon 
import { CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select, Button } from '@material-ui/core';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import DataTable from '../DataTable/DataTable';


import useStyles from './styles.js';
import classes1 from './List.module.css';
import MyButton from '../../UI/button/MyButton';


const List = ({ humans, isLoading, humansType, setHumansType, createHuman }) => {

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
                            sx={{
                                '& .MuiTextField-root': { m: 2, width: '25ch' },

                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <div>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Username"
                                    autoComplete="current-username"
                                />
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Name"
                                    helperText="Firstname and Lastname"
                                />
                                <TextField
                                    disabled
                                    id="filled-disabled"
                                    label=" Give Address--------------------->"
                                    defaultValue="Address"
                                    variant="filled"
                                />
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="City"
                                    helperText="example: 'Helsinki'"
                                />
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Street"
                                    helperText="example:'Porvoonkatu'"
                                />
                                <TextField
                                    id="outlined-number"
                                    label="Building's number"
                                    // type="number"
                                    // InputLabelProps={{
                                    //     shrink: true,
                                    // }}
                                    helperText="example: '1B'"
                                />
                                <TextField
                                    id="outlined-number"
                                    label="Lat"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    helperText="example: '60.1699'"
                                />
                                <TextField
                                    id="outlined-number"
                                    label="Lon"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    helperText="example: '24.9384'"
                                />
                                <button>Create new Human</button>
                                {/* <MyButton onClick={createHuman} >send</MyButton> */}

                                {/* <Button variant="contained" size="large">send</Button> */}
                            </div>
                        </Box>
                    </FormControl>

                    <FormControl className={classes.formControl}>
                        <InputLabel>Humans's Type</InputLabel>
                        <Select value={humansType} onChange={(event) => setHumansType(event.target.value)}>

                            <MenuItem value="client">Client</MenuItem>
                            <MenuItem value="manufacturer">Manufacturer</MenuItem>

                        </Select>
                    </FormControl>

                    <div container className={classes.listcontainer}>
                        {/* only if we have humans over then map over them */}
                        {humans?.map((human, index) => (
                            <div item key={index} className={classes1.listItem}>
                                <br />
                                <div>
                                    <b>Id:</b>{index} <b>Username:</b>  {human?.clientUsername || human?.manufacturerUsername}, <b>Name:</b>  {human?.name}, <b>address: </b> {human?.Addresses[0]?.street || "Null"},  <b>FullAddress:</b>  {JSON.stringify(human?.Addresses)} ,
                                    {/* {human?.Addresses?.building} {human?.Addresses?.city}{human?.Addresses?.flat},{human?.Addresses?.lat} {human?.Addresses?.lon}{human?.Addresses?.street} */}


                                </div>
                                <button>delete</button>
                            </div>
                        ))}
                    </div>

                    <DataTable />


                </>
            )}


        </div>

    );
}

export default List;