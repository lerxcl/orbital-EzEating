import React from 'react';
import { StyleSheet, SafeAreaView, Text } from 'react-native';

class Splash extends React.Component {
    render() {
        return (
            <SafeAreaView style = {styles.container}>
            <Text>Loading...</Text>
            </SafeAreaView>
            )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
})

export default Splash;