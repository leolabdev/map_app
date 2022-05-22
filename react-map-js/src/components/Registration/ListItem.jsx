import React, {useEffect, useState} from "react";
import classes from "./ListItem.module.css";
import MyModal from "../UI/Modal/MyModal";

function ListItem(props) {
    const [modal, setModal] = useState(false);
    let human = props.human;

    function openModal(){
        setModal(true)
    }
    function closeModal(){
        setModal(false)
    }
    function removeHuman(){
        closeModal();
        props.removeHuman(human?.manufacturerUsername || human?.clientUsername);
    }
    useEffect(() => {

    },[])
    return (
        <div>
            <MyModal className={classes.modal} visible={modal} setVisible={setModal}>
                <div className={classes.modal}>
                    <h1>{human?.manufacturerUsername || human?.clientUsername}</h1>
                    <p>Username: {human?.clientUsername || human?.manufacturerUsername}</p>
                    <p>Name: {human?.name}</p>
                    <p>Address: {human?.Addresses[0]?.street} {human?.Addresses[0]?.building}</p>
                    <p>City: {human?.Addresses[0]?.city} </p>
                    <p>Coordinates: {human?.Addresses[0]?.lat}, {human?.Addresses[0]?.lon}</p>
                    <div className={classes.controls} >
                        <button className={classes.deleteButton} onClick={removeHuman}>Delete</button>
                        <button className={classes.closeButton}  onClick={closeModal}>close</button>
                    </div>
                </div>
            </MyModal>
            <div className={classes.content} onClick={openModal}>
                <h2>{human?.manufacturerUsername || human?.clientUsername}</h2>
                <p>{human?.name} {human?.Addresses[0]?.street} {human?.Addresses[0]?.building}, {human?.Addresses[0]?.city} </p>
            </div>
        </div>
    );
}

export default ListItem;