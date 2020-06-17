import React from 'react';
import { Alert, StyleSheet, Text, View} from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import{ AuthContext } from '../Context';

export default function DrawerHeader({ title, navigation, isLogout}) {

  const openMenu = () => {
    navigation.openDrawer();
  }

  const { signOut } = React.useContext(AuthContext);

  return (
    <View style={styles.header}>
      <MaterialCommunityIcons name='menu' size={28} color = 'white' onPress={openMenu} style={styles.icon} />
      <View>
        <Text style={styles.headerText}>{title}</Text>
      </View>
      {isLogout && <MaterialCommunityIcons 
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
        style = {styles.logout}/>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
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
    left: -70,
  },
  logout: {
    position: 'absolute',
    right: -70
  }
});