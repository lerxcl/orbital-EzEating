import React from 'react';
import { StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from './Context';

import {LogInContainer} from "./container/LogInContainer";
import SignUpContainer from "./container/SignUpContainer"; 
import Explore from "./screens/Explore";
import Home from "./screens/Home"
import Profile from "./screens/Profile"
import Splash from "./screens/Splash"


const Stack = createStackNavigator();
const Tabs = createMaterialBottomTabNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const ExploreStack = createStackNavigator();

const HomeStackScreen =  () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name = 'Home'
      component = {Home}
    />
  </HomeStack.Navigator>
)

const ProfileStackScreen =  () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name = 'Profile'
      component = {Profile}
    />
  </ProfileStack.Navigator>
)

const ExploreStackScreen =  () => (
  <ExploreStack.Navigator>
    <ExploreStack.Screen
      name = 'Explore'
      component = {Explore}
    />
  </ExploreStack.Navigator>
)

export default function App() {
  const [userToken, setUserToken] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true);
  
  const authContext = React.useMemo(() =>{
    return {
      signIn: () => {
        setIsLoading(false);
        setUserToken('asdf')
      },
      signOut: () => {
        setIsLoading(false);
        setUserToken(null)
      }
    }
  }, [])

  React.useEffect( () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000)
    }, []);

    if (isLoading) {
      return <Splash/>
    }

  return (
    <AuthContext.Provider value = {authContext}>
    <NavigationContainer>
      {userToken? (
      <Tabs.Navigator>
        <Tabs.Screen 
          name = "Home"
          component = {HomeStackScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }} 
        />
        <Tabs.Screen 
          name = "Profile"
          component = {ProfileStackScreen} 
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account" color={color} size={26} />
            ),
          }}
        />
        <Tabs.Screen 
          name = "Explore"
          component = {ExploreStackScreen }
          options={{
            tabBarLabel: 'Explore',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="earth" color={color} size={26} />
            ),
          }} 
        />
      </Tabs.Navigator>) :
      (<Stack.Navigator>
          <Stack.Screen
              name='Login'
              component={LogInContainer}
              options={{title: 'Login'}}
          />
          <Stack.Screen
              name='Sign-up'
              component={SignUpContainer}
              options={{title: 'Sign-up'}}
          />
      </Stack.Navigator>)}
      </NavigationContainer>
      </AuthContext.Provider>
  );
}




const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#fff'
  }
});
