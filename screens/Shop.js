import React, {useEffect, useState, useCallback} from 'react';
import {StyleSheet, Text, View, Image, ActivityIndicator} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import BlueButton from "../component/BlueButton";
import firebaseDb from '../firebase/firebaseDb';
import Toast from 'react-native-simple-toast';

function isEquivalent(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    if (aProps.includes("letter")) {
        bProps.push("letter")
        b["letter"] = a["letter"]
    }
    if (aProps.length !== bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if (propName === "deals") {
            if (!isEquivalent(a[propName], b[propName])) {
                return false
            }
        } else if (a[propName] !== b[propName]) {
            return false;
        }
    }
    return true;
}


function Shop({route}) {
    const {shop} = route.params;
    const deals = shop.deals;
    const [fav, setFav] = useState([])
    const [shopId, setshopId] = useState(0)
    const userId = firebaseDb.auth().currentUser.uid
    const userDoc = firebaseDb.firestore().collection('users').doc(userId)
    const [isLoading, setisLoading] = useState(false)
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        if (!isLoading || update) {
            firebaseDb.firestore().collection('shops').get().then(snapshot =>
                snapshot.forEach(doc => {
                    if (isEquivalent(shop, doc.data())) setshopId(doc.id)
                }))

            userDoc.get().then(snapshot => setFav(snapshot.data().fav))
        }

        return () => {
            setisLoading(true)
            setUpdate(false)
        }
    })

    if (!isLoading)
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large'/>
            </View>)

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
                {deals.map(deal => <Text style={styles.info} key={deal}>{deal} </Text>
                )}
            </View>

            {!fav.includes(shopId) && <BlueButton onPress={() => {
                userDoc.update({
                    fav: firebaseDb.firestore.FieldValue.arrayUnion(shopId)
                })
                Toast.show("Added");
                setUpdate(true);
            }
            }>
                Add to Favourites!
            </BlueButton>}

            {fav.includes(shopId) && <BlueButton onPress={() => {
                userDoc.update({
                    fav: firebaseDb.firestore.FieldValue.arrayRemove(shopId)
                })
                Toast.show("Removed");
                setUpdate(true);
            }}>
                Remove from Favourites
            </BlueButton>}

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