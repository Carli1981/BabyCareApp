import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { guardarDatoBebe } from '../../servicios/firestoreService';
import { obtenerUIDUsuarioActual } from '../../servicios/authService';

const Fondo = require('../../assets/FondoPreguntas.jpg');

const PreguntaAltura = () => {
  const navigation = useNavigation();
  const [altura, setAltura] = useState('');

  const handleSiguiente = async () => {
    const alturaValor = parseFloat(altura);
    if (isNaN(alturaValor) || alturaValor <= 0) {
      Alert.alert('Altura inválida', 'Por favor, introduce una altura válida en cm.');
      return;
    }

    const uid = await obtenerUIDUsuarioActual();
    if (uid) {
      try {
        await guardarDatoBebe(uid, { altura: alturaValor });
        navigation.navigate('PreguntaFoto');
      } catch (error) {
        console.error('Error al guardar altura:', error);
        Alert.alert('Error', 'No se pudo guardar la altura.');
      }
    } else {
      Alert.alert('Error', 'No se pudo identificar al usuario.');
    }
  };

  return (
    <ImageBackground source={Fondo} style={styles.fondo}>
      <View style={styles.contenedor}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botonAtras}>
          <Text style={styles.textoAtras}>← Atrás</Text>
        </TouchableOpacity>

        <Text style={styles.pregunta}>¿Cuál es la altura de tu bebé? (cm)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={altura}
          onChangeText={setAltura}
          placeholder="Ej. 50"
        />
        <Button title="Siguiente" onPress={handleSiguiente} disabled={!altura.trim()} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  fondo: { flex: 1, resizeMode: 'cover', justifyContent: 'center' },
  contenedor: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    margin: 20,
    borderRadius: 15,
  },
  botonAtras: { marginBottom: 10 },
  textoAtras: { fontSize: 16, color: '#007AFF' },
  pregunta: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    fontSize: 18,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
  },
});

export default PreguntaAltura;
