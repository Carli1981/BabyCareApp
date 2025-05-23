import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

import { scale, verticalScale, moderateScale } from '../utils/responsive';

export default function PantallaRecuperarContrasena() {
  const [correo, setCorreo] = useState('');
  const navigation = useNavigation();

  const recuperarContrasena = async () => {
    if (!correo) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, correo);
      Alert.alert('Éxito', 'Se ha enviado un correo para restablecer tu contraseña.');
      navigation.navigate('PantallaInicioSesion' as never);
    } catch (error: any) {
      let mensaje = 'No se pudo enviar el correo.';

      switch (error.code) {
        case 'auth/user-not-found':
          mensaje = 'No existe una cuenta con ese correo electrónico.';
          break;
        case 'auth/invalid-email':
          mensaje = 'Correo electrónico no válido.';
          break;
        default:
          mensaje = `Error inesperado: ${error.message}`;
          break;
      }

      Alert.alert('Error', mensaje);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/fondo.jpg')}
      style={styles.fondo}
      resizeMode="cover"
    >
      <View style={styles.contenedor}>
        <Text style={styles.titulo}>Recuperar Contraseña</Text>
        <TextInput
          style={styles.entrada}
          placeholder="Correo electrónico"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.boton} onPress={recuperarContrasena}>
          <Text style={styles.botonTexto}>Recuperar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    justifyContent: 'center',
  },
  contenedor: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    margin: moderateScale(20),
    padding: moderateScale(20),
    borderRadius: moderateScale(20),
  },
  titulo: {
    fontSize: moderateScale(26),
    fontWeight: 'bold',
    marginBottom: verticalScale(20),
    textAlign: 'center',
  },
  entrada: {
    height: verticalScale(45),
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: verticalScale(12),
    paddingHorizontal: moderateScale(10),
    borderRadius: moderateScale(8),
    backgroundColor: '#fff',
  },
  boton: {
    backgroundColor: '#2196F3',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(10),
    marginTop: verticalScale(10),
  },
  botonTexto: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: moderateScale(16),
  },
});
