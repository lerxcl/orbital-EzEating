import React from 'react';
import {FlatList, ActivityIndicator, StyleSheet, Text, View, Image} from "react-native";
import firebaseDb from '../firebase/firebaseDb';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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
                const results = []
                querySnapshot.docs.map(documentSnapshot => results.push(documentSnapshot.data()))
                sortByName(results);
                this.setState({isLoading: false, shops: results})
            }).catch(err => console.error(err))
    }

    state = {
        isLoading: true,
        shops: null,
        searchLoading: false,
        searchResults:[],
        error: null,
    }

    render() {
        const {isLoading, shops} = this.state

        if (isLoading)
            return <ActivityIndicator/>

        return (
            <View style={styles.container}>
                <FlatList
                    data={shops}
                    renderItem={({item}) => (
                        <View style={styles.itemContainer}>
                            <View style={{alignItems:'flex-end', flex:1}}>
                            <Image style={styles.logo}
                                source={{uri: item.logo}}/>
                            </View>
                            <Text style={styles.name}>{item.shopName}</Text>
                            <MaterialCommunityIcons name="star" size={15}/>
                            <Text>{item.rating}</Text>
                        </View>
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
        width: 300,
        height: 100,
        marginTop: 20,
        marginVertical: 10,
        paddingVertical: 10,
    },
    logo: {
        resizeMode:'center',
        width:70,
        height:70,
    }
});