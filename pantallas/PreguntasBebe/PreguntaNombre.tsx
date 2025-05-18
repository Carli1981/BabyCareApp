import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { guardarDatoBebe } from '../../servicios/firestoreService';
import { obtenerUIDUsuarioActual } from '../../servicios/authService';

const Fondo = require('../../assets/FondoPreguntas.jpg');

const PreguntaNombre = () => {
  const navigation = useNavigation();
  const [nombre, setNombre] = useState('');

  const handleGuardarNombre = async () => {
    if (!nombre.trim()) return;

    const uid = await obtenerUIDUsuarioActual();
    if (uid) {
      try {
        await guardarDatoBebe(uid, { nombre });
        navigation.navigate('PreguntaNacimiento');
      } catch (error) {
        console.error('Error al guardar nombre:', error);
        Alert.alert('Error', 'No se pudo guardar el nombre.');
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

        <Text style={styles.pregunta}>¿Cómo se llama tu bebé?</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre del bebé"
        />
        <View style={styles.botonContainer}>
          <Button
            title="Siguiente"
            onPress={handleGuardarNombre}
            disabled={!nombre.trim()}
          />
        </View>
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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  botonContainer: {
    marginTop: 20,
  },
});

export default PreguntaNombre;
