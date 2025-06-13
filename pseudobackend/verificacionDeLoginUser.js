// loginUser.js
import { db } from '../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function iniciarSesion(usuario, password) {
  try {
    const usuariosRef = collection(db, 'usuarios');
    const q = query(usuariosRef, where('usuario', '==', usuario), where('password', '==', password));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    const id = doc.id;

    // Guardar sesión
    await AsyncStorage.setItem('token', id);
    await AsyncStorage.setItem('isLoggedIn', 'true');

    return id;
  } catch (error) {
    throw error;
  }
}

