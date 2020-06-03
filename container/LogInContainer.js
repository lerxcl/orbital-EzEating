import BlueButton from '../component/BlueButton';
import {Alert, Image, StyleSheet, TextInput, Text, View, KeyboardAvoidingView, TouchableOpacity} from "react-native";
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
                    secureTextEntry = { true}
                />

                <BlueButton
                    style={styles.button}
                    onPress={this.handleLoginUser}
                >
                    Login
                </BlueButton>
                <View style = {styles.signup}>
                    <Text style = {styles.text}> New? Sign up</Text>
                    <TouchableOpacity 
                        onPress={() =>
                            this.props.navigation.navigate('Sign-up')
                        }>
                        <Text style = {styles.signupButton}> HERE</Text>
                    </TouchableOpacity>
                </View>
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
        flex: 2,
        resizeMode: 'center'
    },
    button: {
        marginTop: 20,
        borderRadius: 25,
        width: 300,
    },
    text: {
        fontSize: 16,
    },
    signup: {
        flexGrow: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingVertical: 16,
        flexDirection: 'row'
    },
    signupButton: {
        color: '#455a64',
        fontSize: 16,
        fontWeight: 'bold'
    }

});

export default LogInContainer;