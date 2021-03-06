import React from 'react';
import { ScrollView, Alert, Text, StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import firebaseDb from '../firebase/firebaseDb';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import BlueButton from "../component/BlueButton";
import Dialog from "react-native-dialog";
import {ProgressBar} from 'react-native-paper';
import StarRating from "react-native-star-rating"

class MerchantProfile extends React.Component {

    userId = firebaseDb.auth().currentUser.uid
    userDoc = firebaseDb.firestore().collection('shops').doc(this.userId)
    newName = ''
    newHours = ''
    newContact = ''
    newDesc = ''
    newType = ''
    newAvgPrice = ''
    state = {
        avgPriceDialogVisible: false,
        nameDialogVisible: false,
        hoursDialogVisible: false,
        contactDialogVisible: false,
        descDialogVisible: false,
        typeDialogVisible: false,
        name: null,
        image: null,
        openingHours: null,
        contact: null,
        type: null,
        desc: null,
        progress: 0,
        uploading: false,
        favs: 0,
        avgPrice: null,
        rating: 0,
        reviewers: 0,
        reviews: []
      };

    setAvgPrice = (newAvgPrice) => {
        this.newAvgPrice = newAvgPrice
    }

    setName = (newName) => {
        this.newName = newName
    }

    setHours = (newHours) => {
        this.newHours = newHours
    }

    setContact = (newContact) => {
        this.newContact = newContact
    }

    setType = (newType) => {
        this.newType = newType
    }

    setDesc = (newDesc) => {
        this.newDesc = newDesc
    }

    componentDidMount() {
        this.userDoc.get().then(snapshot => {
            this.setState({
            name: snapshot.data().shopName,
            image: snapshot.data().logo,
            openingHours: snapshot.data().openingHrs,
            type: snapshot.data().type,
            contact: snapshot.data().contact,
            desc: snapshot.data().description,
            favs: snapshot.data().favs,
            avgPrice: snapshot.data().avgPrice,
            rating: snapshot.data().rating,
            })
            if (!(snapshot.data().numReviews === undefined)) {
                this.setState({
                    reviewers: snapshot.data().numReviews,
                    reviews: snapshot.data().review
                })
            }
        })
        this.getPermissionAsync()
      }
    
      getPermissionAsync = async () => {
        if (Constants.platform.ios) {
          const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
      }
    
      pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [3, 3],
          quality: 1
        });
        
        if (!result.cancelled) {
            if (this.state.image !== undefined) {
                firebaseDb.storage().refFromURL(this.state.image).delete()
                    .then(() => console.log("deleted successfully") );
            }

            this.setState({uploading: true})

            const fileName = result.uri.substring(result.uri.lastIndexOf('/') + 1);
            console.log(fileName);

            let storageRef = firebaseDb.storage().ref(`profile/merchants/${fileName}`);
            const response = await fetch(result.uri);
            const blob = await response.blob();
        
            storageRef.put(blob)
              .on(
                firebaseDb.storage.TaskEvent.STATE_CHANGED,
                snapshot => {

                  this.setState({progress: (snapshot.bytesTransferred / snapshot.totalBytes)})
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
                  this.setState({uploading: false})
                  storageRef.getDownloadURL()
                    .then((downloadUrl) => {
                      console.log("File available at: " + downloadUrl);
        
                      this.setState({image: downloadUrl})
                    })
                })
            }
        }

    render() {
        const {image, name, openingHours, type, contact, desc, favs, progress, uploading, rating, reviewers, reviews,
            nameDialogVisible, contactDialogVisible,hoursDialogVisible, descDialogVisible, typeDialogVisible,
        avgPriceDialogVisible, avgPrice} = this.state

        return (
            <ScrollView contentContainerstyle = {styles.container}>
                <View style = {{alignSelf: "center"}}>
                    <View style = {styles.profileImage}>
                        {image && <Image source = {{ uri: image }}
                           style = {styles.image}
                           resizeMode = "center"/>}
                        {!image && <Image source = {require('../images/Portrait_Placeholder.png')}
                           style = {styles.image}
                           resizeMode = "center"/>}
                    </View>
                    {uploading &&
                    <View>
                        <Text style = {{marginBottom: 5}}>Uploading photo:</Text>
                        <ProgressBar width = {300} progress = {progress} color = 'darkblue'/>
                        <Text style = {{fontSize: 10}}>{Math.round(progress * 100)}%</Text>
                    </View>}

                    <TouchableOpacity style = {styles.edit} onPress = {() => {
                    Alert.alert(
                        'Change Shop Logo',
                        'Do you want to change your shop logo?',
                        [
                        {text: 'Cancel', onPress: () => {}},
                        {text: 'Yes', onPress: this.pickImage}
                        ]
                    )}}>
                        <MaterialCommunityIcons name = "pencil-outline" size = {18} color = "#DFD8C8"/>
                    </TouchableOpacity>
                </View>

                <View style={styles.textContainer}>
                    <Text>Shop Name: {name}</Text>
                    <TouchableOpacity style = {styles.arrow} 
                        onPress={() => this.setState({nameDialogVisible: true})}>
                        <MaterialCommunityIcons name = "pencil-outline" size = {25}/>
                    </TouchableOpacity>
                </View>

                <Dialog.Container visible={nameDialogVisible}>
                    <Dialog.Title>Change Shop Name</Dialog.Title>
                    <Dialog.Description>
                        Enter new shop name
                    </Dialog.Description>
                    <Dialog.Input placeholder = "Shop Name" onChangeText = {this.setName}/>
                    <Dialog.Button label = "Cancel" onPress = {() => this.setState({nameDialogVisible: false})}/>
                    <Dialog.Button label = "Submit" onPress = {() => {
                        this.setState({nameDialogVisible: false, name: this.newName})
                        firebaseDb.firestore().collection("shops").doc(this.userId).update({
                            shopName: this.newName
                        })
                    }}/> 
                </Dialog.Container>

                <View style={styles.textContainer}>
                    <Text>Opening Hours: {openingHours}</Text>
                    <TouchableOpacity style = {styles.arrow} 
                        onPress={() => this.setState({hoursDialogVisible: true})}>
                        <MaterialCommunityIcons name = "pencil-outline" size = {25}/>
                    </TouchableOpacity>
                </View>

                <Dialog.Container visible={hoursDialogVisible}>
                    <Dialog.Title>Change Opening Hours</Dialog.Title>
                    <Dialog.Description>
                        Enter shop opening hours
                    </Dialog.Description>
                    <Dialog.Input placeholder = "Opening Hours" onChangeText = {this.setHours}/>
                    <Dialog.Button label = "Cancel" onPress = {() => this.setState({hoursDialogVisible: false})}/>
                    <Dialog.Button label = "Submit" onPress = {() => {
                        this.setState({hoursDialogVisible: false, openingHours: this.newHours})
                        firebaseDb.firestore().collection("shops").doc(this.userId).update({
                            openingHrs: this.newHours
                        })
                    }}/> 
                </Dialog.Container>

                <View style={styles.textContainer}>
                    <Text>Average Price: ${avgPrice} </Text>
                    <TouchableOpacity style = {styles.arrow}
                                      onPress={() => this.setState({avgPriceDialogVisible: true})}>
                        <MaterialCommunityIcons name = "pencil-outline" size = {25}/>
                    </TouchableOpacity>
                </View>

                <Dialog.Container visible={avgPriceDialogVisible}>
                    <Dialog.Title>Change average Price</Dialog.Title>
                    <Dialog.Description>
                        Enter average price.
                    </Dialog.Description>
                    <Dialog.Input placeholder = "Price" onChangeText = {this.setAvgPrice}/>
                    <Dialog.Button label = "Cancel" onPress = {() => this.setState({avgPriceDialogVisible: false})}/>
                    <Dialog.Button label = "Submit" onPress = {() => {
                        this.setState({avgPriceDialogVisible: false, avgPrice: this.newAvgPrice})
                        firebaseDb.firestore().collection("shops").doc(this.userId).update({
                            avgPrice: this.newAvgPrice
                        })
                    }}/>
                </Dialog.Container>

                <View style={styles.textContainer}>
                    <Text>Contact: {contact} </Text>
                    <TouchableOpacity style = {styles.arrow} 
                        onPress={() => this.setState({contactDialogVisible: true})}>
                        <MaterialCommunityIcons name = "pencil-outline" size = {25}/>
                    </TouchableOpacity>
                </View>

                <Dialog.Container visible={contactDialogVisible}>
                    <Dialog.Title>Change Contact No.</Dialog.Title>
                    <Dialog.Description>
                        Enter contact no.
                    </Dialog.Description>
                    <Dialog.Input placeholder = "Contact" onChangeText = {this.setContact}/>
                    <Dialog.Button label = "Cancel" onPress = {() => this.setState({contactDialogVisible: false})}/>
                    <Dialog.Button label = "Submit" onPress = {() => {
                        this.setState({contactDialogVisible: false, contact: this.newContact})
                        firebaseDb.firestore().collection("shops").doc(this.userId).update({
                            contact: this.newContact
                        })
                    }}/> 
                </Dialog.Container>

                <View style={styles.textLongContainer}>
                    <Text>Description: {desc}</Text>
                    <TouchableOpacity style = {styles.arrowLong} 
                        onPress={() => this.setState({descDialogVisible: true})}>
                        <MaterialCommunityIcons name = "pencil-outline" size = {25}/>
                    </TouchableOpacity>
                </View>

                <Dialog.Container visible={descDialogVisible}>
                    <Dialog.Title>Change Description</Dialog.Title>
                    <Dialog.Description>
                        Enter shop description
                    </Dialog.Description>
                    <Dialog.Input numberOfLines = {6} multiline = {true} defaultValue = {desc} onChangeText = {this.setDesc}/>
                    <Dialog.Button label = "Cancel" onPress = {() => this.setState({descDialogVisible: false})}/>
                    <Dialog.Button label = "Submit" onPress = {() => {
                        this.setState({descDialogVisible: false, desc: this.newDesc})
                        firebaseDb.firestore().collection("shops").doc(this.userId).update({
                            description: this.newDesc
                        })
                    }}/> 
                </Dialog.Container>

                <View style={styles.textContainer}>
                    <Text>Type: {type}</Text>
                    <TouchableOpacity style = {styles.arrow} 
                        onPress={() => this.setState({typeDialogVisible: true})}>
                        <MaterialCommunityIcons name = "pencil-outline" size = {25}/>
                    </TouchableOpacity>
                </View>

                <Dialog.Container visible={typeDialogVisible}>
                    <Dialog.Title>Change Shop Type</Dialog.Title>
                    <Dialog.Description>
                        Enter shop type
                    </Dialog.Description>
                    <Dialog.Input placeholder = "Shop Type" onChangeText = {this.setType}/>
                    <Dialog.Button label = "Cancel" onPress = {() => this.setState({typeDialogVisible: false})}/>
                    <Dialog.Button label = "Submit" onPress = {() => {
                        this.setState({typeDialogVisible: false, type: this.newType})
                        firebaseDb.firestore().collection("shops").doc(this.userId).update({
                            type: this.newType
                        })
                    }}/> 
                </Dialog.Container>

                <View style={styles.textContainer}>
                    <Text>Number of likes: {favs}</Text>
                    <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                        <Text>Rating: </Text>
                        <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={rating}
                        starSize = {20}
                        />
                        <Text>{"  (" + reviewers + ")"}</Text>
                    </View>
                </View>

                <View style={styles.textContainer}>
                    <Text>My Reviews</Text>
                    <TouchableOpacity style = {styles.arrow} 
                        onPress={() => this.props.navigation.navigate('Reviews')}>
                        <MaterialCommunityIcons name = "chevron-right" size = {25}/>
                    </TouchableOpacity>
                </View>


                <Text style = {{alignSelf: 'center', marginTop: 10}}> Complete your profile to publish your store!</Text>
                <Text style = {{alignSelf: 'center', marginBottom: 20}}> (don't forget to publish after making any changes) </Text>
                <BlueButton style = {{width: 300, alignSelf: 'center'}} onPress={() => {
                    if (name && type && desc && openingHours && image) {
                        firebaseDb.firestore().collection('shops').doc(this.userId).update({
                            logo: image,
                            hasDetails: true,
                        })
                        Alert.alert("Published Successfully!")
                    } else {
                        Alert.alert("Please fill in all fields and upload logo before publishing!")
                    }
                }}>
                    Publish
                </BlueButton>
            </ScrollView>
        )
    }
}

export default MerchantProfile;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        flex: 1,
        width: undefined,
        height: undefined
    },
    profileImage: {
        width: 200,
        height: 200,
        overflow: "hidden",
        marginTop: 10,
    },
    textContainer: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 16,
        width: 300,
        fontSize: 20,
        marginVertical: 10,
        paddingVertical: 15,
        alignSelf: 'center'
    },
    textLongContainer: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 16,
        width: 300,
        fontSize: 20,
        marginVertical: 10,
        paddingVertical: 15,
        alignSelf: 'center'
    },
    title: {
        marginTop: 10,
        fontSize: 25,
        marginBottom: 10,
    },
    edit: {
        position: "absolute",
        top: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#41444B",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10
    },
    arrow: {
        position: "absolute",
        width: 50,
        height: 50,
        right: 10,
        alignItems: "flex-end",
        justifyContent: "center"
    },
    arrowLong: {
        position: "absolute",
        width: 50,
        height: 50,
        bottom: 10,
        right: 10,
        alignItems: "flex-end",
        justifyContent: "center"
    },
    savings: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 16,
        width: 300,
        height: 100,
        fontSize: 20,
        marginVertical: 10,
        paddingVertical: 15,
    }
})