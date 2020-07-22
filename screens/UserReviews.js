import React, {useEffect} from 'react';
import { View, StyleSheet, Text, ActivityIndicator, FlatList } from 'react-native';
import StarRating from "react-native-star-rating";

function UserReviews({route}) {
    const {shop} = route.params;
    const [reviews, setReviews] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        if (loading) {
            setReviews(shop)
        }
        setLoading(false)
    })

    if (loading)
        return (
        <View style={styles.container}>
            <ActivityIndicator size='large'/>
        </View>)

        return (
            <View style = {styles.container}>
                {reviews && 
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

                {!reviews &&
                <Text>Be the first to write a review!</Text>}
            </View>
        )
}

export default UserReviews;

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