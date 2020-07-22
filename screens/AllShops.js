import React from 'react';
import {TouchableOpacity, SectionList, ActivityIndicator, StyleSheet, Text, View, Image} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SearchBar } from 'react-native-elements';

class AllShops extends React.Component {
    componentDidMount() {
        let results = [...global.allShops];
        results = results.map(x =>
            ({...x, letter: x.shopName[0].toUpperCase()})
        );
        const resultsByLetter = [];
        results.map(shop => {
            let duplicateLetter = false;
            for (let i = 0; i < resultsByLetter.length; i++) {
                if (resultsByLetter[i].title === shop.letter) {
                    resultsByLetter[i].data.push(shop);
                    duplicateLetter = true;
                    break;
                }
            }
            if (!duplicateLetter) {
                resultsByLetter.push({
                    title: shop.letter,
                    data: [shop],
                });
            }
        })
        this.setState({isLoading: false, shops: resultsByLetter})
    }

    state = {
        isLoading: true,
        shops: null,
        search: '',
    }

    updateSearch = (search) => {
        let newResult = global.allShops.filter(shop => {
            const shopName = shop.shopName.toUpperCase();
            const searchInput = search.toUpperCase();
            return shopName.indexOf(searchInput) > -1;
        })
        newResult = newResult.map(x =>
            ({...x, letter: x.shopName[0].toUpperCase()})
        );
        const resultsByLetter = [];
        newResult.map(shop => {
            let duplicateLetter = false;
            for (let i = 0; i < resultsByLetter.length; i++) {
                if (resultsByLetter[i].title === shop.letter) {
                    resultsByLetter[i].data.push(shop);
                    duplicateLetter = true;
                    break;
                }
            }
            if (!duplicateLetter) {
                resultsByLetter.push({
                    title: shop.letter,
                    data: [shop],
                });
            }
        })
        this.setState({search: search, shops: resultsByLetter});
    }

    renderSectionHeader = obj => <Text style={styles.name}>{obj.section.title}</Text>

    render() {
        const {isLoading, shops} = this.state

        if (isLoading)
            return (
                <View style={styles.container}>
                    <ActivityIndicator size='large'/>
                </View>)

        return (
            <View style={{flex:1}}>
            <SearchBar
                placeholder="Search Here..."
                onChangeText={this.updateSearch}
                value={this.state.search}
                searchIcon={{size:24}}
                //containerStyle={{backgroundColor:'#698896'}}
                //inputContainerStyle={{backgroundColor:'#698896'}}
            />
            <View style={styles.container}>
                <SectionList
                    sections={shops}
                    renderSectionHeader={this.renderSectionHeader}
                    renderItem={({item}) => (
                        <TouchableOpacity style={styles.itemContainer} onPress={() => this.props.navigation
                            .navigate('Shop Details', {
                                shop: item,
                                refresh: this.props.route.params.refresh,
                            })}>
                            <View style={{alignItems: 'flex-end', flex: 0.2}}>
                                <Image style={styles.logo}
                                       source={{uri: item.logo}}/>
                            </View>
                            <Text style={styles.name}>{item.shopName}</Text>
                            <MaterialCommunityIcons name="star" size={15}/>
                            <View>
                            {item.rating === 0 && <Text>No reviews yet</Text>}
                            {item.rating !== 0 && <Text>{item.rating}</Text>}
                            </View>
                        </TouchableOpacity>

                    )}
                    keyExtractor={item => item.shopName}
                />
            </View>
            </View>
        )
    }
}

export default AllShops;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    itemContainer: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 16,
        width: 350,
        height: 100,
        marginTop: 20,
        marginVertical: 10,
        paddingVertical: 10,
    },
    logo: {
        resizeMode: 'center',
        width: 70,
        height: 70,
    }
});