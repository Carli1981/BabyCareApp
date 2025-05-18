import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { guardarDatoBebe } from '../../servicios/firestoreService';
import { obtenerUIDUsuarioActual } from '../../servicios/authService';

const Fondo = require('../../assets/FondoPreguntas.jpg');

const PreguntaSexo = () => {
  const navigation = useNavigation();

  const handleSeleccion = async (sexo: string) => {
    const uid = await obtenerUIDUsuarioActual();
    if (uid) {
      try {
        await guardarDatoBebe(uid, { sexo }); // Guardar el sexo
        navigation.navigate('PreguntaPeso');
      } catch (error) {
        console.error('Error al guardar sexo:', error);
        Alert.alert('Error', 'No se pudo guardar el sexo.');
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

        <Text style={styles.pregunta}>¿Cuál es el sexo de tu bebé?</Text>
        <Button title="Niño" onPress={() => handleSeleccion('Niño')} />
        <Button title="Niña" onPress={() => handleSeleccion('Niña')} />
        <Button title="Otro" onPress={() => handleSeleccion('Otro')} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  contenedor: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    margin: 20,
    borderRadius: 15,
  },
  botonAtras: {
    marginBottom: 10,
  },
  textoAtras: {
    fontSize: 16,
    color: '#007AFF',
  },
  pregunta: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
});

export default PreguntaSexo;
