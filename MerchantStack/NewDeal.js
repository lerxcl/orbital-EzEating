import React from 'react';
import {Alert, TextInput, TouchableOpacity, StyleSheet, Text, View, Image, ScrollView} from "react-native"; 
import firebaseDb from "../firebase/firebaseDb";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MultiSelect from 'react-native-multiple-select';
import {getMethods, getCards} from '../component/API';
import BlueButton from "../component/BlueButton"


class NewDeal extends React.Component {
    state = {
        image: null,
        selectedMethods: [],
        selectedCards: [],
        methods: [],
        cards: [],
        title: '',
        desc: ''
    }

    onMethodsReceived = (methods) => {
        this.setState(prevState => ({
            methods: prevState.methods = methods
        }))}
    onCardsReceived = (cards) => {
        this.setState(prevState => ({
            cards: prevState.cards = cards
        }))}
    componentDidMount() {
        getMethods(this.onMethodsReceived)
        getCards(this.onCardsReceived)}

    onSelectedMethodsChange = selectedMethods => {
        this.setState({selectedMethods});}
    onSelectedCardsChange = selectedCards => {
        this.setState({selectedCards});}

    updateTitle = (title) => this.setState({title});
    updateDesc = (desc) => this.setState({desc});

    render() {

        const {title, desc, image, methods, cards, selectedCards, selectedMethods} = this.state
        
        return (
            <View style = {styles.container}>
                {!image && 
                <View style = {styles.box}>
                    <TouchableOpacity style = {styles.add} onPress = {() => {
                    Alert.alert(
                        'Add image for deal',
                        'Do you want to add an image for this deal?',
                        [
                        {text: 'No', onPress: () => {}},
                        {text: 'Yes', onPress: () => console.log("change image")}
                        ]
                    )}}>
                        <MaterialCommunityIcons name = "plus" size = {50} color = 'black'/>
                    </TouchableOpacity>
                </View>}

                {image &&
                <Image source = {{ uri: image }}
                           style = {styles.image}
                           resizeMode = "center"/>}

                <View style={styles.textContainer}>
                    <TextInput 
                    placeholder="Enter Deal Title"
                    value={title}
                    onChangeText={this.updateTitle}/>
                </View>
                <View style={styles.textContainerLong}>
                    <TextInput 
                    multiline = {true} 
                    placeholder = 'Enter Deal Description'
                    value={desc}
                    onChangeText={this.updateDesc}/>
                </View>

                <Text style = {{width: 300, marginBottom: 5, marginTop: 10, marginLeft: 50}}>This deal is only applicable with...</Text>

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
                />

                <BlueButton
                    onPress={() => console.log("submit")}
                >
                    Submit
                </BlueButton>
            </View>
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
        width: undefined,
        height: undefined
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