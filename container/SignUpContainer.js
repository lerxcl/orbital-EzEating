import BlueButton from '../component/BlueButton';
import {Alert, Image, StyleSheet, TextInput, Text, KeyboardAvoidingView} from "react-native";
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
            (firebaseDb.auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(() => {
                    this.setState({
                        name: '',
                        email: '',
                        password: '',
                        signUpSuccessful: true
                    })
                })
                .catch(err => console.error(err)));

            // TODO
            // if (this.state.signUpSuccessful) {
            //     firebaseDb.firestore().collection('users')
            //         .add({
            //             name: this.state.name,
            //             email: this.state.email,
            //             cards: this.state.cards,
            //             platforms: this.state.platforms
            //         })
            //     this.props.navigation.navigate('Login');
            // }

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
                    secureTextEntry= {true}
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
        borderRadius: 25,
        paddingHorizontal: 16,
        width: 300,
        fontSize: 16,
        marginVertical: 10,
        paddingVertical: 10
    },
    logo: {
        flex: 2,
        resizeMode: 'center'
    },
    button: {
        marginTop: 20,
        borderRadius: 25,
        width: 300,
    },
    text: {
        fontSize: 20,
        color: 'green',
        marginTop: 200
    }
});

export default SignUpContainer;