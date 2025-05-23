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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

import { scale, verticalScale, moderateScale } from '../utils/responsive';

const esCorreoValido = (email: string) => {
  return /\S+@\S+\.\S+/.test(email);
};

export default function PantallaRegistro() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const navigation = useNavigation();

  const registrarUsuario = async () => {
    console.log('registrarUsuario llamado');

    setMensajeError('');

    if (!correo || !contrasena || !confirmarContrasena) {
      setMensajeError('Por favor completa todos los campos.');
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    if (!esCorreoValido(correo)) {
      setMensajeError('Formato de correo electrónico inválido.');
      Alert.alert('Error', 'Formato de correo electrónico inválido.');
      return;
    }

    if (contrasena !== confirmarContrasena) {
      setMensajeError('Las contraseñas no coinciden.');
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    if (contrasena.length < 6) {
      setMensajeError('La contraseña debe tener al menos 6 caracteres.');
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, correo, contrasena);
      navigation.navigate('PreguntaNombre' as never);
    } catch (error: any) {
      let mensaje = 'Ocurrió un error al registrar el usuario.';

      switch (error.code) {
        case 'auth/email-already-in-use':
          mensaje = 'Este correo ya está registrado.';
          break;
        case 'auth/invalid-email':
          mensaje = 'El correo electrónico no es válido.';
          break;
        case 'auth/weak-password':
          mensaje = 'La contraseña es demasiado débil. Usa al menos 6 caracteres.';
          break;
        default:
          mensaje = `Error inesperado: ${error.message}`;
          break;
      }

      setMensajeError(mensaje);
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
        <Text style={styles.titulo}>Registro</Text>
        <TextInput
          style={styles.entrada}
          placeholder="Correo electrónico"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.entrada}
          placeholder="Contraseña"
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
        />
        <TextInput
          style={styles.entrada}
          placeholder="Confirmar Contraseña"
          value={confirmarContrasena}
          onChangeText={setConfirmarContrasena}
          secureTextEntry
        />
        {mensajeError ? (
          <Text style={styles.mensajeError}>{mensajeError}</Text>
        ) : null}
        <TouchableOpacity style={styles.boton} onPress={registrarUsuario}>
          <Text style={styles.botonTexto}>Registrate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('PantallaInicioSesion' as never)}
        >
          <Text style={styles.enlace}>¿Ya tienes cuenta? Inicia sesión</Text>
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
  mensajeError: {
    color: 'red',
    marginBottom: verticalScale(10),
    textAlign: 'center',
    fontWeight: 'bold',
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
  enlace: {
    color: '#555',
    textAlign: 'center',
    marginTop: verticalScale(10),
    textDecorationLine: 'underline',
    fontSize: moderateScale(14),
  },
});
