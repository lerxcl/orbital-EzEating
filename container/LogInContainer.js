import BlueButton from '../component/BlueButton';
import {Image, StyleSheet, TextInput, Text, View, KeyboardAvoidingView} from "react-native";
import React from "react";
//import firebaseDb from '../firebaseDb';

class LogInContainer extends React.Component {
    state = {
        username: '',
        password: '',
    };

    inputUsername = (username) => this.setState({username});
    inputPassword = (password) => this.setState({password});

    /* adding database later.
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

     */

    render() {
        const { username, password, signInSuccessful } = this.state

        return (
            <KeyboardAvoidingView behavior='padding' style={styles.container}>
                <View style={styles.spaceLogo}>
                    <Image
                        style={styles.logo}

                    />
                    <Text>Logo here</Text>
                </View>

                <TextInput
                    placeholder="Username"
                    style={styles.input}
                    value={username}
                    onChangeText={this.inputUsername}
                />

                <TextInput
                    placeholder="Password"
                    style={styles.input}
                    value={password}
                    onChangeText={this.inputPassword}
                />

                <BlueButton
                    style={styles.button}
                    //onPress={this.handleCreateUser}
                    onPress={() => {
                        if (this.state.username.length && this.state.password.length) {
                            this.setState( {
                                username: '',
                                password: ''
                            })
                        }}}
                >
                    Login
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

export default LogInContainer;