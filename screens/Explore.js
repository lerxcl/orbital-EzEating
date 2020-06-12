import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import Carousel from 'react-native-snap-carousel';

class Explore extends React.Component {
    state = {
        all: null,
        loading: true,
        activeIndex: 0,
    }

    componentDidMount() {
        let shopsWithDeals = [...global.allShops];
        shopsWithDeals = shopsWithDeals.filter(shop => shop.deals.length !== 0)
            .map(shop => {
                shop.deals.map(deal => {
                    deal.name = shop.shopName
                    deal.logo = shop.logo
                })
                return shop.deals
            }).flatMap(deals => deals)
        this.setState({
            all: shopsWithDeals,
            loading: false,
        });
    }

    _renderItem = ({item, index}) => {
        return (
            <TouchableOpacity style={{
                backgroundColor: '#bc9eb2',
                borderRadius: 20,
                height: 450,
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
                <View style={{flex: 0.9, flexDirection: 'row', justifyContent: 'center', paddingTop: 50}}>
                    <Carousel
                        layout={"default"}
                        ref={ref => this.carousel = ref}
                        data={this.state.all}
                        sliderWidth={300}
                        itemWidth={350}
                        renderItem={this._renderItem}
                        onSnapToItem={index => this.setState({activeIndex: index})}
                        loop={true}
                    />
                </View>
                <Text>Click on any deal to find out more!</Text>

            </View>
        )
    }
}

export default Explore;

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dealBanner: {
        width: 320,
        height: 300,
        resizeMode: 'contain',
    },
    dealHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 5,
    },
})