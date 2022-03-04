import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";




export class MapR extends Component {


    render() {

        return (<View style={styles.container}>

            <Text>OS: Map here</Text>


        </View>)
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    }
});

