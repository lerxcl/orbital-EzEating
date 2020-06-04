import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from "react-native";

function Home({navigation}) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.textContainer}
                              onPress={() => navigation.navigate('All Shops')}>
                <Text style={styles.text}>All shops</Text>
            </TouchableOpacity>
            <Text> Favourites </Text>
            <Text style={styles.textContainer}>
                Shop ABC
            </Text>
            <Text style={styles.textContainer}>
                Shop 123
            </Text>
        </View>
    )
}

export default Home;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    textContainer: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 16,
        width: 300,
        fontSize: 16,
        marginVertical: 10,
        paddingVertical: 10
    },
    text: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign:'center',
    }
});