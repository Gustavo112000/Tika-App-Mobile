// registrarUser.js
import { db } from '../firebase/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

export async function registrarUsuario(usuario, password, correo) {
  try {
    // Verificar si el correo ya está en uso
    const correoQuery = query(collection(db, 'usuarios'), where('correo', '==', correo));
    const correoSnapshot = await getDocs(correoQuery);
    if (!correoSnapshot.empty) {
      throw new Error('El correo ya está registrado');
    }

    // Verificar si el nombre de usuario ya está en uso
    const usuarioQuery = query(collection(db, 'usuarios'), where('usuario', '==', usuario));
    const usuarioSnapshot = await getDocs(usuarioQuery);
    if (!usuarioSnapshot.empty) {
      throw new Error('El nombre de usuario ya está en uso');
    }

    // Agregar nuevo usuario con ID autogenerado por Firestore
    const nuevoDocRef = await addDoc(collection(db, 'usuarios'), {
      usuario,
      password,  // ⚠️ No recomendado en producción sin hash
      correo,
      creadoEn: new Date()
    });

    console.log('Usuario registrado con ID:', nuevoDocRef.id);
  } catch (error) {
    console.error('Error al registrar usuario:', error.message);
    throw error;
  }
}

