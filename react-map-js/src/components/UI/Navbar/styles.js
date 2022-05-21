import { makeStyles } from '@material-ui/core/styles';


export default makeStyles((theme) => ({
    toolbar: {
        display: 'flex', justifyContent: 'space-between'
    },
    title: {

    },
    navMenu: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '15px'
    },
    navItem: {
        textDecoration: 'none',
        color: 'white',
        "&:hover": {
            color: "red"
        }
    }
}));