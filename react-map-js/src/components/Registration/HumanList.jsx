import React, {useEffect, useState} from "react";
import classes from "./ListItem.module.css";
import ListItem from "./ListItem";
import MyModal from "../UI/Modal/MyModal";
import {getHumansData} from "../../api/humans/GetHumansData";
import {deleteHumanByUserName} from "../../api/humans/DeleteHumanByUserName";

function HumanList(props) {
    let humanstype = props.type;
    const [update, setUpdate] = useState(false);
    const [humans, setHumans] = useState(props.humans);

    useEffect(() => {
        console.log("HumanList update")
        getHumansData(props.type)
            .then((data) => {
                setHumans(data);
            })
    },[update])

    function removeHuman(username){
        deleteHumanByUserName(props.type, username).then(()=> {
            setUpdate(true);
        });
    }
    console.log("Humans:")
    console.log(humans)
    return (
        <div >{
            humans?.map((human, index) => (
            <div key={index}>
                <ListItem key={index} type={humanstype} removeHuman={removeHuman} human={human} />
            </div>
        ))
        }
        </div>
    );
}

export default HumanList;