import React, {useEffect} from 'react';
import {ActivityIndicator, View, StyleSheet, Alert, Text} from "react-native";
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

function Outlets({route}) {
    const {shop} = route.params;
    const [markers, setMarkers] = React.useState([])
    const [loading, setLoading] = React.useState(true);
    const [location, setLocation] = React.useState(null);

    const requestLocationPermission = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status === 'granted') {
            let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Highest});
            const { latitude , longitude } = location.coords
            let initialPosition = {
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.09,
                longitudeDelta: 0.035
              }
              console.log(latitude + " " + longitude)
            setLocation(initialPosition)
        } else {
          throw new Error('Location permission not granted');
        }
      }

    useEffect(() => {
        async function func() {
            const ApiCall = await fetch('https://api.dominos.com.sg/api/Stores');
            const outlets = await ApiCall.json();
            setMarkers(outlets)
        }
        if (loading) {
            if (shop.shopName === "Dominos") {
                requestLocationPermission();
                func();
            }
            else if (shop.outlets !== undefined) {
                requestLocationPermission();
                setMarkers(shop.outlets);
            }
        }
        setLoading(false)
    })

    if (loading)
    return (
        <View style={styles.container}>
            <ActivityIndicator size='large'/>
        </View>)

    else if (markers.length === 0)
    return (
        <View style = {styles.container}>
            <Text>No stated outlets!</Text>
        </View>
    )
    
    else if (shop.shopName === "Dominos")
    return (
        <MapView
            style={{ flex: 1 }}
            provider = {PROVIDER_GOOGLE}
            showsUserLocation = {true}
            initialRegion={location}
        >
        {markers.map(marker => (
            <Marker
            coordinate={{latitude: parseFloat(marker["Latitude"]), longitude: parseFloat(marker["Longitude"])}}
            key = {marker["Id"]}
            title = {marker["Name"]}
            description = {marker["StatusReason"] ? "Traffic: " + marker["StatusSummary"] : "Traffic: Normal"}
            onCalloutPress = {() => Alert.alert(marker["Name"], marker["Address"] + "\n\n" + marker["StatusReason"])}
            >
            {marker["Status"] === "OK" ? <MaterialIcons name = 'local-pizza' color = 'green' size = {35}/> : null}
            {marker["Status"] === "H" ? <MaterialIcons name = 'local-pizza' color = 'yellow' size = {35}/> : null}
            {marker["Status"] === "N" ? <MaterialIcons name = 'local-pizza' color = 'orange' size = {35}/> : null}
            {marker["Status"] === "O" ? <MaterialIcons name = 'local-pizza' color = 'red' size = {35}/> : null}
            {marker["Status"] === "S" ? <MaterialIcons name = 'error' color = 'red' size = {30}/> : null}
            
            </Marker>
        ))}     
        </MapView>
    )

    else return (
        <MapView
            style={{ flex: 1 }}
            provider = {PROVIDER_GOOGLE}
            initialRegion={location}
            showsUserLocation = {true}
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


