import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/functions';

const firebaseConfig = {

    apiKey: "AIzaSyDBmQKrx2te585I2rtPNjQGBR74Ab3O61s",
    authDomain: "instagram-clone-37722.firebaseapp.com",
    projectId: "instagram-clone-37722",
    storageBucket: "instagram-clone-37722.appspot.com",
    messagingSenderId: "178625881443",
    appId: "1:178625881443:web:d992bc9c3e89492ac65f56",
    measurementId: "G-5T0JWTJEWE"

}

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()
const functions = firebase.functions()  

export{db, auth,storage,functions}

    
