import React from 'react';
import { StyleSheet, Text, View, Dimensions, Alert} from 'react-native';
import {SimpleLineIcons} from 'react-native-vector-icons'
import {AuthContext} from '../Context';

export default function Header({title}) {
  const {signOut} = React.useContext(AuthContext);

  return (
    <View style={styles.header}>
      <SimpleLineIcons 
        color = 'white'
        name = 'logout' 
        size = {28} 
        onPress = {() => Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          {text: 'NO', onPress: () => {}},
          {text: 'YES', onPress: () => signOut()},
        ]
        )}
        style = {styles.icon}/>
      <View>
        <Text style={styles.headerText}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: Dimensions.get('screen').width,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
    letterSpacing: 1,
  },
  icon: {
    position: 'absolute',
    left: 16
  }
});