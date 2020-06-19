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
        selected:[],
    }
    shopDeals = [];
    userId = firebaseDb.auth().currentUser.uid;

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
          }
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

    componentDidMount() {
        this.getPermissionAsync()
        const combined = [];
        getCards(this.onCardsReceived).then(() => combined.push({name:"Cards", id:0, children:this.state.cards}))
        getMethods(this.onMethodsReceived).then(() => combined.push({name:"Methods", id:1, children:this.state.methods}))
        this.setState({cardsAndMethods: combined})
    }

    onSelectedChange = selected => {
        this.setState({selected: selected,
            selectedCards: selected.filter(id => this.state.cards.filter(card => card.id === id).length === 1),
            selectedMethods: selected.filter(id => this.state.methods.filter(method => method.id === id).length === 1)
        });
    }

    updateTitle = (title) => this.setState({title});
    updateDesc = (desc) => this.setState({desc});

    render() {

        const {title, desc, image, cardsAndMethods, selected, selectedCards, selectedMethods} = this.state

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
                <View style = {{alignSelf: 'center'}}>
                <View style = {styles.profileImage}>
                
                <Image source={{uri: image}}
                       style={styles.image}
                       resizeMode="center"/>

                </View>
                <TouchableOpacity style = {styles.edit} onPress = {() => {
                    Alert.alert(
                        'Change/Remove Deal Image',
                        'Do you want to change or remove this deal image?',
                        [
                        {text: 'Cancel', onPress: () => {}},
                        {text: 'Remove', onPress: () => {
                            this.setState({ image: null})}},
                        {text: 'Change', onPress: this.pickImage}
                        ]
                    )}}>
                        <MaterialCommunityIcons name = "pencil-outline" size = {18} color = "#DFD8C8"/>
                    </TouchableOpacity>
                </View>
                }

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

                <Text style={{width: 300, marginBottom: 5, marginTop: 10, marginLeft: 50}}>This deal is only applicable
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
                        firebaseDb.firestore().collection('shops').doc(this.userId).get()
                            .then(documentSnapshot => {
                                this.shopDeals = documentSnapshot.data().deals
                                this.shopDeals.push({
                                    cards: selectedCards,
                                    description: desc,
                                    image: image,
                                    methods: selectedMethods,
                                    title: title
                                })
                                return this.shopDeals
                            }).then(shopDeals => {
                            firebaseDb.firestore().collection('shops').doc(this.userId).update({
                                deals: shopDeals
                            });
                        firebaseDb.firestore().collection('merchants').doc(this.userId).update({
                            deals: firebaseDb.firestore.FieldValue.arrayUnion({
                                cards: selectedCards,
                                description: desc,
                                image: image,
                                methods: selectedMethods,
                                title: title
                            })
                        })
                        this.setState({
                            title: '',
                            desc: '',
                            image: null,
                            selectedMethods: [],
                            selectedCards: []
                        })
                        Alert.alert("Deal Submitted Successfully!")
                        })}
                        else {
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
        height: 150,
        fontSize: 20,
        marginVertical: 10,
        paddingVertical: 15,
        alignSelf: 'center',
    },
})