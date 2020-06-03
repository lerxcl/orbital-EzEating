import React from 'react';
import {Alert, Image, StyleSheet, TextInput, Text, View, KeyboardAvoidingView, TouchableOpacity} from "react-native";

class Dashboard extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>
                    All shops
                </Text>
                <Text> Favourites </Text>
                <Text style={styles.text}>
                    Shop ABC
                </Text>
                <Text style={styles.text}>
                    Shop 123
                </Text>
      </View>
      )
    }
}

export default Dashboard;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    text: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 16,
        width: 300,
        fontSize: 16,
        marginVertical: 10,
        paddingVertical: 10
    },
});