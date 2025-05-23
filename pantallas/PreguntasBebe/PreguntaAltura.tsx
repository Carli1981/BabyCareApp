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
import { moderateScale, verticalScale } from '../../utils/responsive';

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
    <ImageBackground source={Fondo} style={styles.fondo} resizeMode="cover">
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
  fondo: {
    flex: 1,
    justifyContent: 'center',
  },
  contenedor: {
    padding: moderateScale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    margin: moderateScale(20),
    borderRadius: moderateScale(15),
  },
  botonAtras: {
    marginBottom: verticalScale(10),
  },
  textoAtras: {
    fontSize: moderateScale(16),
    color: '#007AFF',
  },
  pregunta: {
    fontSize: moderateScale(22),
    textAlign: 'center',
    marginBottom: verticalScale(20),
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    padding: moderateScale(10),
    fontSize: moderateScale(18),
    borderRadius: moderateScale(10),
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: verticalScale(20),
  },
});

export default PreguntaAltura;
