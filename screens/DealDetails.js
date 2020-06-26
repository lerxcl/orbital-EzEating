import React, { useEffect } from 'react';
import {FlatList, StyleSheet, Text, View, Image, ScrollView} from "react-native";
import firebaseDb from '../firebase/firebaseDb';

function DealDetails({route}) {
    const {deal} = route.params;
    const [cardinfo, setCardInfo] = React.useState([])

    useEffect (() => {
        if (deal.cards.length !== 0) {
        deal.cards.map(card => {
        firebaseDb.firestore().collection('cards').doc(card).get().then(snapshot => {
            let obj = {
                id: card,
                name: snapshot.data().name,
                image: snapshot.data().image,
            }
            return obj
        })})
        console.log(deal.cards)
    }})
            
            

    return (
        <View>
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
            ListHeaderComponent = {
                <View style={styles.container}>
                    <Image style={styles.logo} source={{uri: deal.logo}}/>
                    <Text style={styles.dealHeader}>{deal.name}</Text>
                    <Text style={styles.dealHeader}>{deal.title}</Text>
                    <Image style={styles.dealBanner} source={{uri: deal.image}}/>
                    <Text style={styles.info}>{deal.description}</Text>
                </View>
            }
            data = {cardinfo}
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
        width: 70,
        height: 70,
    },
    name: {
        fontSize: 12,
        fontWeight: 'bold',
        justifyContent: 'center',
        flexDirection: 'column',
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