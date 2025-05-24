import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';

interface Props {
  inicio: Date | null;
  estilo?: object;
  icono?: string;
  texto?: string;
}

const Cronometro: React.FC<Props> = ({ inicio, estilo = {}, icono = '', texto = '' }) => {
  const [tiempoActual, setTiempoActual] = useState<Date | null>(null);

  // Este efecto se asegura de actualizar tiempoActual cuando 'inicio' cambie
  useEffect(() => {
    if (inicio) {
      setTiempoActual(new Date()); // Actualiza inmediatamente
    } else {
      setTiempoActual(null);
    }
  }, [inicio]);

  // Este efecto actualiza el tiempo cada segundo si 'inicio' está definido
  useEffect(() => {
    if (!inicio) return;

    const interval = setInterval(() => {
      setTiempoActual(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [inicio]);

  if (!inicio || !tiempoActual) return null;

  const tiempoTranscurrido = Math.floor((tiempoActual.getTime() - inicio.getTime()) / 1000);
  const horas = Math.floor(tiempoTranscurrido / 3600);
  const minutos = Math.floor((tiempoTranscurrido % 3600) / 60);
  const segundos = tiempoTranscurrido % 60;

  return (
    <Text style={[{ fontSize: 16, fontWeight: 'bold', marginVertical: 5 }, estilo]}>
      {icono} {texto} {horas.toString().padStart(2, '0')}:
      {minutos.toString().padStart(2, '0')}:
      {segundos.toString().padStart(2, '0')}
    </Text>
  );
};

export default Cronometro;
