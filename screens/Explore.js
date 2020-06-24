import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import BlueButton from "../component/BlueButton";
import firebaseDb from '../firebase/firebaseDb';
import {Toast} from 'native-base';

function randSelect(shopsWithDeals) {
    let randomDeals = [];
    let alrPicked = [];

    for (let i = 0; i < 10; i++) {
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
        hasCards: null,
        hasMethods: null,
    }
    userId = firebaseDb.auth().currentUser.uid
    userDoc = firebaseDb.firestore().collection('users').doc(this.userId)
    userCards = []

    getDeals = () => {
        this.userCards = []
        this.userDoc.get()
            .then(snapshot => {
                this.setState({
                    hasCards: snapshot.data().hasCards,
                    hasMethods: snapshot.data().hasMethods
                })

                this.userCards.push(snapshot.data().cards)
                this.userCards.push(snapshot.data().methods)

                let shopsWithDeals = [...global.allShops];

                if (!this.state.hasCards && !this.state.hasMethods) {
                    console.log("no")
                    shopsWithDeals = shopsWithDeals.filter(shop => shop.deals.length !== 0)
                        .map(shop => {
                            shop.deals.map(deal => {
                                deal.name = shop.shopName
                                deal.logo = shop.logo
                            })
                            return shop.deals
                        }).flatMap(deals => deals).filter(deal => deal.cards.length === 0 && deal.methods.length === 0)
                } else {
                    console.log("cards/methods")
                    shopsWithDeals = shopsWithDeals.filter(shop => shop.deals.length !== 0)
                        .map(shop => {
                            shop.deals.map(deal => {
                                deal.name = shop.shopName
                                deal.logo = shop.logo
                            })
                            return shop.deals
                        }).flatMap(deals => deals)
                        .filter(deal => {
                            if (deal.cards.length === 0 && deal.methods.length === 0) {
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
                }

                const randomDeals = randSelect(shopsWithDeals);

                this.setState({
                    all: shopsWithDeals,
                    picked: randomDeals,
                    loading: false,
                });
                Toast.show({text:"Done refreshing", type:"success", textStyle:{textAlign:"center"}})
            })
    }

    componentDidMount() {
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
                height: 420,
                padding: 50,
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
                {this.state.hasCards || this.state.hasMethods ? (
                    <View>
                        <Text style={{fontSize: 20,textAlign: 'center'}}>Discover personalised deals</Text>
                        <Text style={{marginBottom: 20,textAlign: 'center'}}>(based on your cards/payment methods)</Text>
                    </View>
                ) : (
                    <View>
                        <Text style={{fontSize: 20,textAlign: 'center'}}>Discover deals</Text>
                        <Text style={{marginBottom: 20,textAlign: 'center'}}>(start adding your cards/payment methods!)</Text>
                    </View>
                )}
                <BlueButton onPress={() => {
                    Toast.show({text:"Refreshing...", textStyle:{textAlign:"center"}})
                    this.getDeals()
                }}
                >
                    Show me more deals!
                </BlueButton>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingTop: 20}}>
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
    },
});