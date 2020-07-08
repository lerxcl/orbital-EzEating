import React from 'react';
import { Text } from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

class UserHistory extends React.Component {
    
    render() {
        return (
            <MapView
                style={{ flex: 1 }}
                provider = {PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: 1.290270,
                    longitude: 103.851959,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05
                }}
            >
            </MapView>
        )
    }
}

export default UserHistory;