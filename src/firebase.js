// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCTzFBEKvhfmnLsmgMdmSUmqU109iYtyMM",
    authDomain: "react-slack-clone-14cb5.firebaseapp.com",
    projectId: "react-slack-clone-14cb5",
    storageBucket: "react-slack-clone-14cb5.appspot.com",
    messagingSenderId: "622720239523",
    appId: "1:622720239523:web:da961fd2d9a61af7f3bc16",
    measurementId: "G-B8VZQX113X"
};

// Initialize Firebase
const appFirebase = firebase.initializeApp(firebaseConfig);
// const analytics = getAnalytics(appFirebase);

export default appFirebase