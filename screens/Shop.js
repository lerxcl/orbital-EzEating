import React from 'react';
import {StyleSheet, Text, View, Image} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

function Shop({route}) {
    const {shop} = route.params;
    const deals = shop.deals;

    return (
        <View style={styles.container}>
            <Image style={styles.logo}
                   source={{uri: shop.logo}}/>
            <Text style={styles.shopName}>{shop.shopName}</Text>
            <View style={styles.itemContainer}>
                <Text style={styles.info}>Type of Food: {shop.type} </Text>
                <Text style={styles.info}>Opening Hours: {shop.openingHrs} </Text>
                <Text style={styles.info}>Contact Number: {shop.contact} </Text>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.info}>Rating: {shop.rating} </Text>
                    <MaterialCommunityIcons name="star" size={20}/>
                </View>
                <Text style={styles.info}>Description: {shop.description} </Text>
            </View>

            <Text style={styles.header}>On-going Deals</Text>
            <View style={styles.itemContainer}>
                {deals.map(deal => <Text style={styles.info}>{deal} </Text>)}
            </View>
        </View>
    )
}

export default Shop;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shopName: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    logo: {
        resizeMode: 'center',
        width: 150,
        height: 150,
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
    },
    info: {
        fontSize: 15
    },
    header: {
        fontSize: 20,
        fontStyle: 'italic',
    }
});