import React from 'react';
import { View, StyleSheet, Text, FlatList} from 'react-native';
import firebaseDb from '../firebase/firebaseDb';

class Reviews extends React.Component {
    userId = firebaseDb.auth().currentUser.uid
    userDoc = firebaseDb.firestore().collection('shops').doc(this.userId)

    state = {
        reviews: []
    }
    
    componentDidMount() {
        this.userDoc.get().then(snapshot => {
            if (!(snapshot.data().numReviews === undefined)) {
                this.setState({
                    reviews: snapshot.data().review
                })
            }
        })
    }

    render() {
        const {reviews} = this.state

        return (
            <View style = {styles.container}>
                {reviews && 
                <FlatList
                data={reviews}
                renderItem={({item}) => (
                    <Text style = {styles.itemContainer}>{item}</Text>
                )}
                keyExtractor={item => item}/>}

                {!reviews &&
                <Text>No reviews yet!</Text>}
            </View>
        )
    }
}

export default Reviews;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemContainer: {
        borderColor: 'black',
        borderBottomWidth: 1,
        paddingHorizontal: 16,
        width: 350,
        marginTop: 20,
        marginVertical: 10,
        paddingVertical: 10,
        alignItems: 'center'
    },
})