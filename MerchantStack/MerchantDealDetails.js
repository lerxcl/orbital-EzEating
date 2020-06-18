import React from 'react';
import {StyleSheet, Text, View, Image, ScrollView} from "react-native"; 
import firebaseDb from "../firebase/firebaseDb"

function MerchantDealDetails({route}) {
    const {deal} = route.params;
    const userDoc = firebaseDb.firestore().collection("merchants").doc(firebaseDb.auth().currentUser.uid).get()
    const logo = userDoc.then(snapshot => {return snapshot.data().logo})
    const shopName = userDoc.then(snapshot => {return snapshot.data().shopName})

    /*return (

        <ScrollView>                
                {logo ? 
                <Image style={styles.logo} source={{uri: deal.logo}}/>
                : <Image style={styles.logo} source = {require('../images/Portrait_Placeholder.png')}/>
                }
                {shopName ? 
                <Text style={styles.dealHeader}>{shopName}</Text>
                : <Text style={styles.dealHeader}>[please enter shop name]</Text>
                }
                {deal ? 
                <View>
                <Text style={styles.dealHeader}>{deal.title}</Text>
                <Image style={styles.dealBanner} source={{uri: deal.image}}/>
                <Text style={styles.info}>{deal.description}</Text>
                </View>
                : 
                <View> 
                <Text style={styles.dealHeader}>[please enter deal title]</Text>
                <Image style={styles.dealBanner} source = {require('../images/Portrait_Placeholder.png')}/>
                <Text style={styles.info}>[please enter deal description]</Text>
                </View>
                }
        </ScrollView>
    )*/

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