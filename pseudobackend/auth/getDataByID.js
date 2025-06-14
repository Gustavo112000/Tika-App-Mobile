import { collection, getDocs, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

export async function obtenerDatosDeUsuario(idUsuario) {
  try {
    const userRef = doc(db, 'usuarios', idUsuario);
    const ambientesSnapshot = await getDocs(collection(userRef, 'ambientes'));

    const resultado = []; // Aquí se juntará todo

    for (const ambienteDoc of ambientesSnapshot.docs) {
      const ambienteData = ambienteDoc.data();
      const plantasSnapshot = await getDocs(collection(ambienteDoc.ref, 'plantas'));

      const plantas = [];

      for (const plantaDoc of plantasSnapshot.docs) {
        const plantaData = plantaDoc.data();
        const riegoSnapshot = await getDocs(collection(plantaDoc.ref, 'riego'));

        const riegos = riegoSnapshot.docs.map(doc => doc.data());

        plantas.push({
          id: plantaDoc.id,
          ...plantaData,
          riegos: riegos
        });
      }

      resultado.push({
        id: ambienteDoc.id,
        ...ambienteData,
        plantas: plantas
      });
    }
    return resultado;
    // console.log(JSON.stringify(resultado, null, 2)); // Imprime todo en formato estructurado

  } catch (error) {
    console.error('Error al obtener datos del usuario:', error.message);
  }
}

