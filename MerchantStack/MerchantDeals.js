import React from 'react';
import { Text, View } from 'react-native';
import BlueButton from '../component/BlueButton'

class MerchantDeals extends React.Component {
    render() {
        return (
            <View>
            <Text>Deals will be listed here</Text>
            <BlueButton
                    onPress={() => this.props.navigation.navigate('My Store')}
                >
                    Profile
                </BlueButton>
                </View>
            )
    }
}

export default MerchantDeals;