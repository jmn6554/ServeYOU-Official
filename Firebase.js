// Import the functions you need from the SDKs you need
/*import * as firebase from "firebase/app";*/

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import firestore from "firebase/compat/firestore";
/*import { getAnalytics } from "firebase/analytics";*/
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqgBthtbyuulrhRiKTXIGbt5MIbruUs0I",
  authDomain: "serveyou-auth.firebaseapp.com",
  projectId: "serveyou-auth",
  storageBucket: "serveyou-auth.appspot.com",
  messagingSenderId: "609700787834",
  appId: "1:609700787834:web:f1d022bdbd6f7e51fd2dc3",
  measurementId: "G-34SHWZL0RW",
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();
export { auth, firebase};
