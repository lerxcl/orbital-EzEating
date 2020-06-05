import BlueButton from '../component/BlueButton';
import {View, Alert, Image, StyleSheet, TextInput, Text, KeyboardAvoidingView} from "react-native";
import React from "react";
import firebaseDb from '../firebase/firebaseDb';
import MultiSelect from 'react-native-multiple-select';

class SignUpContainer extends React.Component {
    state = {
        name: '',
        email: '',
        password: '',
        signUpSuccessful: false,
        selectedMethods: [],
        selectedCards: []
    };

    methods = [{
        id: '92iijs7yta',
        name: 'GrabPay',
      }, {
        id: 'a0s0a8ssbsd',
        name: 'FavePay',
      }, {
        id: '16hbajsabsd',
        name: 'AliPay',
      }, {
        id: 'nahs75a5sg',
        name: 'DBS Paylah',
      }, {
        id: '667atsas',
        name: 'UOB Mighty',
      }, {
        id: 'hsyasajs',
        name: 'OCBC Pay Anyone',
      }, {
        id: 'djsjudksjd',
        name: 'WeChat Pay',
      }, {
        id: 'sdhyaysdj',
        name: 'SingTel Dash',
      }, {
        id: 'suudydjsjd',
        name: 'PayNow',
    }];

    cards = [{
        id: '1',
        name: 'UOB One',
      }, {
        id: '2',
        name: 'POSB Everyday',
      }, {
        id: '3',
        name: 'Standard Chartered Unlimited Cashback',
      }, {
        id: '4',
        name: 'DBS Live Fresh',
      }, {
        id: '5',
        name: 'OCBC NTUC Plus! Visa',
      }, {
        id: '6',
        name: 'OCBC 365',
      }, {
        id: '7',
        name: 'CIMB Platinum Mastercard',
      }, {
        id: '8',
        name: 'HSBC Revolution',
      }, {
        id: '9',
        name: 'Citi Rewards',
    }];
     
    onSelectedMethodsChange = selectedMethods => {
        this.setState({ selectedMethods });
    };

    onSelectedCardsChange = selectedCards => {
        this.setState({ selectedCards });
    };

    updateName = (name) => this.setState({name});
    updateEmail = (email) => this.setState({email});
    updatePassword = (password) => this.setState({password});

    handleCreateUser = () => {
        if (this.state.name === '' || this.state.email === ''
            || this.state.password === '') {
            Alert.alert('Some fields are missing!')
        } else {
            (firebaseDb.auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(cred => {
                    return firebaseDb.firestore().collection('users').doc(cred.user.uid).set({
                        name: this.state.name,
                        cards: this.state.selectedCards,
                        methods: this.state.selectedMethods
                    })
                })
                .then(() => {
                    this.setState({
                        name: '',
                        email: '',
                        password: '',
                        signUpSuccessful: true
                    })
                    this.props.navigation.navigate('Login')
                })
                .catch(err => console.error(err)));
        }
    }

    render() {
        const {name, email, password, signUpSuccessful, selectedMethods, selectedCards} = this.state
        return (
            <KeyboardAvoidingView behavior='padding' style={styles.container}>

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
                />

                <TextInput
                    placeholder="Password"
                    style={styles.input}
                    value={password}
                    onChangeText={this.updatePassword}
                    secureTextEntry= {true}
                />

                <MultiSelect
                    styleMainWrapper = {styles.select}
                    styleTextDropdown = {styles.text}
                    items={this.methods}
                    uniqueKey="id"
                    ref={(component) => { this.multiSelect = component }}
                    onSelectedItemsChange={this.onSelectedMethodsChange}
                    selectedItems={selectedMethods}
                    selectText="Choose Payment Methods"
                    searchInputPlaceholderText="Search Items..."
                    onChangeInput={ (text)=> console.log(text)}
                    tagRemoveIconColor="#CCC"
                    tagBorderColor="#CCC"
                    tagTextColor="#CCC"
                    selectedItemTextColor="#CCC"
                    selectedItemIconColor="#CCC"
                    itemTextColor="#000"
                    displayKey="name"
                    searchInputStyle={{ color: '#CCC' }}
                    submitButtonColor="#CCC"
                    submitButtonText="Submit"
                />

                <MultiSelect
                    styleMainWrapper = {styles.select}
                    styleTextDropdown = {styles.text}
                    items={this.cards}
                    uniqueKey="id"
                    ref={(component) => { this.multiSelect = component }}
                    onSelectedItemsChange={this.onSelectedCardsChange}
                    selectedItems={selectedCards}
                    selectText="Choose Cards"
                    searchInputPlaceholderText="Search Items..."
                    onChangeInput={ (text)=> console.log(text)}
                    tagRemoveIconColor="#CCC"
                    tagBorderColor="#CCC"
                    tagTextColor="#CCC"
                    selectedItemTextColor="#CCC"
                    selectedItemIconColor="#CCC"
                    itemTextColor="#000"
                    displayKey="name"
                    searchInputStyle={{ color: '#CCC' }}
                    submitButtonColor="#CCC"
                    submitButtonText="Submit"
                />

                <BlueButton
                    style={styles.button}
                    onPress={this.handleCreateUser}
                >
                    Sign Up
                </BlueButton>
                { // to use Javascript
                    signUpSuccessful && (<Text style={styles.text}>Sign Up Successful!</Text>)
                }
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
        flex: 1,
        resizeMode: 'center'
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