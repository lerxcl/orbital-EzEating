import BlueButton from '../component/BlueButton';
import {Alert, Image, StyleSheet, TextInput, Text, View, KeyboardAvoidingView} from "react-native";
import React from "react";
import firebaseDb from '../firebase/firebaseDb';

class SignUpContainer extends React.Component {
    state = {
        name: '',
        email: '',
        password: '',
        signUpSuccessful: false
    };

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
                .then(() => {
                    this.setState({
                        name: '',
                        email: '',
                        password: '',
                        signUpSuccessful: true
                    })
                })
            this.props.navigation.navigate('Login')
                .catch(err => console.error(err))
        }
    }

    render() {
        const {name, email, password, signUpSuccessful} = this.state

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
        flex: 0.8,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        borderColor: 'black',
        borderWidth: 1,
        width: 200,
        height: 30,
        fontSize: 20,
        marginBottom: 8
    },
    logo: {
        flex: 1,
        resizeMode: 'center'
    },
    button: {
        marginTop: 42
    },
    text: {
        fontSize: 20,
        color: 'green',
        marginTop: 200
    }
});

export default SignUpContainer;