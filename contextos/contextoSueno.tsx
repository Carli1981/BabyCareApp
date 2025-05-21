import React, { createContext, useContext, useState } from 'react';
import { Timestamp, collection, addDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { obtenerUIDUsuarioActual } from '../servicios/authService';

const SuenoContext = createContext<any>(null);

export const SuenoProvider = ({ children }: { children: React.ReactNode }) => {
  const [suenoActivo, setSuenoActivo] = useState(false);
  const [horaInicioSueno, setHoraInicioSueno] = useState<Date | null>(null);

  const iniciarSueno = () => {
    setSuenoActivo(true);
    setHoraInicioSueno(new Date());
  };

  const finalizarSueno = async (onFin?: () => void) => {
    const horaFin = new Date();
    if (!horaInicioSueno) return;

    const duracion = horaFin.getTime() - horaInicioSueno.getTime(); // en ms

    const uid = await obtenerUIDUsuarioActual();
    if (!uid) return;

    const ref = collection(firestore, 'usuarios', uid, 'actividades');
    await addDoc(ref, {
      tipo: 'Sueño',
      timestamp: Timestamp.fromDate(horaFin),
      timestampInicio: Timestamp.fromDate(horaInicioSueno),
      timestampFin: Timestamp.fromDate(horaFin),
      duracion,
      comentario: '',
    });

    setSuenoActivo(false);
    setHoraInicioSueno(null);

    if (onFin) onFin();
  };

  return (
    <SuenoContext.Provider value={{ suenoActivo, horaInicioSueno, iniciarSueno, finalizarSueno }}>
      {children}
    </SuenoContext.Provider>
  );
};

export const useSueno = () => useContext(SuenoContext);
