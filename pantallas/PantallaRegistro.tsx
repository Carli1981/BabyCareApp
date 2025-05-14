import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function PantallaRegistro() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const navigation = useNavigation();

  const registrarUsuario = async () => {
    if (contrasena !== confirmarContrasena) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, correo, contrasena);
      navigation.navigate('PantallaPrincipal' as never);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ImageBackground source={require('../assets/fondo.jpg')} style={styles.fondo} resizeMode="cover">
      <View style={styles.contenedor}>
        <Text style={styles.titulo}>Registro</Text>
        <TextInput style={styles.entrada} placeholder="Correo electrónico" value={correo} onChangeText={setCorreo} keyboardType="email-address" />
        <TextInput style={styles.entrada} placeholder="Contraseña" value={contrasena} onChangeText={setContrasena} secureTextEntry />
        <TextInput style={styles.entrada} placeholder="Confirmar Contraseña" value={confirmarContrasena} onChangeText={setConfirmarContrasena} secureTextEntry />
        <TouchableOpacity style={styles.boton} onPress={registrarUsuario}>
          <Text style={styles.botonTexto}>Registrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PantallaInicioSesion' as never)}>
          <Text style={styles.enlace}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, justifyContent: 'center' },
  contenedor: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    margin: 20,
    padding: 20,
    borderRadius: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  entrada: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  boton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  botonTexto: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  enlace: {
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});
