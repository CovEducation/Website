import firebase from "firebase/app";
import "firebase/auth";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = {
  apiKey: "AIzaSyD5TA_oyBIV5ElJ-CEi_dJdaN3VzvrBlvc",
  authDomain: "coveducation-13eda.firebaseapp.com",
  databaseURL: "https://coveducation-13eda.firebaseio.com",
  projectId: "coveducation-13eda",
  storageBucket: "coveducation-13eda.appspot.com",
  messagingSenderId: "277574594883",
  appId: "1:277574594883:web:ce5dab3eaab6d811333ff6",
  measurementId: "G-PGRC12MSSP"
};

firebase.initializeApp(config);

const Auth = firebase.auth();

export { Auth };
