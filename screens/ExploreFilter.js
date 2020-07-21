import React, {useEffect} from 'react';
import {View, Button} from 'react-native';
import {CheckBox} from 'react-native-elements';

function ExploreFilter({route, navigation}) {
    const {allDeals, personalised, openDeals, toggleAll, togglePersonalised, toggleOpen, refresh,
        cardsAndMethods, customisedCards, customisedApps, toggleCustomisedCards, toggleCustomisedApps,
        updateCustomisedCards, updateCustomisedApps} = route.params;
    const [allDealsCheck, setAllCheck] = React.useState(allDeals)
    const [personalisedCheck, setPersonalisedCheck] = React.useState(personalised)
    const [openDealsCheck, setOpenDealsCheck] = React.useState(openDeals)
    const [customisedCardCheck, setCustomisedCardCheck] = React.useState(customisedCards)
    const [customisedAppsCheck, setCustomisedAppsCheck] = React.useState(customisedApps)

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Button onPress={() => {
                    if (!allDealsCheck && !personalisedCheck && !openDealsCheck
                    && !customisedCardCheck && !customisedAppsCheck) {
                        alert("You have not selected any options! Please select one.")
                    } else {
                        refresh();
                        navigation.navigate("Explore")
                    }
                }}
                title= "Back"
                />)
        })
    })

    return (
        <View>
            <CheckBox
                title='All (Unfiltered)'
                checked={allDealsCheck}
                onPress={() => {
                    setAllCheck(!allDealsCheck)
                    toggleAll()
                    if (personalisedCheck) {
                        setPersonalisedCheck(!personalisedCheck)
                        togglePersonalised()
                    }
                    if (openDealsCheck) {
                        setOpenDealsCheck(!openDealsCheck)
                        toggleOpen()
                    }
                }}
            />

            <CheckBox
                title='Personalised (Default)'
                checked={personalisedCheck}
                onPress={() => {
                    setPersonalisedCheck(!personalisedCheck)
                    togglePersonalised()
                    if (allDealsCheck) {
                        setAllCheck(!allDealsCheck)
                        toggleAll()
                    }
                    if (openDealsCheck) {
                        setOpenDealsCheck(!openDealsCheck)
                        toggleOpen()
                    }
                    if (customisedCardCheck) {
                        setCustomisedCardCheck(!customisedCardCheck)
                        toggleCustomisedCards()
                    }
                    if (customisedAppsCheck) {
                        setCustomisedAppsCheck(!customisedAppsCheck)
                        toggleCustomisedApps()
                    }
                }}
            />

            <CheckBox
                title='Open Deals (No restrictions)'
                checked={openDealsCheck}
                onPress={() => {
                    setOpenDealsCheck(!openDealsCheck)
                    toggleOpen()
                    if (allDealsCheck) {
                        setAllCheck(!allDealsCheck)
                        toggleAll()
                    }
                    if (personalisedCheck) {
                        setPersonalisedCheck(!personalisedCheck)
                        togglePersonalised()
                    }
                    if (customisedCardCheck) {
                        setCustomisedCardCheck(!customisedCardCheck)
                        toggleCustomisedCards()
                    }
                    if (customisedAppsCheck) {
                        setCustomisedAppsCheck(!customisedAppsCheck)
                        toggleCustomisedApps()
                    }
                }}
            />

            <CheckBox
                title='Custom Cards'
                checked={customisedCardCheck}
                onPress={() => {
                    if (!customisedCardCheck) {
                        setCustomisedCardCheck(!customisedCardCheck)
                        toggleCustomisedCards()
                    }
                    if (personalisedCheck) {
                        setPersonalisedCheck(!personalisedCheck)
                        togglePersonalised()
                    }
                    if (openDealsCheck) {
                        setOpenDealsCheck(!openDealsCheck)
                        toggleOpen()
                    }
                    if (allDealsCheck) {
                        setAllCheck(!allDealsCheck)
                        toggleAll()
                    }
                    navigation.navigate("Custom Cards", {
                        cards: cardsAndMethods[0],
                        update: updateCustomisedCards,
                    })
                }}
            />

            <CheckBox
                title='Custom Apps'
                checked={customisedAppsCheck}
                onPress={() => {
                    if (!customisedAppsCheck) {
                        setCustomisedAppsCheck(!customisedAppsCheck)
                        toggleCustomisedApps()
                    }
                    if (personalisedCheck) {
                        setPersonalisedCheck(!personalisedCheck)
                        togglePersonalised()
                    }
                    if (openDealsCheck) {
                        setOpenDealsCheck(!openDealsCheck)
                        toggleOpen()
                    }
                    if (allDealsCheck) {
                        setAllCheck(!allDealsCheck)
                        toggleAll()
                    }
                    navigation.navigate("Custom Apps", {
                        apps: cardsAndMethods[1],
                        update: updateCustomisedApps,
                    })
                }}
            />


        </View>
    )
}

export default ExploreFilter;