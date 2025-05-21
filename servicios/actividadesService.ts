import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { obtenerUIDUsuarioActual } from './authService';

export const registrarActividad = async (tipo: string, comentario: string) => {
  try {
    const uid = await obtenerUIDUsuarioActual();
    if (!uid) throw new Error('No hay usuario autenticado.');

    const ref = collection(firestore, 'usuarios', uid, 'actividades');
    const nuevaActividad = {
      tipo,
      timestamp: Timestamp.now(),
      comentario: '',
    };

    await addDoc(ref, nuevaActividad);

    return { success: true };
  } catch (error) {
    console.error('Error registrando actividad:', error);
    return { success: false };
  }
};

export const obtenerActividades = async () => {
  const uid = await obtenerUIDUsuarioActual();
  if (!uid) return [];

  const ref = collection(firestore, 'usuarios', uid, 'actividades');
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const actualizarComentarioActividad = async (id: string, comentario: string) => {
  const uid = await obtenerUIDUsuarioActual();
  if (!uid) throw new Error('Usuario no autenticado');

  const ref = doc(firestore, 'usuarios', uid, 'actividades', id);
  await updateDoc(ref, { comentario });
};

export const eliminarActividad = async (id: string) => {
  const uid = await obtenerUIDUsuarioActual();
  if (!uid) throw new Error('Usuario no autenticado');

  const ref = doc(firestore, 'usuarios', uid, 'actividades', id);
  await deleteDoc(ref);
};
