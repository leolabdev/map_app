import React, { useState } from "react";
import { AppBar, Toolbar, Typography, InputBase, Box } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search'
import { Link } from 'react-router-dom'

import useStyles from './styles'


const Navbar = () => {

    const classes = useStyles();


    return (
        <AppBar position="static">


            <Toolbar className={classes.toolbar}>
                
                
                <Typography variant="h5" className={classes.title}>
                    Map App
                </Typography>

                <Typography variant="h5" className={classes.navMenu}>
                    <span><Link className={classes.navItem}  to="/about">About</Link></span>
                    <span> <Link className={classes.navItem} to="/">Map</Link></span>
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;