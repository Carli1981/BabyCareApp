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

const PreguntaAlimentacion = () => {
  const navigation = useNavigation();

  const handleSeleccion = async (tipo: string) => {
    const uid = await obtenerUIDUsuarioActual();
    if (!uid) {
      Alert.alert('Error', 'No se pudo identificar al usuario.');
      return;
    }

    try {
      await guardarDatoBebe(uid, { alimentacion: tipo });
      navigation.navigate('PreguntaNotificaciones');
    } catch (error) {
      console.error('Error guardando tipo de alimentación:', error);
      Alert.alert('Error', 'No se pudo guardar el dato.');
    }
  };

  return (
    <ImageBackground source={Fondo} style={styles.fondo} resizeMode="cover">
      <View style={styles.contenedor}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botonAtras}>
          <Text style={styles.textoAtras}>← Atrás</Text>
        </TouchableOpacity>

        <Text style={styles.pregunta}>¿Cómo se alimenta tu bebé?</Text>
        <Button title="Lactancia materna" onPress={() => handleSeleccion('Lactancia materna')} />
        <Button title="Leche de formula" onPress={() => handleSeleccion('Leche de formula')} />
        <Button title="Mixta" onPress={() => handleSeleccion('Mixta')} />
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
});

export default PreguntaAlimentacion;
