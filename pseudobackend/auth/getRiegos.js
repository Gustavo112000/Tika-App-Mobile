import { collection, getDocs, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { getID } from './getIDauth'

export async function obtenerRiegosDePlanta(nombreAmbiente, idPlanta) {
  try {
            const idUsuario = await getID();
    const plantaRef = doc(db, 'usuarios', idUsuario, 'ambientes', nombreAmbiente, 'plantas', idPlanta);
    const riegoSnapshot = await getDocs(collection(plantaRef, 'riego'));

    const riegos = riegoSnapshot.docs.map(doc => doc.data());

    return riegos;
  } catch (error) {
    console.error('Error al obtener riegos:', error.message);
    return [];
  }
}

