import React from 'react';
import { StyleSheet, SafeAreaView, Text, View } from 'react-native';
import BlueButton from '../component/BlueButton'

export const Intermediate = ({navigation}) => {
        return (
            <SafeAreaView style = {styles.container}>
                <Text style = {{fontSize: 20}}>You are signing up as a...</Text>
                <View style = {{flexDirection: 'row'}}>
                    <BlueButton
                    style={styles.button}
                    onPress={() => navigation.push('Sign-up')}
                    >
                        Customer
                    </BlueButton>
                    <BlueButton
                    style={styles.button}
                    onPress={() => navigation.push('Merchant sign-up')}
                    >
                        Merchant
                    </BlueButton>

                </View>
                

            </SafeAreaView>
            )
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        marginTop: 20,
        marginHorizontal: 20,
        width: 100,
    },
})