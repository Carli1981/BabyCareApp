import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

import { guardarDatoBebe } from '../../servicios/firestoreService';
import { obtenerUIDUsuarioActual } from '../../servicios/authService';
import { moderateScale, verticalScale } from '../../utils/responsive';

const Fondo = require('../../assets/FondoPreguntas.jpg');

const PreguntaFoto = () => {
  const navigation = useNavigation();
  const [imagen, setImagen] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const seleccionarImagen = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a las fotos');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      setImagen(resultado.assets[0].uri);
    }
  };

  const handleGuardarImagen = async () => {
    const uid = await obtenerUIDUsuarioActual();
    if (!uid) {
      Alert.alert('Error', 'No se pudo identificar al usuario.');
      return;
    }

    setGuardando(true);
    try {
      if (imagen) {
        await guardarDatoBebe(uid, { fotoLocal: imagen });
      }
      navigation.navigate('PreguntaAlimentacion');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la imagen.');
      console.error(error);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ImageBackground source={Fondo} style={styles.fondo} resizeMode="cover">
      <View style={styles.contenedor}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botonAtras}>
          <Text style={styles.textoAtras}>← Atrás</Text>
        </TouchableOpacity>

        <Text style={styles.pregunta}>Sube una foto de tu bebé (opcional)</Text>

        {imagen && <Image source={{ uri: imagen }} style={styles.imagen} />}

        <Button title="Seleccionar Foto" onPress={seleccionarImagen} />

        <View style={styles.botonContainer}>
          <Button
            title={guardando ? 'Guardando...' : 'Siguiente'}
            onPress={handleGuardarImagen}
            disabled={guardando}
          />
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
  imagen: {
    width: '100%',
    height: verticalScale(200),
    marginVertical: verticalScale(20),
    borderRadius: moderateScale(10),
    resizeMode: 'contain',
  },
  botonContainer: {
    marginTop: verticalScale(20),
  },
});

export default PreguntaFoto;
