import React, {useEffect} from 'react';
import {Alert, TouchableOpacity, StyleSheet, Text, View, Image, ScrollView} from "react-native";
import firebaseDb from '../firebase/firebaseDb';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import Dialog from "react-native-dialog";
import BlueButton from '../component/BlueButton';
import {MultiPickerMaterialDialog} from 'react-native-material-dialog';
import {getCards, getMethods} from '../component/API';

function MerchantDealDetails({navigation, route}) {
    const {deal} = route.params;
    const [isLoading, setIsLoading] = React.useState(true)
    const [image, setImage] = React.useState(deal.image)
    const [title, setTitle] = React.useState(deal.title)
    const [desc, setDesc] = React.useState(deal.description)
    const [newTitle, setNewTitle] = React.useState('')
    const [newDesc, setNewDesc] = React.useState('')
    const [titleDialog, setTitleDialog] = React.useState(false)
    const [descDialog, setDescDialog] = React.useState(false)
    const [cardVisible, setCardVisible] = React.useState(false)
    const [methodVisible, setMethodVisible] = React.useState(false)
    const [cards, setCards] = React.useState([])
    const [selectedCards, setSelectCards] = React.useState(deal.cards.map(item => {
        item.label = item.name
        item.value = item.id
        return item
    }))
    const [methods, setMethods] = React.useState([])
    const [selectedMethods, setSelectMethods] = React.useState(deal.methods.map(item => {
        item.label = item.name
        item.value = item.id
        return item
    }))
    const userId = firebaseDb.auth().currentUser.uid
    const userDoc = firebaseDb.firestore().collection('merchants').doc(userId)

    let shopDeals = [];

    useEffect(() => {
        if (isLoading) {
            getPermissionAsync()
            getCards(onCardsReceived)
            getMethods(onMethodsReceived)
            firebaseDb.firestore().collection('merchants').doc(userId).get()
                .then(snapshot => {
                    shopDeals = snapshot.data().deals
                    shopDeals.push({
                        cards: selectedCards,
                        description: desc,
                        image: image,
                        methods: selectedMethods,
                        title: title
                    })
                })

            setIsLoading(false)
        }
    })

    const onCardsReceived = (allCards) => {
        allCards.map(item => {
            item.label = item.name
            item.value = item.id
            return item
        })
        setCards(allCards)
    }

    const onMethodsReceived = (allMethods) => {
        allMethods.map(item => {
            item.label = item.name
            item.value = item.id
            return item
        })
        setMethods(allMethods)
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
            const fileExtension = result.uri.split('.').pop();
            console.log("EXT: " + fileExtension);
            
            let uuid = require('random-uuid-v4');
            let uuidv4 = uuid();

            const fileName = `${uuidv4}.${fileExtension}`;
            console.log(fileName);
        
            let storageRef = firebaseDb.storage().ref(`deals/images/${fileName}`);
            const response = await fetch(result.uri);
            const blob = await response.blob();
        
            storageRef.put(blob)
              .on(
                firebaseDb.storage.TaskEvent.STATE_CHANGED,
                snapshot => {
                  console.log("snapshot: " + snapshot.state);
                  console.log("progress: " + (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        
                  if (snapshot.state === firebaseDb.storage.TaskState.SUCCESS) {
                    console.log("Success");
                  }
                },
                error => {
                  unsubscribe();
                  console.log("image upload error: " + error.toString());
                },
                () => {
                  storageRef.getDownloadURL()
                    .then((downloadUrl) => {
                      console.log("File available at: " + downloadUrl);
        
                      setImage(downloadUrl)
                    })
                })
            }
        }

    return (
        <ScrollView>
            <View style={styles.container}>
                <Image style={styles.dealBanner} source={{uri: image}}/>
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

                <Text style={{paddingTop:15, marginBottom: 20, fontWeight:'bold'}}>Please save changes before leaving page!</Text>

                <View style={{flexDirection: 'row'}}>
                    <BlueButton onPress={() => {

                        const selectedMethodsDB = [...selectedMethods].map(method => {
                            delete method.label;
                            delete method.value;
                            return method
                        })
                        const selectedCardsDB = [...selectedCards].map(card => {
                            delete card.label;
                            delete card.value;
                            return card
                        })

                        const selectedMethodsShop = [...selectedMethods].map(method => {
                            return method.id;
                        })
                        const selectedCardsShop = [...selectedCards].map(card => {
                            return card.id
                        })

                        userDoc.update({
                            deals: firebaseDb.firestore.FieldValue.arrayRemove({
                                title: deal.title,
                                cards: deal.cards.map(card => {
                                    delete card.label;
                                    delete card.value;
                                    return card
                                }),
                                methods: deal.methods.map(method => {
                                    delete method.label;
                                    delete method.value;
                                    return method
                                }),
                                image: deal.image,
                                description: deal.description,
                                dealCards: deal.cards.length !== 0,
                                dealMethods: deal.methods.length !== 0,
                            })
                        })
                        userDoc.update({
                            deals: firebaseDb.firestore.FieldValue.arrayUnion({
                                title: title,
                                cards: selectedCardsDB,
                                methods: selectedMethodsDB,
                                image: image,
                                description: desc,
                                dealCards: selectedCards.length !== 0,
                                dealMethods: selectedMethods.length !== 0,
                            })
                        })
                        firebaseDb.firestore().collection('shops').doc(userId).update({
                            deals: firebaseDb.firestore.FieldValue.arrayRemove({
                                title: deal.title,
                                cards: deal.cards.map(card => {return card.id}),
                                methods: deal.methods.map(method => {return method.id}),
                                image: deal.image,
                                description: deal.description,
                                dealCards: deal.cards.length !== 0,
                                dealMethods: deal.methods.length !== 0,
                            })
                        })
                        firebaseDb.firestore().collection('shops').doc(userId).update({
                            deals: firebaseDb.firestore.FieldValue.arrayUnion({
                                title: title,
                                cards: selectedCardsShop,
                                methods: selectedMethodsShop,
                                image: image,
                                description: desc,
                                dealCards: selectedCards.length !== 0,
                                dealMethods: selectedMethods.length !== 0,
                            })
                        })
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

                                        userDoc.update({
                                            deals: firebaseDb.firestore.FieldValue.arrayRemove({
                                                title: deal.title,
                                                cards: deal.cards.map(card => {
                                                    delete card.label;
                                                    delete card.value;
                                                    return card
                                                }),
                                                methods: deal.methods.map(method => {
                                                    delete method.label;
                                                    delete method.value;
                                                    return method
                                                }),
                                                image: deal.image,
                                                description: deal.description,
                                                dealCards: deal.cards.length !== 0,
                                                dealMethods: deal.methods.length !== 0,
                                            })
                                        })
                                        firebaseDb.firestore().collection('shops').doc(userId).update({
                                            deals: firebaseDb.firestore.FieldValue.arrayRemove({
                                                title: deal.title,
                                                cards: deal.cards.map(card => {return card.id}),
                                                methods: deal.methods.map(method => {return method.id}),
                                                image: deal.image,
                                                description: deal.description,
                                                dealCards: deal.cards.length !== 0,
                                                dealMethods: deal.methods.length !== 0,
                                            })
                                        })
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