import React, {useState, useEffect} from 'react';
import {ActivityIndicator, StyleSheet, Text, View, TouchableOpacity, FlatList, Image} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import firebaseDb from '../firebase/firebaseDb';
import BlueButton from "../component/BlueButton";
import Toast from 'react-native-simple-toast';

import {YellowBox} from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
    if (message.indexOf('Setting a timer') <= -1) {
        _console.warn(message);
    }
};

function Home({navigation}) {
    const [shops, setShops] = useState([]);
    const userId = firebaseDb.auth().currentUser.uid
    const [isLoading, setisLoading] = useState(true)
    const [fav, setFav] = useState([])

    const getData = () => {
        firebaseDb.firestore().collection('users').doc(userId).get()
            .then(snapshot => {
                setFav(snapshot.data().fav)
                return snapshot.data().fav
                if (snapshot.exists) {
                    fav = snapshot.data().fav
                    return fav
                } else {
                    return null;
                }
            })
            .then(fav => {
                if (fav === null) {}
                else {
                    global.allShops = []
                    let result = [];
                    firebaseDb.firestore().collection('shops').get()
                        .then(snapshot => {
                            snapshot.docs.map(doc => {
                                global.allShops.push(doc.data())
                                if (fav.includes(doc.id)) {
                                    result.push(doc.data())
                                }
                            })
                        }).then(() => {
                        setShops(result)
                        Toast.show("Done refreshing")
                    })
            })
    }

    useEffect(() => {
        if (!isLoading) {
            getData()
        }

        return () => {
            setisLoading(true)
        }
    })

    if (!isLoading) {
        console.log("Loading");
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large'/>
            </View>)
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.textContainer}
                              onPress={() => navigation.navigate('All Shops')}>
                <Text style={styles.allShops}>All shops</Text>
            </TouchableOpacity>
            <Text style={styles.favourites}> Favourites </Text>

            <BlueButton onPress={() => {
                getData();
                Toast.show("Refreshing...")
            }}
            >
                Refresh
            </BlueButton>

            {fav.length === 0 &&
            <Text> Start adding your favourite stores! </Text>
            }

            {fav.length > 0 &&
            <FlatList
                data={shops}
                renderItem={({item}) => (
                    <TouchableOpacity style={styles.itemContainer} onPress={() => navigation
                        .navigate('Shop Details', {
                            shop: item
                        })}>
                        <View style={{alignItems: 'flex-end', flex: 0.2}}>
                            <Image style={styles.logo}
                                   source={{uri: item.logo}}/>
                        </View>
                        <Text style={styles.name}>{item.shopName}</Text>
                        <MaterialCommunityIcons name="star" size={15}/>
                        <Text>{item.rating}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.shopName}
                // refreshing = {isLoading}
                // onRefresh = {getData()}
            />
            }
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
        paddingVertical: 15,
    },
    allShops: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    },
    favourites: {
        fontSize: 20,
        fontStyle: 'italic',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    itemContainer: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 16,
        width: 350,
        height: 100,
        marginTop: 20,
        marginVertical: 10,
        paddingVertical: 10,
    },
    logo: {
        resizeMode: 'center',
        width: 70,
        height: 70,
    }
});