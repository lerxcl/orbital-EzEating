import React from 'react';
import {StyleSheet, Text, View, Image, ScrollView} from "react-native";

function MerchantDealDetails({route}) {
    const {deal} = route.params;

    return (
        <ScrollView>
            <View style={styles.container}>
                <Image style={styles.logo} source={{uri: deal.logo}}/>
                <Text style={styles.dealHeader}>{deal.name}</Text>
                <Text style={styles.dealHeader}>{deal.title}</Text>
                <Image style={styles.dealBanner} source={{uri: deal.image}}/>
                <Text style={styles.info}>{deal.description}</Text>
            </View>
        </ScrollView>
    )
}

export default MerchantDealDetails;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        resizeMode: 'contain',
        width: 100,
        height: 150,
    },
    dealBanner: {
        width: 350,
        height: 300,
        resizeMode: 'contain',
    },
    dealHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 40,
        textAlign: 'center',
    },
    info: {
        fontSize: 15,
        paddingHorizontal: 40,
    },
})