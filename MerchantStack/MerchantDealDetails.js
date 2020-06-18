import React from 'react';
import {StyleSheet, Text, View, Image, ScrollView} from "react-native"; 
import firebaseDb from "../firebase/firebaseDb"

function MerchantDealDetails({route}) {
    const {deal} = route.params;
    const userDoc = firebaseDb.firestore().collection("merchants").doc(firebaseDb.auth().currentUser.uid).get()
    const logo = userDoc.then(snapshot => {return snapshot.data().logo})
    const shopName = userDoc.then(snapshot => {return snapshot.data().shopName})

    return (
        <View>
            <Text>Deal details</Text>
        </View>
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