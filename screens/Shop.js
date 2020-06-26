import React, {useEffect, useState} from 'react';
import {TouchableOpacity, FlatList, StyleSheet, Text, View, Image, ActivityIndicator, ScrollView} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import BlueButton from "../component/BlueButton";
import firebaseDb from '../firebase/firebaseDb';
import {Toast} from 'native-base';

function isEquivalent(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    bProps.push("letter")
    b["letter"] = a["letter"]

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if (JSON.stringify(a[propName]) !== JSON.stringify(b[propName])) return false;
    }

    return true;
}


function Shop({navigation, route}) {
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
                    if (isEquivalent(shop, doc.data())) {
                        setshopId(doc.id)
                    }
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
        <View style = {styles.container}>
        {deals.length === 0 &&
        <ScrollView>
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
                        <View style={{padding: 5}}>
                            <MaterialCommunityIcons name="star" size={20}/>
                        </View>
                    </View>
                    <Text style={styles.info}>Description: {shop.description} </Text>
                </View>

                <Text style={styles.header}>On-going Deals</Text>
                
                    
                    <View>
                        <View style={styles.itemContainer}>
                            <Text style={styles.info}>No deals for now...</Text>
                        </View>
                    </View>

                    {!fav.includes(shopId) && <BlueButton onPress={() => {
                    userDoc.update({
                        fav: firebaseDb.firestore.FieldValue.arrayUnion(shopId)
                    })
                    setUpdate(true);
                    Toast.show({text:"Added", type:"success", textStyle:{textAlign:"center"}});
                }
                }>
                    Add to Favourites!
                </BlueButton>}

                {fav.includes(shopId) && <BlueButton onPress={() => {
                    userDoc.update({
                        fav: firebaseDb.firestore.FieldValue.arrayRemove(shopId)
                    })
                    setUpdate(true);
                    Toast.show({text:"Removed", type:"danger", textStyle:{textAlign:"center"}});
                }}>
                    Remove from Favourites
                </BlueButton>}
                </View>
                </ScrollView>}

            {deals.length > 0 && 
            <View style={styles.container}>
                <FlatList
                ListHeaderComponent = {
                <View style = {styles.container}>
                    <Image style={styles.logo}
                        source={{uri: shop.logo}}/>
                    <Text style={styles.shopName}>{shop.shopName}</Text>
                    <View style={styles.itemContainer}>
                        <Text style={styles.info}>Type of Food: {shop.type} </Text>
                        <Text style={styles.info}>Opening Hours: {shop.openingHrs} </Text>
                        <Text style={styles.info}>Contact Number: {shop.contact} </Text>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.info}>Rating: {shop.rating} </Text>
                            <View style={{padding: 5}}>
                                <MaterialCommunityIcons name="star" size={20}/>
                            </View>
                        </View>
                        <Text style={styles.info}>Description: {shop.description} </Text>
                    </View>
                    <Text style={styles.header}>On-going Deals</Text>
                </View>}
                data={deals.map(deal => {
                    deal.name = shop.shopName
                    deal.logo = shop.logo
                    return deal
                })}
                renderItem={({item}) => (
                    <TouchableOpacity style={styles.itemContainer} onPress={() => navigation
                        .navigate('Deal Details', {
                            deal: item
                        })}>
                        <View style={{alignItems: 'flex-end', flex: 0.2}}>
                            <Image style={styles.image}
                                source={{uri: item.image}}/>
                        </View>
                        <Text style={styles.name}>{item.title}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.image}
                ListFooterComponent = {
                    <View>
                        {!fav.includes(shopId) && 
                        <BlueButton onPress={() => {
                            userDoc.update({
                            fav: firebaseDb.firestore.FieldValue.arrayUnion(shopId)
                            })
                            setUpdate(true);
                            Toast.show({text:"Added", type:"success", textStyle:{textAlign:"center"}});
                        }}>
                        Add to Favourites!
                        </BlueButton>}
    
                        {fav.includes(shopId) && <BlueButton onPress={() => {
                            userDoc.update({
                            fav: firebaseDb.firestore.FieldValue.arrayRemove(shopId)
                            })
                            setUpdate(true);
                            Toast.show({text:"Removed", type:"danger", textStyle:{textAlign:"center"}});
                        }}>
                        Remove from Favourites
                        </BlueButton>}
                    </View>}
                />
            </View>}
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
        resizeMode: 'contain',
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
    info: {
        fontSize: 15,
        paddingVertical: 5,
    },
    header: {
        fontSize: 20,
        fontStyle: 'italic',
    },
    dealHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingVertical: 5,
    },
    dealBanner: {
        width: 300,
        height: 250,
        paddingVertical: 5,
        resizeMode: 'contain',
    }
});