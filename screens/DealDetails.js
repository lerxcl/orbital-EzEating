import React, {useEffect} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, Text, View, Image, ScrollView} from "react-native";
import firebaseDb from '../firebase/firebaseDb';

function DealDetails({route}) {
    const {deal} = route.params;
    const [cardinfo, setCardInfo] = React.useState([])
    const [loading, setLoading] = React.useState(true);

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
        if (loading && deal.cards.length !== 0 && deal.methods.length === 0) {
            getCards().then(result => setCardInfo(result))
        } else if (loading && deal.cards.length === 0 && deal.methods.length !== 0) {
            getMethods().then(result => setCardInfo(result))
        } else if (loading && deal.cards.length !== 0 && deal.methods.length !== 0) {
            getCards().then(result1 => {
                getMethods().then(result2 => setCardInfo(result1.concat(result2)))
            })
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
            <ScrollView contentContainerStyle = {{alignItems: 'center'}}>
                <Image style={styles.logo} source={{uri: deal.logo}}/>
                <Text style={styles.dealHeader}>{deal.name}</Text>
                <Text style={styles.dealHeader}>{deal.title}</Text>
                <Image style={styles.dealBanner} source={{uri: deal.image}}/>
                <Text style={styles.info}>{deal.description}</Text>
                <Text style = {{marginTop: 20, marginBottom: 10}}>Deal is only applicable with:</Text>
                <FlatList
                    horizontal = {true}
                    data={cardinfo}
                    renderItem={({item}) => (
                    <View style={{flexDirection: 'row', marginBottom: 20, alignItems: 'center', justifyContent: 'center'}}>
                        <Image style={styles.image} source={{uri: item.image}}/>
                    </View>
                    )}
                    keyExtractor={item => item.id}
                />
            </ScrollView>}
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
    image: {
        resizeMode: 'center',
        width: 100,
        height: 70,
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