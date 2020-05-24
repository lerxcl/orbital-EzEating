import BlueButton from '../component/BlueButton';
import {Image, StyleSheet, TextInput, Text, View, KeyboardAvoidingView} from "react-native";
import React from "react";
import firebaseDb from '../firebaseDb';

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

    login = () => {
        if (this.state.name.length && this.state.email.length && this.state.password.length) {
            this.setState( {
                    name: '',
                    email: '',
                    password: ''
                })
        }
    }

    handleCreateUser = () => firebaseDb.firestore()
        .collection('users')
        .add({
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
        }).then(() => this.setState({
            name: '',
            email: '',
            password: '',
            signUpSuccessful: true
        })).catch(err => console.error(err))

    render() {
        const { name, email, password, signUpSuccessful } = this.state

        return (
            <KeyboardAvoidingView behavior='padding' style={styles.container}>
                <View style={styles.spaceLogo}>
                    <Image
                        style={styles.logo}
                        source={{
                            uri: 'http://www.nus.edu.sg/images/default-source/base/logo.png'
                        }}
                    />
                </View>

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
                    //onPress={this.handleCreateUser}
                    onPress={() => {
                        if (this.state.name.length && this.state.email.length && this.state.password.length) {
                            this.setState( {
                                name: '',
                                email: '',
                                password: ''
                            })
                        }}}
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
    spaceLogo: {
        marginBottom: 40
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
        width: 220,
        height: 100,
    },
    button: {
        marginTop: 42
    },
    text: {
        fontSize: 20,
        color: 'blue',
        marginTop: 200
    }
});

export default SignUpContainer;