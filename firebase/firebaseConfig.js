import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // 👈 Añade esto

const firebaseConfig = {
  apiKey: "AIzaSyA03As337AK8KyBorOjs3AfIS3nEZIXCWU",
  authDomain: "tika-app-mobile.firebaseapp.com",
  projectId: "tika-app-mobile",
  storageBucket: "tika-app-mobile.firebasestorage.app",
  messagingSenderId: "65768827343",
  appId: "1:65768827343:web:82fdaedd474791dd3f4aba"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // 👈 Conectamos a Firestore

export { db };
