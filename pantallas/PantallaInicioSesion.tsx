import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert, useWindowDimensions } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { obtenerDatosBebe } from '../servicios/firestoreService';
import { moderateScale, verticalScale, isTablet } from '../utils/responsive';

const esCorreoValido = (correo: string): boolean => {
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexCorreo.test(correo);
};

export default function PantallaInicioSesion() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const iniciarSesion = async () => {
    console.log('iniciarSesion llamado'); 

    setMensajeError('');

    if (!correo || !contrasena) {
      console.log('Campos incompletos');
      setMensajeError('Por favor completa todos los campos.');
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    if (!esCorreoValido(correo)) {
      console.log('Correo inválido:', correo);
      setMensajeError('El formato del correo electrónico no es válido.');
      Alert.alert('Error', 'El formato del correo electrónico no es válido.');
      return;
    }

    try {
      const credenciales = await signInWithEmailAndPassword(auth, correo, contrasena);
      const uid = credenciales.user.uid;

      const datosBebe = await obtenerDatosBebe(uid);

      if (datosBebe) {
        navigation.navigate('PantallaPrincipal' as never);
      } else {
        navigation.navigate('PreguntaNombre' as never);
      }
    } catch (error: any) {
      let mensaje = 'Ocurrió un error al iniciar sesión.';

      switch (error.code) {
        case 'auth/user-not-found':
          mensaje = 'No existe una cuenta con ese correo electrónico.';
          break;
        case 'auth/wrong-password':
          mensaje = 'Contraseña incorrecta.';
          break;
        case 'auth/invalid-email':
          mensaje = 'El formato del correo electrónico no es válido.';
          break;
        case 'auth/missing-password':
          mensaje = 'Debes ingresar una contraseña.';
          break;
        default:
          mensaje = `Error inesperado: ${error.message}`;
          break;
      }

      console.log('Error en inicio de sesión:', mensaje);
      setMensajeError(mensaje);
      Alert.alert('Error', mensaje);
    }
  };

 return (
    <ImageBackground source={require('../assets/fondo.jpg')} style={styles.fondo} resizeMode="cover">
      <View style={[styles.contenedor, { margin: moderateScale(20), padding: moderateScale(20), borderRadius: moderateScale(20) }]}>
        <Text style={[styles.titulo, { fontSize: moderateScale(26) }]}>Iniciar Sesión</Text>
        <TextInput
          style={[styles.entrada, { height: verticalScale(45), borderRadius: moderateScale(8), paddingHorizontal: moderateScale(10) }]}
          placeholder="Correo electrónico"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={[styles.entrada, { height: verticalScale(45), borderRadius: moderateScale(8), paddingHorizontal: moderateScale(10) }]}
          placeholder="Contraseña"
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
        />
        {mensajeError ? <Text style={[styles.mensajeError, { fontSize: moderateScale(14) }]}>{mensajeError}</Text> : null}
        <TouchableOpacity style={[styles.boton, { paddingVertical: verticalScale(12), borderRadius: moderateScale(10), marginTop: moderateScale(10) }]} onPress={iniciarSesion}>
          <Text style={[styles.botonTexto, { fontSize: moderateScale(16) }]}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PantallaRegistro' as never)}>
          <Text style={[styles.enlace, { marginTop: moderateScale(10), fontSize: moderateScale(14) }]}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PantallaRecuperarContrasena' as never)}>
          <Text style={[styles.enlace, { marginTop: moderateScale(10), fontSize: moderateScale(14) }]}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, justifyContent: 'center' },
  contenedor: {
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  titulo: {
    fontWeight: 'bold',
    marginBottom: moderateScale(20),
    textAlign: 'center',
  },
  entrada: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: moderateScale(12),
    backgroundColor: '#fff',
  },
  mensajeError: {
    color: 'red',
    marginBottom: moderateScale(10),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  boton: {
    backgroundColor: '#2196F3',
  },
  botonTexto: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  enlace: {
    color: '#555',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});