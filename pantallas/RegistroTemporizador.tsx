// pantallas/RegistroTemporizador.tsx
import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { registrarActividadTemporizador } from '../servicios/firestoreService';

const RegistroTemporizador = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { tipo } = route.params as { tipo: string };

  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [comentario, setComentario] = useState('');

  const manejarStart = () => {
    setFechaInicio(new Date());
    setFechaFin(null);
  };

  const manejarStop = () => {
    if (!fechaInicio) {
      Alert.alert('Error', 'Primero debes iniciar el temporizador');
      return;
    }
    setFechaFin(new Date());
  };

  const manejarGuardar = async () => {
    if (!fechaInicio || !fechaFin) {
      Alert.alert('Error', 'Debes iniciar y detener el temporizador');
      return;
    }
    await registrarActividadTemporizador(tipo, fechaInicio, fechaFin, comentario);
    Alert.alert('Guardado', `${tipo} registrado correctamente.`);
    navigation.goBack();
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Registrar {tipo}</Text>
      <View style={styles.botones}>
        <Button title="Start" onPress={manejarStart} />
        <Button title="Stop" onPress={manejarStop} />
      </View>
      <Text style={styles.texto}>
        Inicio: {fechaInicio ? fechaInicio.toLocaleTimeString() : '--:--:--'}
      </Text>
      <Text style={styles.texto}>
        Fin: {fechaFin ? fechaFin.toLocaleTimeString() : '--:--:--'}
      </Text>
      {fechaInicio && fechaFin && (
        <Text style={styles.texto}>
          Duración: {((fechaFin.getTime() - fechaInicio.getTime()) / 60000).toFixed(1)} minutos
        </Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Comentario (opcional)"
        value={comentario}
        onChangeText={setComentario}
      />
      <Button title="Guardar" onPress={manejarGuardar} />
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: { flex: 1, padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  botones: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  texto: { fontSize: 16, marginVertical: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 10,
    marginVertical: 10,
  },
});

export default RegistroTemporizador;
