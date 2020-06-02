import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAG1XnZkbOz2RzAFZ0jmoqFNgjH2BlRXd8",
    authDomain: "ez-eating.firebaseapp.com",
    databaseURL: "https://ez-eating.firebaseio.com",
    projectId: "ez-eating",
    storageBucket: "ez-eating.appspot.com",
    messagingSenderId: "616081111834",
    appId: "1:616081111834:web:04b47de85ae9897b060aa3",
    measurementId: "G-L05P6039HD"
}

firebase.initializeApp(firebaseConfig)
firebase.firestore()

export default firebase