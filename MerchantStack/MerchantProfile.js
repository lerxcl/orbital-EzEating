import React from 'react';
import { ScrollView, Alert, Text, SafeAreaView, StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import firebaseDb from '../firebase/firebaseDb';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import BlueButton from "../component/BlueButton";

class MerchantProfile extends React.Component {

    userId = firebaseDb.auth().currentUser.uid

    state = {
        name: '',
        image: null
      };

    componentDidMount() {
        firebaseDb.firestore().collection('merchants').doc(this.userId).get()
                  .then(snapshot => this.setState({name: snapshot.data().name, image: snapshot.data().logo}))
        this.getPermissionAsync()
      }
    
      getPermissionAsync = async () => {
        if (Constants.platform.ios) {
          const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
      }
    
      pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [3, 3],
          quality: 1
        });
        
        if (!result.cancelled) {
          this.setState({ image: result.uri })
          firebaseDb.firestore().collection('merchants').doc(this.userId).update({logo: result.uri})
          }
    }

    render() {
        const {image, name} = this.state

        return (
            <ScrollView contentContainerstyle = {styles.container}>
                <View style = {{alignSelf: "center"}}>
                    <View style = {styles.profileImage}>
                        {image && <Image source = {{ uri: image }}
                           style = {styles.image}
                           resizeMode = "center"/>}
                        {!image && <Image source = {require('../images/Portrait_Placeholder.png')}
                           style = {styles.image}
                           resizeMode = "center"/>}
                    </View>
                    <TouchableOpacity style = {styles.edit} onPress = {() => {
                    Alert.alert(
                        'Change/Remove Shop Logo',
                        'Do you want to change or remove your shop logo?',
                        [
                        {text: 'Cancel', onPress: () => {}},
                        {text: 'Remove', onPress: () => {
                            this.setState({ image: null})
                            firebaseDb.firestore().collection('merchants').doc(this.userId).update({logo: null})
                        }},
                        {text: 'Change', onPress: this.pickImage}
                        ]
                    )}}>
                        <MaterialCommunityIcons name = "pencil-outline" size = {18} color = "#DFD8C8"/>
                    </TouchableOpacity>
                </View>
                <View style={styles.textContainer}>
                    <Text>Shop Name: {name}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text>Opening Hours: </Text>
                </View>
                <View style={styles.textContainer}>
                    <Text>Contact: </Text>
                </View>
                <View style={styles.textContainer}>
                    <Text>Description: </Text>
                </View>
                <View style={styles.textContainer}>
                    <Text>Type: </Text>
                </View>
                <View style={styles.textContainer}>
                    <Text>Users Favourited: 0</Text>
                    <Text>Rating: 0</Text>
                </View>
                <Text style = {{alignSelf: 'center', marginBottom: 20, marginTop: 10}}> Complete your profile to publish your store!</Text>
                <BlueButton style = {{width: 300, alignSelf: 'center'}} onPress={() => console.log("published")}>
                    Publish
                </BlueButton>
            </ScrollView>
        )
    }
}

export default MerchantProfile;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        flex: 1,
        width: undefined,
        height: undefined
    },
    profileImage: {
        width: 200,
        height: 200,
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
        alignSelf: 'center'
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