import BlueButton from '../component/BlueButton';
import {Alert, Image, StyleSheet, TextInput, Text, View, KeyboardAvoidingView} from "react-native";
import React from "react";
import firebaseDb from '../firebase/firebaseDb';

class LogInContainer extends React.Component {
    state = {
        email: '',
        password: '',
    };

    inputEmail = (email) => this.setState({email});
    inputPassword = (password) => this.setState({password});

    handleLoginUser = () => {
        if (this.state.email === '' || this.state.password === '') {
            Alert.alert('Enter details to sign in!')
        } else {
            firebaseDb
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then((res) => {
                    console.log(res)
                    console.log('User logged-in successfully!')
                    this.setState({
                        email: '',
                        password: ''
                    })
                    this.props.navigation.navigate('Dashboard')
                })
                .catch(error => this.setState({errorMessage: error.message}))
        }
    }

    render() {
        const {email, password} = this.state

        return (
            <KeyboardAvoidingView behavior='padding' style={styles.container}>
                <Image
                    style={styles.logo}
                    source={require('../images/logo.png')}
                />

                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    value={email}
                    onChangeText={this.inputEmail}
                />

                <TextInput
                    placeholder="Password"
                    style={styles.input}
                    value={password}
                    onChangeText={this.inputPassword}
                />

                <BlueButton
                    style={styles.button}
                    onPress={this.handleLoginUser}
                >
                    Login
                </BlueButton>

                <BlueButton
                    style={styles.button}
                    onPress={() =>
                        this.props.navigation.navigate('Sign-up')
                    }
                >
                    New? Sign-Up here
                </BlueButton>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0.9,
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
        flex: 0.8,
        resizeMode: 'center'
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