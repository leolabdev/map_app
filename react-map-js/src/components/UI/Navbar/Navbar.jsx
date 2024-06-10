import { AppBar, Toolbar, Typography} from '@material-ui/core';
import { Link } from 'react-router-dom'

import useStyles from './styles'
import {RoutePaths} from "../../../shared/router/RoutePaths";


const Navbar = () => {

    const classes = useStyles();


    return (
        <AppBar position="static">
            <Toolbar className={classes.toolbar}>
                <Typography variant="h5" className={classes.title}>
                    Map App
                </Typography>

                <Typography variant="h5" className={classes.navMenu}>
                    <span> <Link className={classes.navItem} to={RoutePaths.registration}>Registration</Link></span>
                    <span> <Link className={classes.navItem} to={RoutePaths.home}>Map</Link></span>
                    <span><Link className={classes.navItem} to={RoutePaths.about}>About</Link></span>
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;