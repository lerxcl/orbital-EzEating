import React from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import {Drawer} from 'react-native-paper';
import {DrawerItem} from '@react-navigation/drawer';

import {SimpleLineIcons} from 'react-native-vector-icons'

import{ AuthContext } from '../Context';

export default function DrawerContent(props) {

    const { signOut } = React.useContext(AuthContext);

    return(
        <SafeAreaView style={styles.drawerContent}>
            <Drawer.Section style={styles.drawerSection}>
                <DrawerItem 
                    icon={({color, size}) => (
                        <SimpleLineIcons 
                        name="present" 
                        color={color}
                        size={size}
                        />
                    )}
                        label="My Deals"
                        onPress={() => {props.navigation.navigate('My Deals')}}
                />
                <DrawerItem 
                    icon={({color, size}) => (
                        <SimpleLineIcons 
                        name="basket-loaded" 
                        color={color}
                        size={size}
                        />
                    )}
                    label="My Store"
                    onPress={() => {props.navigation.navigate('My Store')}}
                />
                <DrawerItem 
                    icon={({color, size}) => (
                        <SimpleLineIcons 
                        name="credit-card" 
                        color={color}
                        size={size}
                        />
                    )}
                    label="Accepted Cards"
                    onPress={() => {props.navigation.navigate('Accepted Cards')}}
                />
                <DrawerItem 
                    icon={({color, size}) => (
                        <SimpleLineIcons 
                        name="screen-smartphone" 
                        color={color}
                        size={size}
                        />
                    )}
                    label="Accepted Apps"
                    onPress={() => {props.navigation.navigate('Accepted Apps')}}
                />
                <DrawerItem 
                    icon={({color, size}) => (
                        <SimpleLineIcons 
                        name="settings" 
                        color={color}
                        size={size}
                        />
                    )}
                    label="Settings"
                    onPress={() => {props.navigation.navigate('Settings')}}
                />
                <DrawerItem 
                    icon={({color, size}) => (
                        <SimpleLineIcons 
                        name="logout" 
                        color={color}
                        size={size}
                        />
                    )}
                    label="Logout"
                    onPress={() => Alert.alert(
                        'Logout',
                        'Are you sure you want to logout?',
                        [
                          {text: 'NO', onPress: () => {}},
                          {text: 'YES', onPress: () => signOut()},
                        ]
                    )}
                />
            </Drawer.Section>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
      marginTop: 50
    },
    drawerSection: {
      marginTop: 15,
    }
  });