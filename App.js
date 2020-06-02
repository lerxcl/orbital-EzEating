import React from 'react';
import { StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LogInContainer from './container/LogInContainer';
import SignUpContainer from "./container/SignUpContainer";
import Dashboard from "./container/Dashboard";

const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
      <Stack.Navigator>
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
          <Stack.Screen
              name='Dashboard'
              component={Dashboard}
          />
      </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#fff'
  }
});
