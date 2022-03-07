import React, {Component} from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'




class DropList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            options: ["Lahti","Tampere","Helsinki"]
        }
    }
    render() {

        return (
            <select>{this.state.options.map((option, index) => <option key={index}>{option}</option>)}</select>

        )

    }


}
export default DropList