import React, {useEffect, useState} from 'react';
import {
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    ScrollView,
    Alert
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import BlueButton from "../component/BlueButton";
import firebaseDb from '../firebase/firebaseDb';
import {Toast} from 'native-base';
import ReviewModal from "../component/ReviewModal";
import { Rating } from 'react-native-elements';
import {sub} from "react-native-reanimated";

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
    const {shop, refresh, refreshAllShops} = route.params;
    const deals = shop.deals;
    const review = {name: firebaseDb.auth().currentUser.displayName};
    const [reviewer, setReviewer] = React.useState(0);
    const [reviewed, setReviewed] = React.useState(false);
    const [overshoot, setOvershoot] = React.useState(false);
    const [rating, setRating] = useState(false);
    const [original, setOriginal] = useState(0);
    const [stars, setStars] = useState(0);
    const [fav, setFav] = useState([])
    const [shopId, setshopId] = useState(0)
    const userId = firebaseDb.auth().currentUser.uid
    const [cardinfo, setCardInfo] = React.useState([])
    const userDoc = firebaseDb.firestore().collection('users').doc(userId)
    const [isLoading, setisLoading] = useState(false)
    const [update, setUpdate] = useState(false);
    const [merchant, setMerchant] = useState(false);
    const numColumns = 3;
    const [ratingValue, setRatingValue] = useState(shop.rating)
    const [reviews, setReviews] = useState(shop.review)

    const getCards = async () => {
        let cards = [];
        let snapshot = await firebaseDb.firestore().collection('networks').get()

        snapshot.forEach((doc) => {
            if (shop.cards.includes(doc.id)) {
                let obj = {
                    id: doc.id,
                    name: doc.data().name,
                    image: doc.data().image,
                }
                cards.push(obj)
            }
        });
        return cards

    }

    const getMethods = async () => {
        let methods = [];
        let snapshot = await firebaseDb.firestore().collection('methods').get()

        snapshot.forEach((doc) => {
            if (shop.methods.includes(doc.id)) {
                let obj = {
                    id: doc.id,
                    name: doc.data().name,
                    image: doc.data().image,
                }
                methods.push(obj)
            }
        });
        return methods
    }

    useEffect(() => {
        if (!isLoading && shop.cards.length !== 0 && shop.methods.length === 0) {
            getCards().then(result => setCardInfo(result))
        } else if (!isLoading && shop.cards.length === 0 && shop.methods.length !== 0) {
            getMethods().then(result => setCardInfo(result))
        } else if (!isLoading && shop.cards.length !== 0 && shop.methods.length !== 0) {
            getCards().then(result1 => {
                getMethods().then(result2 => setCardInfo(result1.concat(result2)))
            })
        }
        if (!isLoading || update) {
            firebaseDb.firestore().collection('shops').get().then(snapshot =>
                snapshot.forEach(doc => {
                    if (isEquivalent(shop, doc.data())) {
                        console.log(doc.data().isMerchant)
                        setshopId(doc.id)
                        setMerchant(doc.data().isMerchant)
                        if (doc.data().numReviews === undefined) {
                            firebaseDb.firestore().collection('shops').doc(doc.id).update({
                                numReviews: 0,
                                rating: 0
                            })
                        } else {
                            setOriginal(doc.data().rating)
                            setReviewer(doc.data().numReviews)
                        }
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
        <View style={styles.container}>
                <FlatList
                ListHeaderComponent = {
                <View style = {styles.container}>
                    <Image style={styles.logo}
                        source={{uri: shop.logo}}/>
                    <Text style={styles.shopName}>{shop.shopName}</Text>
                    <View style={styles.itemContainer}>
                        <Text style={styles.info}>Type of Food: {shop.type} </Text>
                        <Text style={styles.info}>Average Price: Around ${shop.avgPrice} </Text>
                        <Text style={styles.info}>Opening Hours: {shop.openingHrs} </Text>
                        <Text style={styles.info}>Contact Number: {shop.contact} </Text>
                        <View style={{flexDirection: 'row'}}>
                            <View>
                                {ratingValue === 0 && <Text style={styles.info}>Rating: No reviews yet </Text>}
                                {ratingValue !== 0 && <Text style={styles.info}>Rating: {ratingValue} </Text>}
                            </View>
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
                ListEmptyComponent = {
                    <View style = {styles.itemContainer}>
                    <Text> No deals for now...</Text>
                    </View>
                }
                renderItem={({item}) => (
                    <TouchableOpacity style={styles.itemContainer} onPress={() => navigation
                        .navigate('Deal Details', {
                            deal: item,
                            refresh: () => console.log("Unable to auto update here :("),
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
                        {cardinfo.length !== 0 &&
                        <FlatList
                        ListHeaderComponent = {
                            <View style = {styles.container}>
                                <Text style = {styles.header2}>Payment Accepted</Text>
                            </View>
                        }
                        contentContainerStyle = {{alignItems: 'center'}}
                        numColumns={numColumns}
                        data={cardinfo}
                        renderItem={({item}) => (
                            <View>
                                <Image style={styles.image2} source={{uri: item.image}}/>
                            </View>
                        )}
                        keyExtractor={item => item.id}
                        />}

                        <TouchableOpacity style={styles.itemContainer} onPress={() => navigation
                        .navigate('Outlets', {shop: shop})}>
                            <Text>Outlets</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.itemContainer} onPress={() => setRating(true)}>
                            <Text>Rate the store!</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.itemContainer} onPress={() => 
                            navigation.navigate('User Reviews', {shop: reviews})}>
                            <Text>Reviews</Text>
                        </TouchableOpacity>

                        <ReviewModal
                            spinnerIsVisible = {rating}
                            starRating = {stars}
                            onStarRatingPress = {rating => {
                                setStars(rating)
                                console.log(stars)
                            }}
                            onChangeText = {(text) => {
                                review["text"] = text
                                console.log(review)
                                if (text.length > 50) {
                                    setOvershoot(true)
                                } else {
                                    setOvershoot(false)
                                }
                            }}
                            onSubmit = {() => {
                                if (overshoot) {
                                    Alert.alert('Review has too many words')
                                } else {
                                    if (stars && review["text"] !== undefined && review["text"] !== "") {
                                        if (!reviewed) {
                                            firebaseDb.firestore().collection('shops').doc(shopId).update({
                                                numReviews: firebaseDb.firestore.FieldValue.increment(1)
                                            })
                                            setReviewed(true)
                                        }
                                        review["rating"] = stars
                                        firebaseDb.firestore().collection('shops').doc(shopId).update({
                                            rating: Math.round((((original*reviewer*1.0 + stars) / (reviewer + 1)) + Number.EPSILON) * 100) / 100,
                                            review: firebaseDb.firestore.FieldValue.arrayUnion(review)
                                        }).then(() => {
                                            setRating(false)
                                            Alert.alert('Review has been submitted!')
                                            refresh(false);
                                            if (refreshAllShops !== undefined) {
                                                console.log("refresh all shops")
                                                refreshAllShops();
                                            }
                                            setRatingValue(Math.round((((original*reviewer*1.0 + stars) / (reviewer + 1)) + Number.EPSILON) * 100) / 100)
                                            reviews.push(review)
                                            setOriginal(ratingValue)
                                            setReviewer(shop.numReviews + 1)
                                        })
                                    } else {
                                        Alert.alert(
                                            'Incomplete review/rating',
                                            'Do you want to continue the review?',
                                            [
                                                {
                                                    text: 'Yes', onPress: () => {
                                                    }
                                                },
                                                {
                                                    text: 'No', onPress: () => {
                                                        setRating(false)
                                                    }
                                                }
                                            ]
                                        )
                                    }
                                }
                            }}
                        />


                        {!fav.includes(shopId) && 
                        <BlueButton style = {{marginBottom: 20, marginTop: 20}} onPress={() => {
                            userDoc.update({
                            fav: firebaseDb.firestore.FieldValue.arrayUnion(shopId)
                            })
                            if (merchant) {
                                firebaseDb.firestore().collection('shops').doc(shopId).update({
                                    favs: firebaseDb.firestore.FieldValue.increment(1)
                                })
                            }
                            setUpdate(true);
                            refresh(false);
                            Toast.show({text:"Added", type:"success", textStyle:{textAlign:"center"}});
                        }}>
                        Add to Favourites!
                        </BlueButton>}
    
                        {fav.includes(shopId) && <BlueButton style = {{marginBottom: 20, marginTop: 20, backgroundColor: 'darkred'}} onPress={() => {
                            userDoc.update({
                            fav: firebaseDb.firestore.FieldValue.arrayRemove(shopId)
                            })
                            if (merchant) {
                                firebaseDb.firestore().collection('shops').doc(shopId).update({
                                    favs: firebaseDb.firestore.FieldValue.increment(-1)
                                })
                            }
                            setUpdate(true);
                            refresh(false);
                            Toast.show({text:"Removed", type:"danger", textStyle:{textAlign:"center"}});
                        }}>
                        Remove from Favourites
                        </BlueButton>}

                    </View>}/>
                    </View>)}
                

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
    image2: {
        width: 100,
        height: 70,
        resizeMode: 'contain',
        alignSelf: 'center'
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
    header2: {
        fontSize: 20,
        fontStyle: 'italic',
        marginBottom: 10
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