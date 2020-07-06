import React from 'react';
import {
    Text,
    View,
    SafeAreaView,
    ActivityIndicator,
    StyleSheet,
    Alert,
    FlatList,
    Image
} from 'react-native';
import firebaseDb from '../firebase/firebaseDb';
import {getNetworks} from '../component/API';
import {CheckBox} from 'react-native-elements';

class MerchantCards extends React.Component {
    state = {
        allCards: [],
        loading: true
    }
    userId = firebaseDb.auth().currentUser.uid
    userDoc = firebaseDb.firestore().collection('shops').doc(this.userId)

    componentDidMount() {
        getNetworks(this.onCardsReceived).then(() => {
            this.getData()
        })
    }

    onCardsReceived = (allCards) => {
        allCards.map(item => {
            item.isSelect = false
            return item
        })
        this.setState(prevState => ({
            allCards: prevState.allCards = allCards
        }))
    }

    getData = () => {
        this.userDoc.get()
            .then(snapshot => {
                let cards = snapshot.data().cards
                return cards
            })
            .then(cards => {
                for (let i = 0; i < this.state.allCards.length; i++) {
                    if (cards.includes(this.state.allCards[i].id)) {
                        this.selectItem(this.state.allCards[i])
                    }
                }
                this.setState({loading: false})
            }).catch(err => console.log(err))
    }

    selectItem = item => {
        if (item.isSelect) {
            this.userDoc.update({
                cards: firebaseDb.firestore.FieldValue.arrayRemove(item.id)
            })
            // firebaseDb.firestore().collection('shops').doc(this.userId).update({
            //     cards: firebaseDb.firestore.FieldValue.arrayRemove(item.id)
            // })
        } else {
            this.userDoc.update({
                cards: firebaseDb.firestore.FieldValue.arrayUnion(item.id)
            })
            // firebaseDb.firestore().collection('shops').doc(this.userId).update({
            //     cards: firebaseDb.firestore.FieldValue.arrayUnion(item.id)
            // })
        }
        item.isSelect = !item.isSelect

        const index = this.state.allCards.findIndex(
            doc => item.id === doc.id
        );

        this.state.allCards[index] = item

        this.setState({
            allCards: this.state.allCards,
        });
    }


    renderItem = item =>
        <View>
            <CheckBox
                checked={item.isSelect}
                title={item.name}
                onPress={() => Alert.alert(
                    'Add/Remove Card',
                    'Are you sure you want to add/remove card?',
                    [
                        {
                            text: 'NO', onPress: () => {
                            }
                        },
                        {text: 'YES', onPress: () => this.selectItem(item)},
                    ]
                )}
            />
            <Image style={styles.cardImage} source={{uri: item.image}}/>
        </View>

    render() {
        const {allCards, loading} = this.state
        if (loading) {
            console.log("Loading");
            return (
                <View style={styles.container}>
                    <ActivityIndicator size='large'/>
                </View>)
        }
        return (
            <SafeAreaView style={styles.container}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.description}>Accepted cards are checked</Text>
                </View>
                <Text>(Tap checkbox to add/remove cards)</Text>
                <FlatList
                    data={allCards}
                    renderItem={({item}) => this.renderItem(item)}
                    keyExtractor={item => item.id}/>
            </SafeAreaView>
        )
    }
}

export default MerchantCards;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        alignContent: 'center'
    },
    description: {
        fontSize: 18,
    },
    cardImage: {
        width: 300,
        height: 150,
        resizeMode: 'contain',
    },
})