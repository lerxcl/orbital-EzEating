import React from 'react';
import { View, StyleSheet, Text, FlatList} from 'react-native';
import firebaseDb from '../firebase/firebaseDb';
import StarRating from "react-native-star-rating";

class Reviews extends React.Component {
    userId = firebaseDb.auth().currentUser.uid
    userDoc = firebaseDb.firestore().collection('shops').doc(this.userId)

    state = {
        reviews: []
    }
    
    componentDidMount() {
        this.userDoc.get().then(snapshot => {
            if (snapshot.data().numReviews !== undefined) {
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
                {reviews.length > 0 && 
                <FlatList
                data={reviews}
                renderItem={({item}) => (
                    <View style = {styles.itemContainer}>
                    <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={item.rating}
                        starSize = {20}
                        />
                        <Text style = {{marginTop: 5}}>{item.text}</Text>
                        <Text style = {{fontWeight: 'bold'}}>By: {item.name}</Text>
                    </View>
                )}
                keyExtractor={item => item.text}/>}

                {reviews.length === 0 &&
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
        paddingVertical: 10,
        alignItems: 'flex-start'
    },
})