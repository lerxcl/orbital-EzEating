import React, {useEffect, useState} from 'react';
import {Alert, TouchableOpacity, StyleSheet, Text, View, Image, ScrollView, ActivityIndicator} from "react-native";
import firebaseDb from '../firebase/firebaseDb';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import Dialog from "react-native-dialog";
import BlueButton from '../component/BlueButton';
import {MultiPickerMaterialDialog} from 'react-native-material-dialog';
import {getCards, getMethods} from '../component/API';
import {ProgressBar} from 'react-native-paper';

function MerchantDealDetails({navigation, route}) {
    const {deal, refresh} = route.params;
    const [isLoading, setIsLoading] = useState(true)
    const [image, setImage] = useState(deal.image)
    const [title, setTitle] = useState(deal.title)
    const [desc, setDesc] = useState(deal.description)
    const [monetaryValue, setMonetaryValue] = useState(deal.monetaryValue)
    const [newTitle, setNewTitle] = useState('')
    const [newDesc, setNewDesc] = useState('')
    const [newMonetaryValue, setNewMonetaryValue] = useState('')
    const [titleDialog, setTitleDialog] = useState(false)
    const [descDialog, setDescDialog] = useState(false)
    const [monetaryValueDialog, setMonetaryValueDialog] = useState(false)
    const [cardVisible, setCardVisible] = useState(false)
    const [methodVisible, setMethodVisible] = useState(false)
    const [cards, setCards] = useState([])
    const [selectedCards, setSelectCards] = useState([])
    const [methods, setMethods] = useState([])
    const [selectedMethods, setSelectMethods] = useState([])
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false)

    const userId = firebaseDb.auth().currentUser.uid

    useEffect(() => {
        if (isLoading) {
            getPermissionAsync()
            getCards(onCardsReceived)
            getMethods(onMethodsReceived)
        }
    })

    const onCardsReceived = (allCards) => {
        allCards.map(item => {
            item.label = item.name
            item.value = item.id
            return item
        })
        setCards(allCards)
        const result = [...allCards].filter(card => deal.cards.includes(card.id))
        setSelectCards(result)
    }

    const onMethodsReceived = (allMethods) => {
        allMethods.map(item => {
            item.label = item.name
            item.value = item.id
            return item
        })
        setMethods(allMethods)
        const result = [...allMethods].filter(method => deal.methods.includes(method.id))
        setSelectMethods(result)
        setIsLoading(false)
    }

    const getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 3],
            quality: 1
        });

        if (!result.cancelled) {
            firebaseDb.storage().refFromURL(deal.image).delete()
                .then(() => console.log("deleted successfully"));

            setUploading(true)

            const fileName = result.uri.substring(result.uri.lastIndexOf('/') + 1);
            console.log(fileName);

            let storageRef = firebaseDb.storage().ref(`deals/images/${fileName}`);
            const response = await fetch(result.uri);
            const blob = await response.blob();

            storageRef.put(blob)
                .on(
                    firebaseDb.storage.TaskEvent.STATE_CHANGED,
                    snapshot => {
                        setProgress(
                            (snapshot.bytesTransferred / snapshot.totalBytes)
                        );
                    },
                    error => {
                        unsubscribe();
                        console.log("image upload error: " + error.toString());
                    },
                    () => {
                        setUploading(false)
                        storageRef.getDownloadURL()
                            .then((downloadUrl) => {
                                console.log("File available at: " + downloadUrl);

                                setImage(downloadUrl)
                            })
                    })
        }
    }

    if (isLoading)
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large'/>
            </View>)

    return (
        <ScrollView>
            <View style={styles.container}>
                <Image style={styles.dealBanner} source={{uri: image}}/>

                {uploading &&
                <View>
                    <Text style={{marginBottom: 5}}>Uploading photo:</Text>
                    <ProgressBar width={300} progress={progress} color='darkblue'/>
                    <Text style={{fontSize: 10}}>{Math.round(progress * 100)}%</Text>
                </View>}

                <TouchableOpacity style={styles.edit} onPress={() => {
                    Alert.alert(
                        'Change Deal Image',
                        'Do you want to change this image?',
                        [
                            {
                                text: 'Cancel', onPress: () => {
                                }
                            },
                            {text: 'Yes', onPress: () => pickImage()}
                        ]
                    )
                }}>
                    <MaterialCommunityIcons name="pencil-outline" size={18} color="#DFD8C8"/>
                </TouchableOpacity>

                <Dialog.Container visible={titleDialog}>
                    <Dialog.Title>Edit Deal Title </Dialog.Title>
                    <Dialog.Input defaultValue={title} onChangeText={(title) => setNewTitle(title)}/>
                    <Dialog.Button label="Cancel" onPress={() => setTitleDialog(false)}/>
                    <Dialog.Button label="Submit" onPress={() => {
                        setTitleDialog(false)
                        setTitle(newTitle)
                    }}/>
                </Dialog.Container>

                <View style={styles.container}>
                    <Text style={styles.dealHeader}>{title}</Text>
                    <TouchableOpacity style={styles.arrow}
                                      onPress={() => setTitleDialog(true)}>
                        <MaterialCommunityIcons name="pencil-outline" size={25}/>
                    </TouchableOpacity>
                </View>

                <View style={styles.box}>
                    <Text style={styles.info}>{desc}</Text>
                    <TouchableOpacity style={styles.arrowInfo}
                                      onPress={() => setDescDialog(true)}>
                        <MaterialCommunityIcons name="pencil-outline" size={25}/>
                    </TouchableOpacity>
                </View>

                <Dialog.Container visible={descDialog}>
                    <Dialog.Title>Edit Deal Description </Dialog.Title>
                    <Dialog.Input multiline={true} numberOfLines={6} defaultValue={desc}
                                  onChangeText={(desc) => setNewDesc(desc)}/>
                    <Dialog.Button label="Cancel" onPress={() => setDescDialog(false)}/>
                    <Dialog.Button label="Submit" onPress={() => {
                        setDescDialog(false)
                        setDesc(newDesc)
                    }}/>
                </Dialog.Container>

                <View style={styles.box}>
                    <Text style={styles.info}>{monetaryValue}</Text>
                    <TouchableOpacity style={styles.arrowInfo}
                                      onPress={() => setMonetaryValueDialog(true)}>
                        <MaterialCommunityIcons name="pencil-outline" size={25}/>
                    </TouchableOpacity>
                </View>

                <Dialog.Container visible={monetaryValueDialog}>
                    <Dialog.Title>Edit Savings </Dialog.Title>
                    <Dialog.Input multiline={false} numberOfLines={1} defaultValue={String(monetaryValue)}
                                  keyboardType="number-pad"
                                  onChangeText={(monetaryValue) => setNewMonetaryValue(monetaryValue)}/>
                    <Dialog.Button label="Cancel" onPress={() => setMonetaryValueDialog(false)}/>
                    <Dialog.Button label="Submit" onPress={() => {
                        setMonetaryValueDialog(false)
                        setMonetaryValue(newMonetaryValue)
                    }}/>
                </Dialog.Container>

                <MultiPickerMaterialDialog
                    title={'Choose cards relevant to deal'}
                    items={cards}
                    visible={cardVisible}
                    selectedItems={selectedCards}
                    onCancel={() => setCardVisible(false)}
                    onOk={result => {
                        setCardVisible(false);
                        setSelectCards(result.selectedItems)
                    }}
                    scrolled={true}
                />

                <MultiPickerMaterialDialog
                    title={'Choose methods relevant to deal'}
                    items={methods}
                    visible={methodVisible}
                    selectedItems={selectedMethods}
                    onCancel={() => setMethodVisible(false)}
                    onOk={result => {
                        setMethodVisible(false);
                        setSelectMethods(result.selectedItems)
                    }}
                    scrolled={true}
                />

                <BlueButton
                    onPress={() =>
                        setCardVisible(true)
                    }
                >
                    Cards
                </BlueButton>

                <Text multiline={true} style={styles.info}>
                    {selectedCards.length === 0
                        ? "No cards selected."
                        : `Selected: ${selectedCards
                            .map(item => item.label)
                            .join(", ")}`}
                </Text>

                <View style={{paddingTop: 20}}>
                    <BlueButton
                        onPress={() =>
                            setMethodVisible(true)
                        }
                    >
                        Payment Apps
                    </BlueButton>
                </View>
                <Text multiline={true} style={styles.info}>
                    {selectedMethods.length === 0
                        ? "No apps selected."
                        : `Selected: ${selectedMethods
                            .map(item => item.label)
                            .join(", ")}`}
                </Text>

                <Text style={{paddingTop: 15, marginBottom: 20, fontWeight: 'bold'}}>Please save changes before leaving
                    page!</Text>

                <View style={{flexDirection: 'row'}}>
                    <BlueButton onPress={() => {
                        const selectedMethodsShop = [...selectedMethods].map(method => {
                            return method.id;
                        })
                        const selectedCardsShop = [...selectedCards].map(card => {
                            return card.id
                        })

                        firebaseDb.firestore().collection('shops').doc(userId).update({
                            deals: firebaseDb.firestore.FieldValue.arrayRemove({
                                id: deal.id,
                                title: deal.title,
                                cards: deal.cards,
                                methods: deal.methods,
                                image: deal.image,
                                description: deal.description,
                                monetaryValue: deal.monetaryValue,
                            })
                        })
                        firebaseDb.firestore().collection('shops').doc(userId).update({
                            deals: firebaseDb.firestore.FieldValue.arrayUnion({
                                id: deal.id,
                                title: title,
                                cards: selectedCardsShop,
                                methods: selectedMethodsShop,
                                image: image,
                                description: desc,
                                monetaryValue: Number(monetaryValue),
                            })
                        })
                        refresh();
                        navigation.navigate('Deals')
                        Alert.alert("Deal details saved!")
                    }}>
                        Save
                    </BlueButton>

                    <BlueButton style={{backgroundColor: 'darkred', marginLeft: 20}} onPress={() => {
                        Alert.alert(
                            'Delete Deal',
                            'Are you sure you want to remove this deal from your store?',
                            [
                                {
                                    text: 'Cancel', onPress: () => {
                                    }
                                },
                                {
                                    text: 'Yes', onPress: () => {
                                        firebaseDb.storage().refFromURL(deal.image).delete()
                                            .then(() => console.log("deleted successfully"));

                                        firebaseDb.firestore().collection('shops').doc(userId).update({
                                            deals: firebaseDb.firestore.FieldValue.arrayRemove({
                                                id: deal.id,
                                                title: deal.title,
                                                cards: deal.cards,
                                                methods: deal.methods,
                                                image: deal.image,
                                                description: deal.description,
                                                monetaryValue: deal.monetaryValue,
                                            })
                                        })
                                        refresh();
                                        navigation.navigate('Deals')
                                        Alert.alert('Deal deleted!')
                                    }
                                }
                            ])
                    }}>
                        Delete
                    </BlueButton>
                </View>

            </View>
        </ScrollView>
    )
}

export default MerchantDealDetails;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    edit: {
        position: "absolute",
        top: 20,
        left: 35,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#41444B",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10
    },
    box: {
        width: 300,
        //height: 200,
        marginBottom: 20,
        borderBottomWidth: 1,
        alignItems: 'center'
    },
    dealBanner: {
        width: 350,
        height: 300,
        resizeMode: 'contain',
        marginBottom: 20
    },
    dealHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingHorizontal: 40,
        textAlign: 'center',
        borderBottomWidth: 1,
        width: 300,
    },
    arrow: {
        position: "absolute",
        width: 50,
        height: 50,
        right: 10,
        alignItems: "flex-end",
        justifyContent: "center"
    },
    arrowInfo: {
        position: "absolute",
        width: 50,
        height: 50,
        right: 20,
        bottom: -5,
        alignItems: "flex-end",
        justifyContent: "center"
    },
    info: {
        marginTop: 20,
        paddingHorizontal: 40,
        width: 350,
        //height: 200
    },
});