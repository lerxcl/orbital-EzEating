import React from 'react';
import {Alert, TextInput, TouchableOpacity, StyleSheet, Text, View, Image, ScrollView} from "react-native";
import firebaseDb from "../firebase/firebaseDb";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {getMethods, getCards} from '../component/API';
import BlueButton from "../component/BlueButton";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import {ProgressBar} from 'react-native-paper';

class NewDeal extends React.Component {
    state = {
        image: null,
        selectedMethods: [],
        selectedCards: [],
        methods: [],
        cards: [],
        title: '',
        desc: '',
        cardsAndMethods: [],
        selected: [],
        selectedItemObjects: [],
        progress: 0,
        uploading: false,
        id: null,
        monetaryValue: "",
    }
    shopDeals = [];
    userId = firebaseDb.auth().currentUser.uid;

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
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
            this.setState({uploading: true})
            this.uploadImage(result.uri)
        }
    }

    uploadImage = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const fileName = uri.substring(uri.lastIndexOf('/') + 1);
        console.log(fileName);
        
        let ref = firebaseDb.storage().ref(`deals/images/${fileName}`);
        ref.put(blob)
              .on(
                firebaseDb.storage.TaskEvent.STATE_CHANGED,
                snapshot => {
                  this.setState({progress: (snapshot.bytesTransferred / snapshot.totalBytes)})
                  console.log("snapshot: " + snapshot.state);
                  console.log("progress: " + (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        
                  if (snapshot.state === firebaseDb.storage.TaskState.SUCCESS) {
                    console.log("Success");
                  }
                },
                error => {
                  unsubscribe();
                  console.log("image upload error: " + error.toString());
                },
                () => {
                  this.setState({uploading: false})
                  ref.getDownloadURL()
                    .then((downloadUrl) => {
                      console.log("File available at: " + downloadUrl);
        
                      this.setState({image: downloadUrl})
                    })
                })
            }

    onMethodsReceived = (methods) => {
        this.setState(prevState => ({
            methods: prevState.methods = methods
        }))
    }
    onCardsReceived = (cards) => {
        this.setState(prevState => ({
            cards: prevState.cards = cards
        }))
    }

    generateID = () => {
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let autoId = '';
        for (let i = 0; i < 20; i++) {
            autoId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        console.log(autoId)
        this.setState({id: autoId});
    }

    componentDidMount() {
        this.getPermissionAsync()
        const combined = [];
        getCards(this.onCardsReceived).then(() => combined.push({name: "Cards", id: 0, children: this.state.cards}))
        getMethods(this.onMethodsReceived).then(() => combined.push({ame: "Methods", id: 1, children: this.state.methods}))
        this.setState({cardsAndMethods: combined})

        // Generating firestore's UID style (20 Char)
        this.generateID();
    }

    onSelectedChange = selected => {
        this.setState({
            selected: selected,
            selectedCards: selected.filter(id => this.state.cards.filter(card => card.id === id).length === 1),
            selectedMethods: selected.filter(id => this.state.methods.filter(method => method.id === id).length === 1)
        });
    }

    updateTitle = (title) => this.setState({title});
    updateDesc = (desc) => this.setState({desc});
    updateMonetaryValue = (monetaryValue) => this.setState({monetaryValue});

    render() {

        const {title, desc, image, cardsAndMethods, selected, selectedCards, selectedMethods, uploading, progress, id, monetaryValue} = this.state

        return (
            <ScrollView>
                <View style={styles.container}>
                    {!image &&
                    <View style={styles.box}>
                        <TouchableOpacity style={styles.add} onPress={() => {
                            Alert.alert(
                                'Add image for deal',
                                'Do you want to add an image for this deal?',
                                [
                                    {
                                        text: 'No', onPress: () => {
                                        }
                                    },
                                    {text: 'Yes', onPress: this.pickImage}
                                ]
                            )
                        }}>
                            <MaterialCommunityIcons name="plus" size={50} color='black'/>
                        </TouchableOpacity>
                    </View>}

                    {image &&
                    <View style={{alignSelf: 'center'}}>
                        <View style={styles.profileImage}>

                            <Image source={{uri: image}}
                                   style={styles.image}
                                   resizeMode="center"/>

                        </View>
                        <TouchableOpacity style={styles.edit} onPress={() => {
                            Alert.alert(
                                'Change Deal Image',
                                'Do you want to change this deal image?',
                                [
                                    {text: 'Cancel', onPress: () => {}},
                                    {text: 'Yes', onPress: this.pickImage}
                                ]
                            )
                        }}>
                            <MaterialCommunityIcons name="pencil-outline" size={18} color="#DFD8C8"/>
                        </TouchableOpacity>
                    </View>
                    }

                {uploading &&
                    <View>
                        <Text style = {{marginBottom: 5}}>Uploading photo:</Text>
                        <ProgressBar width = {300} progress = {progress} color = 'darkblue'/>
                        <Text style = {{fontSize: 10}}>{Math.round(progress * 100)}%</Text>
                    </View>}

                    <View style={styles.textContainer}>
                        <TextInput
                            placeholder="Enter Deal Title"
                            value={title}
                            onChangeText={this.updateTitle}/>
                    </View>
                    <View style={styles.textContainerLong}>
                        <TextInput
                            multiline={true}
                            placeholder='Enter Deal Description'
                            value={desc}
                            onChangeText={this.updateDesc}/>
                    </View>

                    <View style={styles.textContainerLong}>
                        <TextInput
                            multiline={false}
                            placeholder='Enter Potential Savings'
                            keyboardType="number-pad"
                            value={monetaryValue}
                            onChangeText={this.updateMonetaryValue}/>
                    </View>

                    <Text style={{width: 300, marginBottom: 5, marginTop: 10, marginLeft: 50}}>This deal is only
                        applicable
                        with...</Text>

                    <SectionedMultiSelect
                        items={cardsAndMethods}
                        uniqueKey="id"
                        subKey="children"
                        selectText="Payment methods"
                        showDropDowns={true}
                        readOnlyHeadings={true}
                        onSelectedItemsChange={this.onSelectedChange}
                        selectedItems={selected}
                        expandDropDowns={true}
                    />

                    <BlueButton
                        onPress={() => {
                            if (image && title && desc) {
                                console.log(selectedCards)
                                firebaseDb.firestore().collection('shops').doc(this.userId).get()
                                    .then(documentSnapshot => {
                                        this.shopDeals = documentSnapshot.data().deals
                                        this.shopDeals.push({
                                            cards: selectedCards,
                                            description: desc,
                                            image: image,
                                            methods: selectedMethods,
                                            title: title,
                                            id: id,
                                            monetaryValue: Number(monetaryValue),
                                        })
                                        return this.shopDeals
                                    }).then(shopDeals => {
                                    firebaseDb.firestore().collection('shops').doc(this.userId).update({
                                        deals: shopDeals
                                    });
                                    this.setState({
                                        title: '',
                                        desc: '',
                                        image: null,
                                        selectedMethods: [],
                                        selected: [],
                                        monetaryValue: "",
                                    })
                                    Alert.alert("Deal Submitted Successfully!")
                                    this.props.route.params.refresh();
                                })
                            } else {
                                Alert.alert("Sorry, more information is needed")
                            }


                        }}
                    >
                        Submit
                    </BlueButton>
                </View>
            </ScrollView>
        )
    }

}

export default NewDeal;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    profileImage: {
        width: 200,
        height: 200,
        overflow: "hidden",
        marginTop: 10,
    },
    box: {
        width: 100,
        height: 100,
        borderWidth: 1,
        marginBottom: 10
    },
    add: {
        position: 'absolute',
        height: 100,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    edit: {
        position: "absolute",
        left: -20,
        top: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#41444B",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10
    },
    image: {
        flex: 1,
        width: 200,
        height: 200
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
        alignSelf: 'center',
    },
    textContainerLong: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 16,
        width: 300,
        fontSize: 20,
        marginVertical: 10,
        paddingVertical: 15,
        alignSelf: 'center',
    },
});