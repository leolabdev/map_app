import {useState} from "react";
import classes from "./ListItem.module.css";
import MyModal from "../UI/Modal/MyModal";

/**
 * ListItem is element to HumanList. Provides private functions to removeHuman and open and close Modal
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function ListItem(props) {
    const [modal, setModal] = useState(false);
    let human = props.human;
    /**
     * Sets modal to true
     */
    function openModal(){
        setModal(true)
    }
    /**
     * Sets modal to false
     */
    function closeModal(){
        setModal(false)
    }
    /**
     * Asks parent to remove human from database, using props
     */
    function removeHuman(){
        closeModal();
        props.removeHuman(human?.manufacturerUsername || human?.clientUsername);
    }
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