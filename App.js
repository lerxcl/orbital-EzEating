import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from './Context';

import {LogInContainer} from "./container/LogInContainer";
import SignUpContainer from "./container/SignUpContainer";
import Explore from "./screens/Explore";
import Home from "./screens/Home"
import Profile from "./screens/Profile"
import Splash from "./screens/Splash"
import AllShops from "./screens/AllShops"
import Shop from "./screens/Shop"
import Header from "./component/Header"

const Stack = createStackNavigator();
const Tabs = createMaterialBottomTabNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const ExploreStack = createStackNavigator();

function HomeStackScreen() {
    return (
        <HomeStack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#455a64",
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    color: 'white'
                },
                headerTitleAlign: 'center',
            }}>
            <HomeStack.Screen
                name='Home'
                component={Home}
                options={{headerTitle: () => <Header title="Home"/>}}
            />
            <HomeStack.Screen
                name='All Shops'
                component={AllShops}
            />
            <HomeStack.Screen
                name='Shop Details'
                component={Shop}
            />
        </HomeStack.Navigator>
    )
}

const ProfileStackScreen = () => (
    <ProfileStack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: "#454b64",
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            headerTitleAlign: 'center',
        }}
    >
        <ProfileStack.Screen
            name='Profile'
            component={Profile}
        />
    </ProfileStack.Navigator>
)

const ExploreStackScreen = () => (
    <ExploreStack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: "#64455a",
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
                color: 'white'
            },
            headerTitleAlign: 'center',
        }}>
        <ExploreStack.Screen
            name='Explore'
            component={Explore}
        />
    </ExploreStack.Navigator>
)

export default function App() {
    const [userToken, setUserToken] = React.useState(null)
    const [isLoading, setIsLoading] = React.useState(true)
    const [mounted, setMounted] = React.useState(true)

    const authContext = React.useMemo(() => {
        return {
            signIn: () => {
                setIsLoading(false);
                setUserToken("abcd");
            },
            signOut: () => {
                setIsLoading(false);
                setUserToken(null)
            }
        }
    }, [])

    React.useEffect(() => {
        if (mounted) {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000)
        setMounted(false)
    }
    }, []);

    if (isLoading) {
        return <Splash/>
    }

    return (
        <AuthContext.Provider value={authContext}>
            <NavigationContainer>
                {userToken ? (
                        <Tabs.Navigator
                            shifting
                        >
                            <Tabs.Screen
                                name="Home"
                                component={HomeStackScreen}
                                options={{
                                    tabBarLabel: 'Home',
                                    tabBarColor: "#455a64",
                                    tabBarIcon: ({color}) => (
                                        <MaterialCommunityIcons name="home" color={color} size={26}/>
                                    ),
                                }}
                            />
                            <Tabs.Screen
                                name="Profile"
                                component={ProfileStackScreen}
                                options={{
                                    tabBarLabel: 'Profile',
                                    tabBarColor: "#454b64",
                                    tabBarIcon: ({color}) => (
                                        <MaterialCommunityIcons name="account" color={color} size={26}/>
                                    ),
                                }}
                            />
                            <Tabs.Screen
                                name="Explore"
                                component={ExploreStackScreen}
                                options={{
                                    tabBarLabel: 'Explore',
                                    tabBarColor: "#64455a",
                                    tabBarIcon: ({color}) => (
                                        <MaterialCommunityIcons name="earth" color={color} size={26}/>
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
