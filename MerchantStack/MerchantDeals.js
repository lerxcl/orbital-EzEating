import React from 'react';
import { Image, TouchableOpacity, FlatList, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; 
import firebaseDb from '../firebase/firebaseDb';
import BlueButton from '../component/BlueButton';
import Toast from 'react-native-simple-toast';


class MerchantDeals extends React.Component {
    state = {
        deals: [],
        DialogVisible: false,
    }

    getData = () => {
        firebaseDb.firestore().collection('merchants').doc(firebaseDb.auth().currentUser.uid)
                  .get().then(snapshot => {
                      if (snapshot.exists) this.setState({deals: snapshot.data().deals})})
    }

    componentDidMount() {
        this.getData()
        
    }

    render() {
        const {deals} = this.state
        return (
            <View style={styles.container}>
                
            <BlueButton onPress={() => {
                this.getData();
                Toast.show("Refreshing...")
            }}
            >
                Refresh
            </BlueButton>

            {deals.length === 0 &&
                <Text> Start adding deals to feature for your store! </Text>
            }

            {deals.length > 0 &&
                <FlatList
                    data={deals}
                    renderItem={({item}) => (
                    <TouchableOpacity style={styles.itemContainer} onPress={() => this.props.navigation
                        .navigate('Merchant Deal Details', {
                            deal: item
                        })}>
                        <View style={{alignItems: 'flex-end', flex: 0.2}}>
                            <Image style={styles.image}
                                   source={{uri: item.image}}/>
                        </View>
                        <Text style={styles.name}>{item.title}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.title}
                />
            }

                <TouchableOpacity style = {styles.add} onPress = {() => 
                    this.props.navigation.navigate("New Deal")}>
                        <MaterialCommunityIcons name = "plus" size = {30} color = "white"/>
                </TouchableOpacity>
            </View>
            )
    }
}

export default MerchantDeals;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
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
    image: {
        resizeMode: 'center',
        width: 70,
        height: 70,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    add: {
        position: "absolute",
        right: 20,
        bottom: 20,
        width: 80,
        height: 80,
        borderRadius: 100,
        backgroundColor: "#455a64",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: 'flex-end'
    },
})