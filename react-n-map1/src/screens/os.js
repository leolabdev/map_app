import React, { Component } from "react";
import { Platform, View, Text } from "react-native";

export class OS extends Component {

    // constructor(props) {
    //     super(props);
    //     this.os = Platform.OS
    // }


    render() {

        return (<View>

            <Text>OS: {Platform.OS}</Text>


        </View>)
    }
}