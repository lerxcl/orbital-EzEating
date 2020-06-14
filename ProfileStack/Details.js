import React from 'react';
import { Text, View, SafeAreaView, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import firebaseDb from '../firebase/firebaseDb';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import BlueButton from '../component/BlueButton';
import Dialog from "react-native-dialog";

class Details extends React.Component {
    currentUser = firebaseDb.auth().currentUser
    newName = ''
    newEmail = ''
    newPassword = null
    newPassword2 = null
    state = {
        name: this.currentUser.displayName,
        email: this.currentUser.email,
        nameDialogVisible: false,
        emailDialogVisible: false,
        pwDialogVisible: false
    }

    setName = (newName) => {
        this.newName = newName
    }

    setEmail = (newEmail) => {
        this.newEmail = newEmail
    }

    setPassword = (newPassword) => {
        this.newPassword = newPassword
    }
    setPassword2 = (newPassword2) => {
        this.newPassword2 = newPassword2
    }

    render() {
        const {name, email} = this.state

        return (
            <SafeAreaView style = {styles.container}>
                <View style={styles.textContainer}>
                    <Text style = {{fontSize: 20}}>Name: {name}</Text>
                    <TouchableOpacity style = {styles.edit} 
                        onPress={() => this.setState({nameDialogVisible: true})}>
                        <MaterialCommunityIcons name = "pencil-outline" size = {25}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.textContainer}>
                    <Text style = {{fontSize: 20}}>Email: {email}</Text>
                    <TouchableOpacity style = {styles.edit} 
                        onPress={() => this.setState({emailDialogVisible: true})}>
                        <MaterialCommunityIcons name = "pencil-outline" size = {25}/>
                    </TouchableOpacity>
                </View>

                <Dialog.Container visible={this.state.nameDialogVisible}>
                    <Dialog.Title>Change name</Dialog.Title>
                    <Dialog.Description>
                        Enter your new name
                    </Dialog.Description>
                    <Dialog.Input placeholder = "Name" onChangeText = {this.setName}/>
                    <Dialog.Button label = "Cancel" onPress = {() => this.setState({nameDialogVisible: false})}/>
                    <Dialog.Button label = "Submit" onPress = {() => {
                        this.setState({nameDialogVisible: false, name: this.newName})
                        this.currentUser.updateProfile({displayName: this.newName})
                    }}/> 
                </Dialog.Container>

                <Dialog.Container visible={this.state.emailDialogVisible}>
                    <Dialog.Title>Change email</Dialog.Title>
                    <Dialog.Description>
                        Enter your new email
                    </Dialog.Description>
                    <Dialog.Input placeholder = "Email" onChangeText = {this.setEmail}/>
                    <Dialog.Button label = "Cancel" onPress = {() => this.setState({emailDialogVisible: false})}/>
                    <Dialog.Button label = "Submit" onPress = {() => {
                        this.setState({emailDialogVisible: false, email: this.newEmail})
                        this.currentUser.updateEmail(this.newEmail).catch(err => Alert.alert(err))
                    }}/> 
                </Dialog.Container>

                <Dialog.Container visible={this.state.pwDialogVisible}>
                    <Dialog.Title>Change password</Dialog.Title>
                    <Dialog.Description>
                        Enter your new password
                    </Dialog.Description>
                    <Dialog.Input placeholder = "New password" secureTextEntry = {true} onChangeText = {this.setPassword}/>
                    <Dialog.Input placeholder = "Re-enter new password" secureTextEntry = {true} onChangeText = {this.setPassword2}/>
                    <Dialog.Button label = "Cancel" onPress = {() => this.setState({pwDialogVisible: false})}/>
                    <Dialog.Button label = "Submit" onPress = {() => {
                        if (this.newPassword === this.newPassword2) {
                        this.setState({pwDialogVisible: false})
                        this.currentUser.updatePassword(this.newPassword).catch(err => Alert.alert(err))
                    } else {Alert.alert('Password does not match')}}}/> 
                </Dialog.Container>

                <View style = {{flex: 1,justifyContent: 'flex-end', marginBottom: 20}}>
                <BlueButton style = {{marginTop: 20}} onPress = {() => this.setState({pwDialogVisible: true})}>
                    <Text style = {{fontSize: 20}}>Change Password</Text>
                </BlueButton>
                </View>
            </SafeAreaView>
            )
    }
}

export default Details;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    edit: {
        position: "absolute",
        width: 50,
        height: 50,
        right: 10,
        alignItems: "flex-end",
        justifyContent: "center"
    },
    textContainer: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        paddingHorizontal: 16,
        width: 400,
        marginVertical: 10,
        paddingVertical: 15,
    },
})