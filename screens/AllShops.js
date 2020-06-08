import React from 'react';
import {TouchableOpacity, SectionList, ActivityIndicator, StyleSheet, Text, View, Image} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import firebaseDb from '../firebase/firebaseDb';

function sortByName(array) {
    return array.sort(function (a, b) {
        let x = a["shopName"];
        let y = b["shopName"];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

class AllShops extends React.Component {
    componentDidMount() {
        firebaseDb.firestore().collection('shops').get()
            .then(querySnapshot => {
                let results = [];
                querySnapshot.docs.map(documentSnapshot => results.push(documentSnapshot.data()))
                sortByName(results);
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
            }).catch(err => console.error(err))
    }

    state = {
        isLoading: true,
        shops: null,
    }

    renderSectionHeader = obj => <Text style={styles.name}>{obj.section.title}</Text>

    render() {
        const {isLoading, shops} = this.state

        if (isLoading)
            return <ActivityIndicator/>

        return (
            <View style={styles.container}>
                <SectionList
                    sections={shops}
                    renderSectionHeader={this.renderSectionHeader}
                    renderItem={({item}) => (
                        <TouchableOpacity style={styles.itemContainer} onPress={() => this.props.navigation
                            .navigate('Shop Details', {
                                shop: item
                            })}>
                            <View style={{alignItems: 'flex-end', flex: 0.2}}>
                                <Image style={styles.logo}
                                       source={{uri: item.logo}}/>
                            </View>
                            <Text style={styles.name}>{item.shopName}</Text>
                            <MaterialCommunityIcons name="star" size={15}/>
                            <Text>{item.rating}</Text>
                        </TouchableOpacity>

                    )}
                    keyExtractor={item => item.shopName}
                />
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