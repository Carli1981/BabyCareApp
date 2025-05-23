import { auth } from '../firebaseConfig';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';

// Obtener UID del usuario actual
export const obtenerUIDUsuarioActual = (): Promise<string | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      unsubscribe();
      resolve(user ? user.uid : null);
    });
  });
};

// Nueva función para cerrar sesión
export const cerrarSesion = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log('Sesión cerrada correctamente.');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};
