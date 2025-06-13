// registrarUser.js
import { db } from '../firebase/firebase';  // ajusta la ruta según donde esté tu archivo
import { doc, setDoc } from 'firebase/firestore';

export async function registrarUsuario(usuario, password, correo) {
  try {
    const ref = doc(db, 'usuarios', correo); // usa correo o uid único como id
    await setDoc(ref, { usuario, password, correo, creadoEn: new Date() });
    console.log('Usuario registrado en Firestore');
  } catch (error) {
    console.error('Error al registrar usuario:', error);
  }
}

