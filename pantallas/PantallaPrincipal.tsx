import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { cerrarSesion, obtenerUIDUsuarioActual } from '../servicios/authService';
import { obtenerDatosBebe } from '../servicios/firestoreService';
import { moderateScale, verticalScale } from '../utils/responsive';

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
    marginTop: verticalScale(40),
    paddingHorizontal: moderateScale(20),
  },
  avatar: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    borderWidth: 2,
    borderColor: '#fff',
  },
  logoutButton: {
    backgroundColor: '#ff5c5c',
    paddingVertical: verticalScale(8),
    paddingHorizontal: moderateScale(12),
    borderRadius: moderateScale(10),
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: moderateScale(14),
  },
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    margin: moderateScale(20),
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
  },
  titulo: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    marginBottom: verticalScale(30),
    textAlign: 'center',
  },
  boton: {
    backgroundColor: '#4aa3f0',
    paddingVertical: verticalScale(15),
    paddingHorizontal: moderateScale(30),
    borderRadius: moderateScale(12),
    marginVertical: verticalScale(10),
    width: '80%',
    alignItems: 'center',
  },
  botonTexto: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: '600',
  },
});

export default PantallaPrincipal;
