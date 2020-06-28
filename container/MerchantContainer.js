import BlueButton from '../component/BlueButton';
import {Alert, Image, StyleSheet, Text, TextInput, KeyboardAvoidingView} from "react-native";
import React from "react";
import firebaseDb from '../firebase/firebaseDb';
import {getNetworks, getMethods} from '../component/API';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

class MerchantContainer extends React.Component {
    state = {
        name: '',
        email: '',
        password: '',
        signUpSuccessful: false,
        selectedMethods: [],
        selectedCards: [],
        methods: [],
        cards: [],
        cardsAndMethods: [],
        selected:[],
    };

    onMethodsReceived = (methods) => {
        this.setState(prevState => ({
            methods: prevState.methods = methods
        }))}
    onCardsReceived = (cards) => {
        this.setState(prevState => ({
            cards: prevState.cards = cards
        }))}
    componentDidMount() {
        const combined = [];
        getNetworks(this.onCardsReceived).then(() => combined.push({name: "Cards", id: 0, children: this.state.cards}))
        getMethods(this.onMethodsReceived).then(() => combined.push({
            name: "Methods",
            id: 1,
            children: this.state.methods
        }))
        this.setState({cardsAndMethods: combined})
    }

    onSelectedChange = selected => {
        this.setState({selected: selected,
            selectedCards: selected.filter(id => this.state.cards.filter(card => card.id === id).length === 1),
            selectedMethods: selected.filter(id => this.state.methods.filter(method => method.id === id).length === 1)
        });
    }

    updateName = (name) => this.setState({name});
    updateEmail = (email) => this.setState({email});
    updatePassword = (password) => this.setState({password});

    handleCreateUser = () => {
        if (this.state.name === '' || this.state.email === ''
            || this.state.password === '') {
            Alert.alert('Some fields are missing!')
        } else {
            firebaseDb.auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then((cred)=>{
                    if(cred.user){
                      cred.user.updateProfile({
                        displayName: "merchant"
                      })
                    }
                    firebaseDb.firestore().collection('merchants').doc(cred.user.uid).set({
                        cards: this.state.selectedCards,
                        methods: this.state.selectedMethods,
                        name: this.state.name,
                        deals: []
                    })
                    this.setState({
                        name: '',
                        email: '',
                        password: '',
                        signUpSuccessful: true
                    })
                    Alert.alert('Sign Up Successful!')
                    this.props.navigation.navigate('Login')
                }).catch(err => console.error(err));
        }
    }

    render() {
        const {name, email, password, selected, cardsAndMethods} = this.state

        return (
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
                              style={styles.container}>
            
                <Image
                    style={styles.logo}
                    source={require('../images/logo.png')}
                />


                <TextInput
                    placeholder="Shop Name"
                    style={styles.input}
                    value={name}
                    onChangeText={this.updateName}
                />

                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    value={email}
                    onChangeText={this.updateEmail}
                    autoCapitalize='none'
                />

                <TextInput
                    placeholder="Password"
                    style={styles.input}
                    value={password}
                    onChangeText={this.updatePassword}
                    secureTextEntry={true}
                    autoCapitalize='none'
                />

                <Text>Cards/Methods</Text>

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
                    modalWithSafeAreaView={true}
                />

                <BlueButton
                    style={styles.button}
                    onPress={this.handleCreateUser}
                >
                    Sign Up
                </BlueButton>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 16,
        width: 300,
        fontSize: 16,
        marginVertical: 10,
        paddingVertical: 10
    },
    logo: {
        flex: 0.7,
        resizeMode: 'center',
    },
    button: {
        marginTop: 20,
        borderRadius: 25,
        width: 300,
    },
});

export default MerchantContainer;