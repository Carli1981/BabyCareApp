import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Alert,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { guardarDatoBebe } from '../../servicios/firestoreService';
import { obtenerUIDUsuarioActual } from '../../servicios/authService';
import { moderateScale, verticalScale } from '../../utils/responsive';

const Fondo = require('../../assets/FondoPreguntas.jpg');

const formatearFecha = (texto: string) => {
  const limpio = texto.replace(/\D/g, '');
  let formateado = limpio;
  if (limpio.length >= 3 && limpio.length <= 4) {
    formateado = `${limpio.slice(0, 2)}/${limpio.slice(2)}`;
  } else if (limpio.length > 4) {
    formateado = `${limpio.slice(0, 2)}/${limpio.slice(2, 4)}/${limpio.slice(4, 8)}`;
  }
  return formateado;
};

const esFechaValida = (fechaStr: string) => {
  const partes = fechaStr.split('/');
  if (partes.length !== 3) return false;
  const [dia, mes, anio] = partes.map((x) => parseInt(x, 10));
  const fecha = new Date(anio, mes - 1, dia);
  return (
    fecha.getFullYear() === anio &&
    fecha.getMonth() === mes - 1 &&
    fecha.getDate() === dia
  );
};

const PreguntaNacimiento = () => {
  const navigation = useNavigation();
  const [fechaTexto, setFechaTexto] = useState('');

  const handleGuardarFecha = async () => {
    if (!esFechaValida(fechaTexto)) {
      Alert.alert('Fecha inválida', 'Por favor, introduce una fecha válida.');
      return;
    }

    const partes = fechaTexto.split('/');
    const fechaISO = new Date(
      parseInt(partes[2], 10),
      parseInt(partes[1], 10) - 1,
      parseInt(partes[0], 10)
    ).toISOString().split('T')[0];

    const uid = await obtenerUIDUsuarioActual();
    if (uid) {
      try {
        await guardarDatoBebe(uid, { fechaNacimiento: fechaISO });
        navigation.navigate('PreguntaSexo');
      } catch (error) {
        console.error('Error al guardar fecha:', error);
        Alert.alert('Error', 'No se pudo guardar la fecha.');
      }
    } else {
      Alert.alert('Error', 'No se pudo identificar al usuario.');
    }
  };

  const handleFechaInput = (texto: string) => {
    setFechaTexto(formatearFecha(texto));
  };

  return (
    <ImageBackground source={Fondo} style={styles.fondo} resizeMode="cover">
      <View style={styles.contenedor}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botonAtras}>
          <Text style={styles.textoAtras}>← Atrás</Text>
        </TouchableOpacity>

        <Text style={styles.pregunta}>¿Cuándo nació tu bebé?</Text>
        <TextInput
          placeholder="dd/mm/aaaa"
          keyboardType="numeric"
          value={fechaTexto}
          onChangeText={handleFechaInput}
          maxLength={10}
          style={styles.input}
        />

        <View style={styles.botonContainer}>
          <Button title="Siguiente" onPress={handleGuardarFecha} />
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
  input: {
    backgroundColor: '#fff',
    padding: moderateScale(10),
    fontSize: moderateScale(18),
    borderRadius: moderateScale(10),
    borderColor: '#ccc',
    borderWidth: 1,
    textAlign: 'center',
  },
  botonContainer: {
    marginTop: verticalScale(20),
  },
});

export default PreguntaNacimiento;
