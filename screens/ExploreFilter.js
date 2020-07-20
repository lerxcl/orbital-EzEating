import React, {useEffect} from 'react';
import {StyleSheet, Text, View, Image, Button} from 'react-native';
import {CheckBox} from 'react-native-elements';

function ExploreFilter({route, navigation}) {
    const {allDeals, personalised, toggleAll, togglePersonalised, refresh} = route.params;
    const [allDealsCheck, setAllCheck] = React.useState(allDeals)
    const [personalisedCheck, setPersonalisedCheck] = React.useState(personalised)

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Button onPress={() => {
                    refresh();
                    navigation.navigate("Explore")
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
                    setPersonalisedCheck(!personalisedCheck)
                    toggleAll()
                    togglePersonalised()
                }}
            />

            <CheckBox
                title='Personalised (Default)'
                checked={personalisedCheck}
                onPress={() => {
                    setAllCheck(!allDealsCheck)
                    setPersonalisedCheck(!personalisedCheck)
                    togglePersonalised()
                    toggleAll()
                }}
            />
        </View>
    )
}

export default ExploreFilter;