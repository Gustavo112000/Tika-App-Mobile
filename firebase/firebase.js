// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA03As337AK8KyBorOjs3AfIS3nEZIXCWU",
    authDomain: "tika-app-mobile.firebaseapp.com",
    databaseURL: "https://tika-app-mobile-default-rtdb.firebaseio.com",
    projectId: "tika-app-mobile",
    storageBucket: "tika-app-mobile.firebasestorage.app",
    messagingSenderId: "65768827343",
    appId: "1:65768827343:web:06ea16229389d7913f4aba"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

