import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View, Image, TouchableOpacity, Button} from 'react-native';
import {CheckBox} from 'react-native-elements';

function ExploreFilter({route}) {
    const {allDeals, personalised, toggleAll, togglePersonalised, refresh} = route.params;
    const [allDealsCheck, setAllCheck] = React.useState(allDeals)
    const [personalisedCheck, setPersonalisedCheck] = React.useState(personalised)

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
                    //refresh()
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
                    //refresh()
                }}
            />
        </View>
    )
}

export default ExploreFilter;