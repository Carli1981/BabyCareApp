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

const PreguntaPeso = () => {
  const navigation = useNavigation();
  const [peso, setPeso] = useState('');

  const handleSiguiente = async () => {
    const pesoValor = parseFloat(peso);
    if (isNaN(pesoValor) || pesoValor <= 0) {
      Alert.alert('Peso inválido', 'Por favor, introduce un peso válido en kg.');
      return;
    }

    const uid = await obtenerUIDUsuarioActual();
    if (uid) {
      try {
        await guardarDatoBebe(uid, { peso: pesoValor });
        navigation.navigate('PreguntaAltura');
      } catch (error) {
        console.error('Error al guardar peso:', error);
        Alert.alert('Error', 'No se pudo guardar el peso.');
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

        <Text style={styles.pregunta}>¿Cuánto pesa tu bebé? (kg)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={peso}
          onChangeText={setPeso}
          placeholder="Ej. 3.5"
        />
        <Button title="Siguiente" onPress={handleSiguiente} disabled={!peso.trim()} />
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

export default PreguntaPeso;
