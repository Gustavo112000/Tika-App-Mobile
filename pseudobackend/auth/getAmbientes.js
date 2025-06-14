import { collection, getDocs, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { getID } from './getIDauth'

export async function obtenerAmbientesDeUsuario() {
  try {
      const idUsuario = await getID();
    const userRef = doc(db, 'usuarios', idUsuario);
    const ambientesSnapshot = await getDocs(collection(userRef, 'ambientes'));

    const ambientes = ambientesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return ambientes;
  } catch (error) {
    console.error('Error al obtener ambientes:', error.message);
    return [];
  }
}
