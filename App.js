import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from './Context';

import {LogInContainer} from "./container/LogInContainer";
import SignUpContainer from "./container/SignUpContainer";
import {Intermediate} from "./container/Intermediate"
import MerchantContainer from "./container/MerchantContainer"
import Header from "./component/Header"

import Explore from "./screens/Explore";
import Home from "./screens/Home"
import Splash from "./screens/Splash"
import AllShops from "./screens/AllShops"
import Shop from "./screens/Shop"
import DealDetails from "./screens/DealDetails"
import Profile from "./ProfileStack/Profile"
import Cards from "./ProfileStack/Cards"
import Details from "./ProfileStack/Details"
import Methods from "./ProfileStack/Methods"
import UserHistory from "./ProfileStack/UserHistory"
import MerchantDeals from "./MerchantStack/MerchantDeals"
import MerchantProfile from "./MerchantStack/MerchantProfile"

const Stack = createStackNavigator();
const Tabs = createMaterialBottomTabNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const ExploreStack = createStackNavigator();
const MerchantStack = createStackNavigator();

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
        <ProfileStack.Screen
            name='My Cards'
            component={Cards}
        />
        <ProfileStack.Screen
            name='My Apps'
            component={Methods}
        />
        <ProfileStack.Screen
            name='Profile Details'
            component={Details}
        />
        <ProfileStack.Screen
            name='History'
            component={UserHistory}
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
        <ExploreStack.Screen
            name='Deal Details'
            component={DealDetails}
        />
    </ExploreStack.Navigator>
)

export default function App() {
    const [userToken, setUserToken] = React.useState(null)
    const [isLoading, setIsLoading] = React.useState(true)
    const [isMerchant, setIsMerchant] = React.useState(false)
    const [mounted, setMounted] = React.useState(true)

    const authContext = React.useMemo(() => {
        return {
            signIn: (merchant) => {
                setIsLoading(false);
                setUserToken("abcd");
                setIsMerchant(merchant)
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
                {userToken ? ( isMerchant ? (
                    <MerchantStack.Navigator>
                        <MerchantStack.Screen
                            name='Deals'
                            component={MerchantDeals}
                        />
                        <MerchantStack.Screen
                            name='My Store'
                            component={MerchantProfile}
                        />
                    </MerchantStack.Navigator>
                ) : (
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
                        </Tabs.Navigator>)) :
                    (<Stack.Navigator>
                        <Stack.Screen
                            name='Login'
                            component={LogInContainer}
                            options={{title: 'Login'}}
                        />
                        <Stack.Screen
                            name='Who are you?'
                            component={Intermediate}
                        />
                        <Stack.Screen
                            name='Merchant sign-up'
                            component={MerchantContainer}
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
