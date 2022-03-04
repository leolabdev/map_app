import React, { useState, useEffect } from "react";
import { Text, View, Button, StyleSheet } from "react-native";


export function Counter() {


    //we take outside variables from useState , (1) means set start value = 1 
    const [count, setCount] = useState(1);
    const [data, setData] = useState("it's ok")

    useEffect(() => {
        console.warn("test useEffect", count);
        if (count == 5) { setData("it isn't ok, value > 5") }
    })

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Count: {count}</Text>
            <Button title="+" onPress={() => setCount(count + 1)}></Button>
            <Text style={styles.text}>Data: {data}</Text>
        </View>)

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: "center",
        padding: "16px"
    },
    text: {
        alignSelf: "center",
        paddingRight: "8px"
    }
})