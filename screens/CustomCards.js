import React from 'react';
import {StyleSheet, Text, View, Image, Button, ActivityIndicator, FlatList, SafeAreaView, Alert} from 'react-native';
import {getCards} from '../component/API';
import {CheckBox} from 'react-native-elements';

class CustomCards extends React.Component {
    cards = this.props.route.params.cards
    update = this.props.route.params.update
    state = {
        allCards: [],
        loading: true,
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            headerLeft: () => (
                <Button onPress={() => {
                    this.update([this.cards, []])
                    this.props.navigation.navigate("Explore Filter")
                }}
                        title= "Back"
                />)
        })

        if (this.state.loading) {
            getCards(this.onCardsReceived)
            this.setState({loading: false})
        }
    }

    onCardsReceived = (allCards) => {
        allCards.map(item => {
            if (this.cards.includes(item.id)) {
                item.isSelect = true
                const index = this.state.allCards.findIndex(
                    doc => item.id === doc.id
                );
                this.state.allCards[index] = item;
                this.setState({allCards: this.state.allCards})
            } else {
                item.isSelect = false
            }
            return item
        })
        this.setState(prevState => ({
            allCards: prevState.allCards = allCards
        }))
    }

    selectItem = item => {
        if (item.isSelect) {
            this.cards = this.cards.filter(card => card !== item.id)
        } else {
            this.cards.push(item.id)
        }
        item.isSelect = !item.isSelect
        const index = this.state.allCards.findIndex(
            doc => item.id === doc.id
        );
        this.state.allCards[index] = item
        this.setState({
            allCards: this.state.allCards,
        });
        console.log(this.cards)
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size='large'/>
                </View>)
        }

        return (
            <SafeAreaView style={styles.container}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.description}>Check cards that you want to see deals associated with it!</Text>
                </View>
                <Text>(Tap checkbox to add/remove cards)</Text>
                <FlatList
                    data={this.state.allCards}
                    renderItem={({item}) => this.renderItem(item)}
                    keyExtractor={item => item.id}/>
            </SafeAreaView>

        )
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


}

export default CustomCards;

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