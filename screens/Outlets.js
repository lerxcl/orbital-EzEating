import React, {useEffect} from 'react';
import {ActivityIndicator, View, StyleSheet} from "react-native";
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

function Outlets({route}) {
    const {shop} = route.params;
    const [markers, setMarkers] = React.useState([])
    const [loading, setLoading] = React.useState(true);

useEffect(() => {
    async function func() {
            //Assign the promise unresolved first then get the data using the json method. 
            const ApiCall = await fetch('https://api.dominos.com.sg/api/Stores');
            const outlets = await ApiCall.json();
            setMarkers(outlets.map(outlet => {
                if (outlet["Status"] === "OK") {
                    outlet["Traffic"] = "Normal"
                } else {
                    outlet["Traffic"] = outlet["StatusSummary"]
                }
                return outlet
            }))
          }
          // Execute the created function directly
    if (loading) {
        func();
    }
    return () => setLoading(false)
})

    if (loading)
    return (
        <View style={styles.container}>
            <ActivityIndicator size='large'/>
        </View>)

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
            coordinate={{latitude: parseFloat(marker["Latitude"]), longitude: parseFloat(marker["Longitude"])}}
            title = {marker["Address"]}
            description = {marker["Traffic"]}
            id = {marker["Id"]}
            />
        ))}
        </MapView>
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


