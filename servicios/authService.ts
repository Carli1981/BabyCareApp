import { auth } from '../firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';

export const obtenerUIDUsuarioActual = (): Promise<string | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      unsubscribe();
      resolve(user ? user.uid : null);
    });
  });
};
