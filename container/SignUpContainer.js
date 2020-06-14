import BlueButton from '../component/BlueButton';
import {ScrollView, Alert, Image, StyleSheet, TextInput, Text, KeyboardAvoidingView} from "react-native";
import React from "react";
import firebaseDb from '../firebase/firebaseDb';
import MultiSelect from 'react-native-multiple-select';
import {getMethods, getCards} from '../component/API'


class SignUpContainer extends React.Component {
    state = {
        name: '',
        email: '',
        password: '',
        signUpSuccessful: false,
        selectedMethods: [],
        selectedCards: [],
        methods: [],
        cards: []
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
        getMethods(this.onMethodsReceived)
        getCards(this.onCardsReceived)}

    onSelectedMethodsChange = selectedMethods => {
        this.setState({selectedMethods});}
    onSelectedCardsChange = selectedCards => {
        this.setState({selectedCards});}

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
                        displayName: this.state.name
                      })
                    }
                    firebaseDb.firestore().collection('users').doc(cred.user.uid).set({
                        cards: this.state.selectedCards,
                        methods: this.state.selectedMethods,
                        fav: [], // creating empty array of user's favourite shops
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
        const {name, email, password, selectedMethods, selectedCards, methods, cards} = this.state

        return (
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
                              style={styles.container}>
            
                <Image
                    style={styles.logo}
                    source={require('../images/logo.png')}
                />


                <TextInput
                    placeholder="Name"
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

                <Text style = {{marginTop: 10, marginBottom: 10}}>You would like to see deals concerning...</Text>

                <MultiSelect
                    styleMainWrapper={styles.select}
                    styleTextDropdown={styles.text}
                    items={methods}
                    uniqueKey="id"
                    onSelectedItemsChange={this.onSelectedMethodsChange}
                    selectedItems={selectedMethods}
                    selectText="Choose Payment Methods"
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
                    selectText="Choose Cards"
                    searchInputPlaceholderText="Search Items..."
                    tagRemoveIconColor="#CCC"
                    tagBorderColor="#CCC"
                    tagTextColor="#CCC"
                    selectedItemTextColor="#CCC"
                    selectedItemIconColor="#CCC"
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
    text: {
        fontSize: 12,
        paddingHorizontal: 16,
    },
    select: {
        paddingHorizontal: 16,
        width: 300,
        marginVertical: 5,
        paddingVertical: 5
    }
});

export default SignUpContainer;