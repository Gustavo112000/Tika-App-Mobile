import { collection, getDocs, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { getID } from './getIDauth'

export async function obtenerPlantasDeAmbiente(nombreAmbiente) {
  try {
      const idUsuario = await getID();
    const ambienteRef = doc(db, 'usuarios', idUsuario, 'ambientes', nombreAmbiente);
    const plantasSnapshot = await getDocs(collection(ambienteRef, 'plantas'));

    const plantas = plantasSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return plantas;
  } catch (error) {
    console.error('Error al obtener plantas:', error.message);
    return [];
  }
}
