import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View, Image, TouchableOpacity, Button} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import BlueButton from "../component/BlueButton";
import firebaseDb from '../firebase/firebaseDb';
import {Toast} from 'native-base';

function randSelect(shopsWithDeals, count) {
    let randomDeals = [];
    let alrPicked = [];

    for (let i = 0; i < Math.min(count, 10); i++) {
        let rand = Math.floor(Math.random() * shopsWithDeals.length);
        while (alrPicked.includes(rand)) {
            rand = Math.floor(Math.random() * shopsWithDeals.length);
        }
        alrPicked.push(rand);
        randomDeals.push(shopsWithDeals[rand]);
    }
    return randomDeals;
}

class Explore extends React.Component {
    state = {
        all: null,
        picked: null,
        loading: true,
        activeIndex: 0,
        carouselRef: null,
        allDeals: false,
        personalised: true,
    }
    userId = firebaseDb.auth().currentUser.uid
    userDoc = firebaseDb.firestore().collection('users').doc(this.userId)
    userCards = []
    count = 0;

    toggleAll = () => {
        if (this.state.allDeals) {
            this.setState({allDeals: false})
        } else {
            this.setState({allDeals: true})
        }
    }

    togglePersonalised = () => {
        if (this.state.personalised) {
            this.setState({personalised: false})
        } else {
            this.setState({personalised: true})
        }
    }

    refresh = () => {
        this.getDeals();
    }

    getDeals = () => {
        if (this.state.personalised) {
            console.log("Default: personalised")
            this.count = 0;
            this.userCards = []
            this.userDoc.get()
                .then(snapshot => {

                    this.userCards.push(snapshot.data().cards)
                    this.userCards.push(snapshot.data().methods)

                    let shopsWithDeals = [...global.allShops].filter(shop => shop.deals.length !== 0)
                        .flatMap(shop => {
                            shop.deals.map(deal => {
                                deal.name = shop.shopName
                                deal.logo = shop.logo
                            })
                            return shop.deals
                        })
                        .filter(deal => {
                            if (deal.cards.length === 0 && deal.methods.length === 0) {
                                this.count++
                                return true
                            } else {
                                for (let i = 0; i < deal.cards.length; i++) {
                                    if (this.userCards[0].includes(deal.cards[i])) {
                                        return true
                                    }
                                }
                                for (let j = 0; j < deal.methods.length; j++) {
                                    if (this.userCards[1].includes(deal.methods[j])) {
                                        return true
                                    }
                                }
                                return false
                            }
                        })
                    const randomDeals = randSelect(shopsWithDeals, this.count);

                    this.setState({
                        all: shopsWithDeals,
                        picked: randomDeals,
                        loading: false,
                    });
                    Toast.show({text: "Done refreshing", type: "success", textStyle: {textAlign: "center"}})
                })
        } else if (this.state.allDeals) {
            this.count = 10;
            console.log("Unfiltered, All deals")
            let shopsWithDeals = [...global.allShops].filter(shop => shop.deals.length !== 0)
                .flatMap(shop => {
                    shop.deals.map(deal => {
                        deal.name = shop.shopName
                        deal.logo = shop.logo
                    })
                    return shop.deals
                })
            const randomDeals = randSelect(shopsWithDeals, this.count);

            this.setState({
                all: shopsWithDeals,
                picked: randomDeals,
                loading: false,
            });
            Toast.show({text: "Done refreshing", type: "success", textStyle: {textAlign: "center"}})
        }
        // TODO
        //  else, choose specific cards/methods from filter page.

    }

    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: () => (
                <Button onPress={() => {
                    this.props.navigation.navigate("Explore Filter", {
                        allDeals: this.state.allDeals,
                        personalised: this.state.personalised,
                        toggleAll: this.toggleAll,
                        togglePersonalised: this.togglePersonalised,
                        refresh: this.refresh,
                    })
                }}
                        title="Filter"
                />
            )
        })
        this.getDeals()
    }

    get pagination() {
        return (
            <Pagination
                dotsLength={this.state.picked.length}
                activeDotIndex={this.state.activeIndex}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 8,
                    marginHorizontal: 3,
                    backgroundColor: '#bc9eb2'
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
                carouselRef={this.state.carouselRef}
                tappableDots={true}
            />
        );
    }

    _renderItem = ({item, index}) => {
        return (
            <TouchableOpacity style={{
                backgroundColor: '#bc9eb2',
                borderRadius: 20,
                ...Platform.select({
                    ios: {
                        height: 500,
                    },
                    android: {
                        height: 400,
                    },
                }),
                padding: 25,
                marginLeft: 10,
                marginRight: 10,
            }} onPress={() => this.props.navigation
                .navigate('Deal Details', {
                    deal: item
                })}>
                <View style={styles.container}>
                    <Text style={styles.dealHeader}>{item.name}</Text>
                    <Text style={styles.dealHeader}>{item.title}</Text>
                    <Image style={styles.dealBanner} source={{uri: item.image}}/>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size='large'/>
                </View>)
        }
        return (
            <View style={styles.container}>
                {this.userCards[0].length !== 0 || this.userCards[1].length !== 0 ? (
                    <View>
                        <Text style={{fontSize: 20, textAlign: 'center'}}>Discover personalised deals</Text>
                        <Text style={{marginBottom: 20, textAlign: 'center'}}>(based on your cards/payment
                            methods)</Text>
                    </View>
                ) : (
                    <View>
                        <Text style={{marginTop: 10, fontSize: 20, textAlign: 'center'}}>Discover deals</Text>
                        <Text style={{marginBottom: 20, textAlign: 'center'}}>(start adding your cards/payment
                            methods!)</Text>
                    </View>
                )}
                <BlueButton onPress={() => {
                    Toast.show({text: "Refreshing...", textStyle: {textAlign: "center"}})
                    this.getDeals()
                }}
                >
                    Show me more deals!
                </BlueButton>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingTop: 15}}>
                    <Carousel
                        layout={"default"}
                        ref={ref => {
                            if (this.state.carouselRef === null) this.setState({carouselRef: ref})
                        }}
                        data={this.state.picked}
                        sliderWidth={300}
                        itemWidth={350}
                        renderItem={this._renderItem}
                        onSnapToItem={index => this.setState({activeIndex: index})}
                        loop={true}
                    />
                </View>
                {this.pagination}
                <Text style={styles.text}>Click on any deal to find out more!</Text>
            </View>
        )
    }
}

export default Explore;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dealBanner: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
    },
    dealHeader: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 15,
        marginBottom: 10
    },
});