import React from 'react';
import {Alert, TextInput, TouchableOpacity, StyleSheet, Text, View, Image, ScrollView} from "react-native";
import firebaseDb from "../firebase/firebaseDb";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MultiSelect from 'react-native-multiple-select';
import {getMethods, getCards} from '../component/API';
import BlueButton from "../component/BlueButton";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { YellowBox } from 'react-native'

YellowBox.ignoreWarnings([
    'VirtualizedLists should never be nested', // TODO: Remove when fixed
])


class NewDeal extends React.Component {
    state = {
        image: null,
        selectedMethods: [],
        selectedCards: [],
        methods: [],
        cards: [],
        title: '',
        desc: '',
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
        getMethods(this.onMethodsReceived)
        getCards(this.onCardsReceived)
    }

    onSelectedMethodsChange = selectedMethods => {
        this.setState({selectedMethods});
    }
    onSelectedCardsChange = selectedCards => {
        this.setState({selectedCards});
    }

    updateTitle = (title) => this.setState({title});
    updateDesc = (desc) => this.setState({desc});

    render() {

        const {title, desc, image, methods, cards, selectedCards, selectedMethods} = this.state

        return (
            <ScrollView nestedScrollEnabled={true}>
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

                <MultiSelect
                    styleMainWrapper={styles.select}
                    styleTextDropdown={styles.text}
                    items={methods}
                    uniqueKey="id"
                    onSelectedItemsChange={this.onSelectedMethodsChange}
                    selectedItems={selectedMethods}
                    selectText="Payment methods"
                    searchInputPlaceholderText="Search Items..."
                    tagRemoveIconColor="#CCC"
                    tagBorderColor="#CCC"
                    tagTextColor="#CCC"
                    selectedItemTextColor="#CCC"
                    selectedItemIconColor="#CCC"
                    fixedHeight={true}

                />

                <MultiSelect
                    styleMainWrapper={styles.select}
                    styleTextDropdown={styles.text}
                    items={cards}
                    uniqueKey="id"
                    onSelectedItemsChange={this.onSelectedCardsChange}
                    selectedItems={selectedCards}
                    selectText="Cards"
                    searchInputPlaceholderText="Search Items..."
                    tagRemoveIconColor="#CCC"
                    tagBorderColor="#CCC"
                    tagTextColor="#CCC"
                    selectedItemTextColor="#CCC"
                    selectedItemIconColor="#CCC"
                    fixedHeight={true}

                />

                <BlueButton
                    onPress={() => {
                        if (image && title && desc) {
                        firebaseDb.firestore().collection('shops').doc(this.userId).get()
                            .then(documentSnapshot => {
                                this.shopDeals = documentSnapshot.data().deals
                                this.shopDeals.push({
                                    cards: this.state.selectedCards,
                                    description: this.state.desc,
                                    image: this.state.image,
                                    methods: this.state.selectedMethods,
                                    title: this.state.title
                                })
                                return this.shopDeals
                            }).then(shopDeals => {
                            firebaseDb.firestore().collection('shops').doc(this.userId).update({
                                deals: shopDeals
                            });
                        firebaseDb.firestore().collection('merchants').doc(this.userId).update({
                            deals: firebaseDb.firestore.FieldValue.arrayUnion({
                                cards: this.state.selectedCards,
                                description: this.state.desc,
                                image: this.state.image,
                                methods: this.state.selectedMethods,
                                title: this.state.title
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
    text: {
        fontSize: 12,
        paddingHorizontal: 16,
    },
    select: {
        paddingHorizontal: 16,
        width: 300,
        marginVertical: 5,
        paddingVertical: 5
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