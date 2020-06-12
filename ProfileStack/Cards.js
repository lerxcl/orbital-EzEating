import React from 'react';
import { Text, View, SafeAreaView, StyleSheet, Alert, TouchableOpacity, FlatList} from 'react-native';
import firebaseDb from '../firebase/firebaseDb';
import {getCards} from '../component/API';


class Cards extends React.Component {
    state = {
        allCards: [],
    }
    userId = firebaseDb.auth().currentUser.uid
    userDoc = firebaseDb.firestore().collection('users').doc(this.userId)

    componentDidMount() {
        getCards(this.onCardsReceived).then(() => {
            this.getData()})
    }

    onCardsReceived = (allCards) => {
        allCards.map(item => {
            item.isSelect = false
            item.selectedClass = styles.itemContainer
            return item
        })
        this.setState(prevState => ({
            allCards: prevState.allCards = allCards
        }))}
    
    getData = () => {
        this.userDoc.get()
            .then(snapshot => {
                let cards = snapshot.data().cards
                return cards
            })
            .then(cards => {
                for (var i = 0; i < this.state.allCards.length; i++) {
                    if (cards.includes(this.state.allCards[i].id)) {
                        this.selectItem(this.state.allCards[i])
                    }
                }
            })
    }

    selectItem = item => {
        if (item.isSelect) {
            this.userDoc.update({
                cards: firebaseDb.firestore.FieldValue.arrayRemove(item.id)})
        } else {
            this.userDoc.update({
                cards: firebaseDb.firestore.FieldValue.arrayUnion(item.id)})
        }
        item.isSelect = !item.isSelect
        item.selectedClass = item.isSelect ? styles.selected : styles.itemContainer;
            
        const index = this.state.allCards.findIndex(
            doc => item.id === doc.id
        );
        
        this.state.allCards[index] = item

        this.setState({
          allCards: this.state.allCards,
        });
      }


    renderItem = item =>
      <TouchableOpacity
        style={[styles.itemContainer, item.selectedClass]}      
        onPress={() => Alert.alert(
            'Add/Remove Card',
            'Are you sure you want to add/remove card?',
            [
              {text: 'NO', onPress: () => {}},
              {text: 'YES', onPress: () => this.selectItem(item)},
            ]
        )}
      >
      <Text style={styles.name}>  {item.name}  </Text>
    </TouchableOpacity>
    
    render() {
        const {allCards} = this.state

        return (
            <SafeAreaView style = {styles.container}>
                <View style = {{flexDirection: 'row'}}>
            <Text style = {styles.description} >Linked cards are </Text>
            <Text style = {styles.highlight}>highlighted</Text> 
            </View>
            <Text>(Click to add/remove cards)</Text>
            <FlatList
                data={allCards}
                renderItem={({item}) => this.renderItem(item)}
                keyExtractor={item => item.id}/>
            </SafeAreaView>
            )
    }
}

export default Cards;

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
    highlight: {
        fontSize: 18,
        backgroundColor: "#b8d5cd"
    },
    itemContainer: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 16,
        width: 300,
        marginTop: 20,
        marginVertical: 10,
        paddingVertical: 10,
        alignContent: 'center'
    },
    selected: {
        backgroundColor: "#b8d5cd"
    },
})