import BlueButton from '../component/BlueButton';
import {Alert, Image, StyleSheet, TextInput, Text, View, KeyboardAvoidingView, TouchableOpacity} from "react-native";
import React from "react";
import firebaseDb from '../firebase/firebaseDb';
import {AuthContext} from '../Context';

export const LogInContainer = ({navigation}) => {
    const {signIn} = React.useContext(AuthContext);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLoginUser = () => {
        if (email === '' || password === '') {
            Alert.alert('Enter details to sign in!')
        } else {
            firebaseDb
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then((res) => {
                    if (firebaseDb.auth().currentUser.displayName === "merchant") {
                        signIn(true)
                    } else {
                        signIn(false)
                    }
                    

                  /*  firebaseDb.firestore().collection('users').get()
                        .then(querySnapshot => {
                            const users = [];
                            querySnapshot.docs.map(documentSnapshot => users.push(documentSnapshot.data()))
                            global.userInfo = (users.filter(user => user.email === email))[0];
                            signIn();
                        })
                        .catch(error => {
                            alert(error.message)
                        })*/
                })
                .catch(error => {
                    alert(error.message)
                })
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
                              style={styles.container}>
            <Image
                style={styles.logo}
                source={require('../images/logo.png')}
            />

            <TextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize='none'
            />

            <TextInput
                placeholder="Password"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                autoCapitalize='none'
            />

            <BlueButton
                style={styles.button}
                onPress={handleLoginUser}
            >
                Login
            </BlueButton>

            <View style={styles.signup}>
                <Text style={styles.text}> New? Sign up</Text>
                <TouchableOpacity
                    onPress={() =>
                        navigation.push('Who are you?')
                    }>
                    <Text style={styles.signupButton}> HERE</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center', 
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
        resizeMode: 'center',
        marginTop: 100
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
