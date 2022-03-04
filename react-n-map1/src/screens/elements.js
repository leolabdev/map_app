import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

export class Elements extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Button
                    raised
                    icon={{ name: 'home', size: 32 }}
                    buttonStyle={{ backgroundColor: '#ff4f00', borderRadius: 10 }}
                    textStyle={{ textAlign: 'center' }}
                    title={`Get Hello`}
                    onPress={() => alert('Hello')}
                />
            </View>
        );
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
