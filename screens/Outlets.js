import React, {useEffect} from 'react';
import {ActivityIndicator, View, StyleSheet, Text, Alert} from "react-native";
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

function Outlets({route}) {
    const {shop} = route.params;
    const [markers, setMarkers] = React.useState([])
    const [loading, setLoading] = React.useState(true);

useEffect(() => {
    if (loading) {
        if (shop.outlets !== undefined)
            setMarkers(shop.outlets)
    }
    setLoading(false)
})

    if (loading)
    return (
        <View style={styles.container}>
            <ActivityIndicator size='large'/>
        </View>)

    else if (markers.length !== 0)
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
        {markers.map(marker => (
            <Marker
            coordinate={{latitude: marker.lat, longitude: marker.long}}
            title={marker.name}
            onCalloutPress={() => Alert.alert(marker.name, marker.address)}
            key = {marker.id}
            />
        ))}
        </MapView>
    )

    else return (
        <View style = {styles.container}>
            <Text>No stated outlets!</Text>
        </View>
    )
}

export default Outlets;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})


