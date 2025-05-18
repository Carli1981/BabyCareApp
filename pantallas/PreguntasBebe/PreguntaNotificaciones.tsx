import React from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

import { guardarDatoBebe } from '../../servicios/firestoreService';
import { obtenerUIDUsuarioActual } from '../../servicios/authService';

const Fondo = require('../../assets/FondoPreguntas.jpg');

const PreguntaNotificaciones = () => {
  const navigation = useNavigation();

  const guardarYSolicitarPermiso = async (quiereNotis: boolean) => {
    const uid = await obtenerUIDUsuarioActual();
    if (!uid) {
      Alert.alert('Error', 'No se pudo identificar al usuario.');
      return;
    }

    try {
      await guardarDatoBebe(uid, { notificaciones: quiereNotis });
      if (quiereNotis) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'No podremos enviarte notificaciones.');
        }
      }
      navigation.navigate('PantallaPrincipal');
    } catch (error) {
      console.error('Error guardando preferencia de notificaciones:', error);
      Alert.alert('Error', 'No se pudo guardar la preferencia.');
    }
  };

  return (
    <ImageBackground source={Fondo} style={styles.fondo}>
      <View style={styles.contenedor}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botonAtras}>
          <Text style={styles.textoAtras}>← Atrás</Text>
        </TouchableOpacity>

        <Text style={styles.pregunta}>¿Quieres recibir notificaciones?</Text>
        <Button title="Sí" onPress={() => guardarYSolicitarPermiso(true)} />
        <Button title="No" onPress={() => guardarYSolicitarPermiso(false)} />
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
});

export default PreguntaNotificaciones;
