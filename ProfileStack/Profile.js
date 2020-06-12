import React from 'react';
import { Text, SafeAreaView, StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import firebaseDb from '../firebase/firebaseDb';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


class Profile extends React.Component {

    render() {
        const currentUser = firebaseDb.auth().currentUser

        return (
            <SafeAreaView style = {styles.container}>
                <View style = {{alignSelf: "center"}}>
                    <View style = {styles.profileImage}>
                        <Image source = {require('../images/Portrait_Placeholder.png')}
                           style = {styles.image}
                           resizeMode = "center"/>
                    </View>
                    <TouchableOpacity style = {styles.edit} onPress = {() => console.log("edit pic")}>
                        <MaterialCommunityIcons name = "pencil-outline" size = {18} color = "#DFD8C8"/>
                    </TouchableOpacity>
                </View>
                <Text style = {styles.title}> {currentUser.displayName} </Text>
                <View style={styles.textContainer}>
                    <Text>My Cards</Text>
                    <TouchableOpacity style = {styles.arrow} 
                        onPress={() => this.props.navigation.navigate('My Cards')}>
                        <MaterialCommunityIcons name = "chevron-right" size = {25}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.textContainer}>
                    <Text>My Apps</Text>
                    <TouchableOpacity style = {styles.arrow} 
                        onPress={() => this.props.navigation.navigate('My Apps')}>
                        <MaterialCommunityIcons name = "chevron-right" size = {25}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.textContainer}>
                    <Text>My Details</Text>
                    <TouchableOpacity style = {styles.arrow} 
                        onPress={() => this.props.navigation.navigate('Profile Details')}>
                        <MaterialCommunityIcons name = "chevron-right" size = {25}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.savings}>
                    <Text>Total Savings: </Text>
                    <TouchableOpacity style = {styles.arrow} 
                        onPress={() => this.props.navigation.navigate('History')}>
                        <MaterialCommunityIcons name = "chevron-right" size = {25}/>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        )
    }
}

export default Profile;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    image: {
        flex: 1,
        width: undefined,
        height: undefined
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        overflow: "hidden",
        marginTop: 10,
    },
    textContainer: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 16,
        width: 300,
        fontSize: 20,
        marginVertical: 10,
        paddingVertical: 15,
    },
    title: {
        marginTop: 10,
        fontSize: 25,
        marginBottom: 10,
    },
    edit: {
        position: "absolute",
        top: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#41444B",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10
    },
    arrow: {
        position: "absolute",
        width: 300,
        height: 50,
        right: 10,
        alignItems: "flex-end",
        justifyContent: "center"
    },
    savings: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 16,
        width: 300,
        height: 100,
        fontSize: 20,
        marginVertical: 10,
        paddingVertical: 15,
    }
})