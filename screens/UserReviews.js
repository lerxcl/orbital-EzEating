import React, {useEffect} from 'react';
import { View, StyleSheet, Text, ActivityIndicator, FlatList } from 'react-native';

function UserReviews({route}) {
    const {shop} = route.params;
    const[reviews, setReviews] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        if (loading) {
            setReviews(shop.review)
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
                    <Text style = {styles.itemContainer}>{item}</Text>
                )}
                keyExtractor={item => item}/>}

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
        marginTop: 20,
        marginVertical: 10,
        paddingVertical: 10,
        alignItems: 'center'
    },
})