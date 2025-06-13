// src/firebase/config.js (o donde esté tu archivo)

// Importa lo necesario
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA03As337AK8KyBorOjs3AfIS3nEZIXCWU",
  authDomain: "tika-app-mobile.firebaseapp.com",
  projectId: "tika-app-mobile",
  storageBucket: "tika-app-mobile.firebasestorage.app",
  messagingSenderId: "65768827343",
  appId: "1:65768827343:web:82fdaedd474791dd3f4aba"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// 🔥 Crea e **exporta** la instancia de Firestore
const db = getFirestore(app);

export { db };
