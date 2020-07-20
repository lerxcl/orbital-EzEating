import React from 'react';
import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

function UserHistory({navigation, route}) {
    const {deals, refresh} = route.params;

    return (
        <View style={styles.container}>
        <FlatList
            data={deals}
            renderItem={({item}) => (
                <TouchableOpacity style={styles.itemContainer} onPress={() => navigation
                    .navigate('Deal Details', {
                        deal: item,
                        refresh: refresh,
                    })}>
                    <View style={{alignItems: 'flex-end', flex: 0.2}}>
                        <Image style={styles.image}
                               source={{uri: item.image}}/>
                    </View>
                    <Text style={styles.name}>{item.title}</Text>
                </TouchableOpacity>
            )}
            keyExtractor={item => item.image}/>
        </View>
    )
}

export default UserHistory;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemContainer: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 16,
        width: 350,
        marginTop: 20,
        marginVertical: 10,
        paddingVertical: 10,
        alignItems: 'center'
    },
    image: {
        resizeMode: 'center',
        width: 70,
        height: 70,
    },
    name: {
        fontSize: 12,
        fontWeight: 'bold',
        justifyContent: 'center',
        flexDirection: 'column',
    },
});