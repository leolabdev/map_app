import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
    paper: {
        padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100px',
    },
    mapContainer: {
        height: '90.8vh', width: '100%',
    },
    markerContainer: {
        position: 'absolute', transform: 'translate(-50%, -50%)', zIndex: 1, '&:hover': { zIndex: 2 },
    },
    pointer: {
        cursor: 'pointer',
    },
    showRouteButton:{
        zIndex: 999,
             position: "absolute",
             left: "10px",
             top: "170px",
             backgroundColor: "white"
    },
    summaryOutput:{
        zIndex: 999,
            position: "absolute",
             left: "10px",
             top: "210px",
             backgroundColor: "white",
             minHeight:"100px",
             minWidth: "100px"

    }
}));