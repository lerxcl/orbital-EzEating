import React from 'react';
import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    Alert,
    ActivityIndicator,
    FlatList,
    Image
} from 'react-native';
import firebaseDb from '../firebase/firebaseDb';
import {getMethods} from '../component/API';
import {CheckBox} from 'react-native-elements';

class Methods extends React.Component {
    state = {
        allMethods: [],
        loading: true
    }
    userId = firebaseDb.auth().currentUser.uid
    userDoc = firebaseDb.firestore().collection('users').doc(this.userId)

    componentDidMount() {
        getMethods(this.onMethodsReceived).then(() => {
            this.getData()
        })
    }

    onMethodsReceived = (allMethods) => {
        allMethods.map(item => {
            item.isSelect = false
            return item
        })
        this.setState(prevState => ({
            allMethods: prevState.allMethods = allMethods
        }))
    }

    getData = () => {
        this.userDoc.get()
            .then(snapshot => {
                let methods = snapshot.data().methods
                return methods
            })
            .then(methods => {
                for (var i = 0; i < this.state.allMethods.length; i++) {
                    if (methods.includes(this.state.allMethods[i].id)) {
                        this.selectItem(this.state.allMethods[i])
                    }
                }
                this.setState({loading: false})
            }).catch(err => console.log(err))
    }

    selectItem = item => {
        if (item.isSelect) {
            this.userDoc.update({
                methods: firebaseDb.firestore.FieldValue.arrayRemove(item.id)
            })
        } else {
            this.userDoc.update({
                methods: firebaseDb.firestore.FieldValue.arrayUnion(item.id)
            })
        }
        item.isSelect = !item.isSelect

        const index = this.state.allMethods.findIndex(
            doc => item.id === doc.id
        );

        this.state.allMethods[index] = item

        this.setState({
            allMethods: this.state.allMethods,
        });
    }


    renderItem = item =>
        <View style={{flexDirection: 'row'}}>
            <CheckBox
                checked={item.isSelect}
                title={item.name}
                onPress={() => Alert.alert(
                    'Add/Remove Payment App',
                    'Are you sure you want to add/remove app?',
                    [
                        {
                            text: 'NO', onPress: () => {
                            }
                        },
                        {text: 'YES', onPress: () => this.selectItem(item)},
                    ]
                )}
            >
            </CheckBox>
            <Image style={styles.image} source={{uri: item.image}}/>
        </View>

    render() {
        const {allMethods, loading} = this.state

        if (loading) {
            console.log("Loading");
            return (
                <View style={styles.container}>
                    <ActivityIndicator size='large'/>
                </View>)
        }

        return (
            <SafeAreaView style={styles.container}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.description}>Linked apps are checked</Text>
                </View>
                <Text>(Tap checkbox to add/remove apps)</Text>
                <FlatList
                    data={allMethods}
                    renderItem={({item}) => this.renderItem(item)}
                    keyExtractor={item => item.id}/>
            </SafeAreaView>
        )
    }
}

export default Methods;

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
    image: {
        width: 150,
        height: 100,
        resizeMode: 'contain',
    },
})