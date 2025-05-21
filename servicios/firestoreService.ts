import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';  // cambiar a firestore

export const obtenerDatosBebe = async (uid: string) => {
  try {
    const docRef = doc(firestore, 'bebes', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener datos del bebé:', error);
    return null;
  }
};

export const guardarDatoBebe = async (uid: string, data: any) => {
  try {
    const docRef = doc(firestore, 'bebes', uid);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error('Error al guardar datos del bebé:', error);
  }
};