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
import { moderateScale, verticalScale } from '../../utils/responsive';

const Fondo = require('../../assets/FondoPreguntas.jpg');

const PreguntaSexo = () => {
  const navigation = useNavigation();

  const handleSeleccion = async (sexo: string) => {
    const uid = await obtenerUIDUsuarioActual();
    if (uid) {
      try {
        await guardarDatoBebe(uid, { sexo });
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
    <ImageBackground source={Fondo} style={styles.fondo} resizeMode="cover">
      <View style={styles.contenedor}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botonAtras}>
          <Text style={styles.textoAtras}>← Atrás</Text>
        </TouchableOpacity>

        <Text style={styles.pregunta}>¿Cuál es el sexo de tu bebé?</Text>

        <View style={styles.boton}>
          <Button title="Niño" onPress={() => handleSeleccion('Niño')} />
        </View>
        <View style={styles.boton}>
          <Button title="Niña" onPress={() => handleSeleccion('Niña')} />
        </View>
        <View style={styles.boton}>
          <Button title="Otro" onPress={() => handleSeleccion('Otro')} />
        </View>
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
  boton: {
    marginVertical: verticalScale(5),
  },
});

export default PreguntaSexo;
