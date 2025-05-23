import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  useNavigation,
  CommonActions,
} from '@react-navigation/native';
import { cerrarSesion, obtenerUIDUsuarioActual } from '../servicios/authService';
import { obtenerDatosBebe } from '../servicios/firestoreService';

const FondoPrincipal = require('../assets/FondoPantallaPrincipal.jpg');

const PantallaPrincipal = () => {
  const navigation = useNavigation();
  const [fotoBebe, setFotoBebe] = useState<string | null>(null);

  useEffect(() => {
    const cargarFoto = async () => {
      const uid = await obtenerUIDUsuarioActual();
      if (!uid) return;

      const datos = await obtenerDatosBebe(uid);
      if (datos?.fotoLocal) {
        setFotoBebe(datos.fotoLocal);
      }
    };

    cargarFoto();
  }, []);

  const irResumenDatos = () => {
    navigation.navigate('ResumenDatosBebe');
  };

  const irActividades = () => {
    navigation.navigate('PantallaActividades');
  };

  const handleCerrarSesion = async () => {
    await cerrarSesion();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'PantallaInicioSesion' }],
      })
    );
  };

  return (
    <ImageBackground source={FondoPrincipal} style={styles.fondo}>
      <View style={styles.header}>
        {fotoBebe && (
          <TouchableOpacity onPress={irResumenDatos}>
            <Image source={{ uri: fotoBebe }} style={styles.avatar} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleCerrarSesion} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contenedor}>
        <Text style={styles.titulo}>Bienvenido a BabyCareApp</Text>
        <TouchableOpacity style={styles.boton} onPress={irResumenDatos}>
          <Text style={styles.botonTexto}>Perfil del bebé</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boton} onPress={irActividades}>
          <Text style={styles.botonTexto}>Actividades</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    resizeMode: 'cover',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
  },
  logoutButton: {
    backgroundColor: '#ff5c5c',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    margin: 20,
    borderRadius: 20,
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  boton: {
    backgroundColor: '#4aa3f0',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  botonTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default PantallaPrincipal;
