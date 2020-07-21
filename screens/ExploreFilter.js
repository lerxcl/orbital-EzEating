import React, {useEffect} from 'react';
import {StyleSheet, Text, View, Image, Button} from 'react-native';
import {CheckBox} from 'react-native-elements';

function ExploreFilter({route, navigation}) {
    const {allDeals, personalised, openDeals, toggleAll, togglePersonalised, toggleOpen, refresh} = route.params;
    const [allDealsCheck, setAllCheck] = React.useState(allDeals)
    const [personalisedCheck, setPersonalisedCheck] = React.useState(personalised)
    const [openDealsCheck, setOpenDealsCheck] = React.useState(openDeals)

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Button onPress={() => {
                    if (!allDealsCheck && !personalisedCheck && !openDealsCheck) {
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
                }}
            />
        </View>
    )
}

export default ExploreFilter;