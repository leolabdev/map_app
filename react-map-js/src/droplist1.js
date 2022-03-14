import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'




const DropList1 = () => {
    const options = [
        { label: 'Lahti', value: 'Lahti' },
        { label: 'Helsinki', value: 'Helsinki' },
        { label: 'Tampere', value: 'Tampere' },
    ];

    const [value, setValue] = useState('Lahti');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <>
            <select value={value} onChange={handleChange}>
                {options.map((option) => (
                    <option value={option.value}>{option.label}</option>
                ))}
            </select>


            <p>We go to {value}!</p>
        </>
    );
};
export default DropList1