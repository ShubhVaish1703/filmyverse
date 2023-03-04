import { initializeApp } from "firebase/app";
import {getFirestore , collection} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDepiuTsRoZT5LfLqzybLHjnaVt-xUJLgU",
    authDomain: "filmyverse-ad77a.firebaseapp.com",
    projectId: "filmyverse-ad77a",
    storageBucket: "filmyverse-ad77a.appspot.com",
    messagingSenderId: "470295205718",
    appId: "1:470295205718:web:3a051ef72ca9153e0aa8f7"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const moviesRef = collection(db, "movies");
export const reviewsRef = collection(db, "reviews");
export const usersRef = collection(db, "users");

export default app;