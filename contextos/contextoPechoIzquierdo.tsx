// contextoPechoIzquierdo.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Timestamp, collection, addDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { obtenerUIDUsuarioActual } from '../servicios/authService';

interface PechoIzquierdoContextProps {
  pechoIzquierdoActivo: boolean;
  horaInicioPechoIzquierdo: Date | null;
  iniciarPechoIzquierdo: () => void;
  finalizarPechoIzquierdo: (onFin?: () => void) => Promise<void>;
}

const PechoIzquierdoContext = createContext<PechoIzquierdoContextProps | undefined>(undefined);

export const PechoIzquierdoProvider = ({ children }: { children: ReactNode }) => {
  const [pechoIzquierdoActivo, setPechoIzquierdoActivo] = useState(false);
  const [horaInicioPechoIzquierdo, setHoraInicioPechoIzquierdo] = useState<Date | null>(null);

  const iniciarPechoIzquierdo = () => {
    setPechoIzquierdoActivo(true);
    setHoraInicioPechoIzquierdo(new Date());
  };

  const finalizarPechoIzquierdo = async (onFin?: () => void) => {
    const horaFin = new Date();
    if (!horaInicioPechoIzquierdo) return;

    const duracion = horaFin.getTime() - horaInicioPechoIzquierdo.getTime();

    const uid = await obtenerUIDUsuarioActual();
    if (!uid) return;

    const ref = collection(firestore, 'usuarios', uid, 'actividades');
    await addDoc(ref, {
      tipo: 'Dar pecho izquierdo',
      timestamp: Timestamp.fromDate(horaFin),
      timestampInicio: Timestamp.fromDate(horaInicioPechoIzquierdo),
      timestampFin: Timestamp.fromDate(horaFin),
      duracion,
      comentario: '',
    });

    setPechoIzquierdoActivo(false);
    setHoraInicioPechoIzquierdo(null);

    if (onFin) onFin();
  };

  return (
    <PechoIzquierdoContext.Provider
      value={{ pechoIzquierdoActivo, horaInicioPechoIzquierdo, iniciarPechoIzquierdo, finalizarPechoIzquierdo }}
    >
      {children}
    </PechoIzquierdoContext.Provider>
  );
};

export const usePechoIzquierdo = () => {
  const context = useContext(PechoIzquierdoContext);
  if (!context) {
    throw new Error('usePechoIzquierdo debe usarse dentro de un PechoIzquierdoProvider');
  }
  return context;
};
