import React, { useEffect } from 'react';
import {Alert, TouchableOpacity, StyleSheet, Text, View, Image, ScrollView} from "react-native";
import firebaseDb from '../firebase/firebaseDb';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import Dialog from "react-native-dialog";
import BlueButton from '../component/BlueButton'

function MerchantDealDetails({route}) {
    const {deal} = route.params;
    const [image, setImage] = React.useState(deal.image)
    const [title, setTitle] = React.useState(deal.title)
    const [desc, setDesc] = React.useState(deal.description)
    const [newTitle, setNewTitle] = React.useState('')
    const [newDesc, setNewDesc] = React.useState('')
    const [titleDialog, setTitleDialog] = React.useState(false)
    const [descDialog, setDescDialog] = React.useState(false)
    const userId = firebaseDb.auth().currentUser.uid
    const userDoc = firebaseDb.firestore().collection('merchants').doc(userId)

    useEffect(() => {
        getPermissionAsync()
    })

    const getPermissionAsync = async () => {
        if (Constants.platform.ios) {
          const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
      }
    
      const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [3, 3],
          quality: 1
        });
        
        if (!result.cancelled) {
            setImage(result.uri)
        }
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <Image style={styles.dealBanner} source={{uri: image}}/>
                <TouchableOpacity style = {styles.edit} onPress = {() => {
                    Alert.alert(
                        'Change Deal Image',
                        'Do you want to change this image?',
                        [
                        {text: 'Cancel', onPress: () => {}},
                        {text: 'Yes', onPress: () => pickImage()}
                        ]
                    )}}>
                        <MaterialCommunityIcons name = "pencil-outline" size = {18} color = "#DFD8C8"/>
                    </TouchableOpacity>

                <Dialog.Container visible={titleDialog}>
                    <Dialog.Title>Edit Deal Title </Dialog.Title>
                    <Dialog.Input defaultValue = {title} onChangeText = {(title) => setNewTitle(title)}/>
                    <Dialog.Button label = "Cancel" onPress = {() => setTitleDialog(false)}/>
                    <Dialog.Button label = "Submit" onPress = {() => {
                        setTitleDialog(false)
                        setTitle(newTitle)
                    }}/>
                </Dialog.Container>    

                <View style = {styles.container}>
                <Text style={styles.dealHeader}>{title}</Text>
                <TouchableOpacity style = {styles.arrow} 
                        onPress={() => setTitleDialog(true)}>
                        <MaterialCommunityIcons name = "pencil-outline" size = {25}/>
                    </TouchableOpacity>
                </View>

                <View style = {styles.box}>
                <Text style={styles.info}>{desc}</Text>
                <TouchableOpacity style = {styles.arrowInfo} 
                        onPress={() => setDescDialog(true)}>
                        <MaterialCommunityIcons name = "pencil-outline" size = {25}/>
                    </TouchableOpacity>
                </View>

                <Dialog.Container visible={descDialog}>
                    <Dialog.Title>Edit Deal Description </Dialog.Title>
                    <Dialog.Input multiline = {true} numberOfLines = {6} defaultValue = {desc} onChangeText = {(desc) => setNewDesc(desc)}/>
                    <Dialog.Button label = "Cancel" onPress = {() => setDescDialog(false)}/>
                    <Dialog.Button label = "Submit" onPress = {() => {
                        setDescDialog(false)
                        setDesc(newDesc)
                    }}/>
                </Dialog.Container>

            <Text style = {{marginBottom: 20}}>Please save changes before leaving page!</Text>

            <BlueButton style = {{width: 300, alignSelf: 'center'}} onPress={() => {
                    userDoc.update({
                        deals: firebaseDb.firestore.FieldValue.arrayRemove({title: deal.title, cards: deal.cards, methods: deal.methods, image: deal.image, description: deal.description})
                    })
                    userDoc.update({
                        deals: firebaseDb.firestore.FieldValue.arrayUnion({title: title, cards: deal.cards, methods: deal.methods, image: image, description: desc})
                    })
                    Alert.alert("Deal details saved!")
                }}>
                    Save
                </BlueButton>

            </View>
        </ScrollView>
    )
}

export default MerchantDealDetails;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    edit: {
        position: "absolute",
        top: 20,
        left: 35,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#41444B",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10
    },
    box: {
        width: 300,
        height: 200,
        marginBottom: 20,
        borderBottomWidth: 1,
        alignItems: 'center'
    },
    dealBanner: {
        width: 350,
        height: 300,
        resizeMode: 'contain',
        marginBottom: 20
    },
    dealHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingHorizontal: 40,
        textAlign: 'center',
        borderBottomWidth: 1,
        width: 300,
    },
    arrow: {
        position: "absolute",
        width: 50,
        height: 50,
        right: 10,
        alignItems: "flex-end",
        justifyContent: "center"
    },
    arrowInfo: {
        position: "absolute",
        width: 50,
        height: 50,
        right: 20,
        bottom: -5,
        alignItems: "flex-end",
        justifyContent: "center"
    },
    info: {
        marginTop: 20,
        paddingHorizontal: 40,
        width: 350,
        height: 200
    },
})