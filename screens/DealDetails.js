import React, {useEffect} from 'react';
import {ActivityIndicator, FlatList, Button, StyleSheet, Text, View, Image, ScrollView} from "react-native";
import firebaseDb from '../firebase/firebaseDb';
import {Toast} from "native-base";

function DealDetails({route, navigation}) {
    const {deal} = route.params;
    const [cardinfo, setCardInfo] = React.useState([])
    const [loading, setLoading] = React.useState(true);
    const numColumns = 3
    const userId = firebaseDb.auth().currentUser.uid
    const userDoc = firebaseDb.firestore().collection('users').doc(userId)

    const getCards = async () => {
        let cards = [];
        let snapshot = await firebaseDb.firestore().collection('cards').get()

        snapshot.forEach((doc) => {
            if (deal.cards.includes(doc.id)) {
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
            if (deal.methods.includes(doc.id)) {
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
        if (loading) {
            firebaseDb.firestore().collection('users').doc(userId).get()
                .then(snapshot => {
                    const saved = snapshot.data().savedDeals.includes(deal.id)

                    navigation.setOptions({
                        headerRight: saved
                            ? () => (
                                <Button onPress={() => {
                                    userDoc.update({
                                        savedDeals: firebaseDb.firestore.FieldValue.arrayRemove(deal.id)
                                    })
                                    setLoading(true)
                                    Toast.show({text: "Removed", type: "danger", textStyle: {textAlign: "center"}});
                                }}
                                        title="Remove"
                                        color="#ff3617"/>
                            )
                            : () => (
                                <Button onPress={() => {
                                    userDoc.update({
                                        savedDeals: firebaseDb.firestore.FieldValue.arrayUnion(deal.id)
                                    })
                                    setLoading(true)
                                    Toast.show({text: "Added", type: "success", textStyle: {textAlign: "center"}});
                                }}
                                        title="Save"
                                        color="#06ab00"/>
                            ),
                    });
                })

            if (deal.cards.length !== 0 && deal.methods.length === 0) {
                getCards().then(result => setCardInfo(result))
            } else if (deal.cards.length === 0 && deal.methods.length !== 0) {
                getMethods().then(result => setCardInfo(result))
            } else if (deal.cards.length !== 0 && deal.methods.length !== 0) {
                getCards().then(result1 => {
                    getMethods().then(result2 => setCardInfo(result1.concat(result2)))
                })
            } else {
                setLoading(false)
            }
        }

        return () => setLoading(false)
    })

    return (
        <View>
            {loading &&
            <View style={styles.container}>
                <ActivityIndicator size='large'/>
            </View>}


            {cardinfo.length === 0 &&
            <ScrollView>
                <View style={styles.container}>
                    <Image style={styles.logo} source={{uri: deal.logo}}/>
                    <Text style={styles.dealHeader}>{deal.name}</Text>
                    <Text style={styles.dealHeader}>{deal.title}</Text>
                    <Image style={styles.dealBanner} source={{uri: deal.image}}/>
                    <Text style={styles.info}>{deal.description}</Text>
                    <Text style={{marginTop: 20, fontSize: 16}}>-Deal is not associated with any card/method!-</Text>
                </View>
            </ScrollView>
            }

            {cardinfo.length !== 0 &&
            <FlatList
                ListHeaderComponent={
                    <View style={{alignItems: 'center'}}>
                        <Image style={styles.logo} source={{uri: deal.logo}}/>
                        <Text style={styles.dealHeader1}>{deal.name}</Text>
                        <Text style={styles.dealHeader2}>{deal.title}</Text>
                        <Image style={styles.dealBanner} source={{uri: deal.image}}/>
                        <Text style={styles.info}>{deal.description}</Text>
                        <Text style={{marginTop: 20, marginBottom: 10}}>Deal is only applicable with:</Text>
                    </View>
                }
                contentContainerStyle={{alignItems: 'center'}}
                numColumns={numColumns}
                data={cardinfo}
                renderItem={({item}) => (
                    <View>
                        <Image style={styles.image} source={{uri: item.image}}/>
                    </View>
                )}
                keyExtractor={item => item.id}
            />}
        </View>

    )
}

export default DealDetails;

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
    dealHeader1: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 40,
        textAlign: 'center',
        marginTop: -30
    },
    dealHeader2: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 40,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10
    },
    info: {
        marginTop: 20,
        fontSize: 15,
        paddingHorizontal: 40,
    },
    image: {
        width: 100,
        height: 70,
        resizeMode: 'center'
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    itemContainer: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 16,
        width: 300,
        height: 100,
        paddingVertical: 10,
    },
})

/*{(deal.cards || deal.methods) &&
    <FlatList
        ListHeaderComponent = {
            <View style={styles.container}>
                <Image style={styles.logo} source={{uri: deal.logo}}/>
                <Text style={styles.dealHeader}>{deal.name}</Text>
                <Text style={styles.dealHeader}>{deal.title}</Text>
                <Image style={styles.dealBanner} source={{uri: deal.image}}/>
                <Text style={styles.info}>{deal.description}</Text>
            </View>
        }
        data = {deal.cards}
        renderItem={({item}) => (
            <View>
                <View style={{alignItems: 'flex-end', flex: 0.2}}>
                    <Image style={styles.image}
                        source={{uri: item.image}}/>
                </View>
                <Text style={styles.name}>{item.name}</Text>
            </View>
        )}
        keyExtractor={item => item.id}
    />}*/