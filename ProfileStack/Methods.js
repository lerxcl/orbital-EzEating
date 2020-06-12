import React from 'react';
import { Text, View, SafeAreaView, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, FlatList} from 'react-native';
import firebaseDb from '../firebase/firebaseDb';
import {getMethods} from '../component/API';


class Methods extends React.Component {
    state = {
        allMethods: [],
        loading: true
    }
    userId = firebaseDb.auth().currentUser.uid
    userDoc = firebaseDb.firestore().collection('users').doc(this.userId)

    componentDidMount() {
        getMethods(this.onMethodsReceived).then(() => {
            this.getData()})
    }

    onMethodsReceived = (allMethods) => {
        allMethods.map(item => {
            item.isSelect = false
            item.selectedClass = styles.itemContainer
            return item
        })
        this.setState(prevState => ({
            allMethods: prevState.allMethods = allMethods
        }))}
    
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
                this.setState({loading:false})
            }).catch(err => console.log(err))
    }

    selectItem = item => {
        if (item.isSelect) {
            this.userDoc.update({
                methods: firebaseDb.firestore.FieldValue.arrayRemove(item.id)})
        } else {
            this.userDoc.update({
                methods: firebaseDb.firestore.FieldValue.arrayUnion(item.id)})
        }
        item.isSelect = !item.isSelect
        item.selectedClass = item.isSelect ? styles.selected : styles.itemContainer;
            
        const index = this.state.allMethods.findIndex(
            doc => item.id === doc.id
        );
        
        this.state.allMethods[index] = item

        this.setState({
          allMethods: this.state.allMethods,
        });
      }


    renderItem = item =>
      <TouchableOpacity
        style={[styles.itemContainer, item.selectedClass]}      
        onPress={() => Alert.alert(
            'Add/Remove Payment App',
            'Are you sure you want to add/remove app?',
            [
              {text: 'NO', onPress: () => {}},
              {text: 'YES', onPress: () => this.selectItem(item)},
            ]
        )}
      >
      <Text style={styles.name}>  {item.name}  </Text>
    </TouchableOpacity>
    
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
            <SafeAreaView style = {styles.container}>
                <View style = {{flexDirection: 'row'}}>
            <Text style = {styles.description} >Linked apps are </Text>
            <Text style = {styles.highlight}>highlighted</Text> 
            </View>
            <Text>(Click to add/remove apps)</Text>
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
        flexDirection: 'column',
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
    highlight: {
        fontSize: 18,
        backgroundColor: "#b8d5cd"
    },
    itemContainer: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 16,
        width: 300,
        marginTop: 20,
        marginVertical: 10,
        paddingVertical: 10,
        alignContent: 'center'
    },
    selected: {
        backgroundColor: "#b8d5cd"
    },
})