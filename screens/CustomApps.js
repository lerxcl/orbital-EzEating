import React from 'react';
import {StyleSheet, Text, View, Image, Button, ActivityIndicator, FlatList, SafeAreaView, Alert} from 'react-native';
import {getMethods} from '../component/API';
import {CheckBox} from 'react-native-elements';

class CustomApps extends React.Component {
    apps = this.props.route.params.apps
    update = this.props.route.params.update
    state = {
        allApps: [],
        loading: true,
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            headerLeft: () => (
                <Button onPress={() => {
                    this.update([[], this.apps])
                    this.props.navigation.navigate("Explore Filter")
                }}
                        title= "Back"
                />)
        })

        if (this.state.loading) {
            getMethods(this.onMethodsReceived)
            this.setState({loading: false})
        }
    }

    onMethodsReceived = (allApps) => {
        allApps.map(item => {
            if (this.apps.includes(item.id)) {
                item.isSelect = true
                const index = this.state.allApps.findIndex(
                    doc => item.id === doc.id
                );
                this.state.allApps[index] = item;
                this.setState({allApps: this.state.allApps})
            } else {
                item.isSelect = false
            }
            return item
        })
        this.setState(prevState => ({
            allApps: prevState.allApps = allApps
        }))
    }

    selectItem = item => {
        if (item.isSelect) {
            this.apps = this.apps.filter(app => app !== item.id)
        } else {
            this.apps.push(item.id)
        }
        item.isSelect = !item.isSelect
        const index = this.state.allApps.findIndex(
            doc => item.id === doc.id
        );
        this.state.allApps[index] = item
        this.setState({
            allApps: this.state.allApps,
        });
        console.log(this.apps)
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size='large'/>
                </View>)
        }

        return (
            <SafeAreaView style={styles.container}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.description}>Check apps that you want to see deals associated with it!</Text>
                </View>
                <Text>(Tap checkbox to add/remove apps)</Text>
                <FlatList
                    data={this.state.allApps}
                    renderItem={({item}) => this.renderItem(item)}
                    keyExtractor={item => item.id}/>
            </SafeAreaView>

        )
    }

    renderItem = item =>
        <View style={{flexDirection: 'row', backgroundColor:'white'}}>
            <CheckBox
                containerStyle={{width:250}}
                checked={item.isSelect}
                title={item.name}
                onPress={() => Alert.alert(
                    'Add/Remove Card',
                    'Are you sure you want to add/remove App?',
                    [
                        {
                            text: 'NO', onPress: () => {
                            }
                        },
                        {text: 'YES', onPress: () => this.selectItem(item)},
                    ]
                )}
            />
            <Image style={styles.cardImage} source={{uri: item.image}}/>
        </View>


}

export default CustomApps;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        alignContent: 'center'
    },
    description: {
        fontSize: 18,
    },
    cardImage: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
    },
})