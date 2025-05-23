import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Button,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { obtenerUIDUsuarioActual } from '../../servicios/authService';
import { obtenerDatosBebe } from '../../servicios/firestoreService';

const fondo = require('../../assets/FondoPantallaResumenDatos.jpg');

const formatearFechaMostrada = (fechaISO: string) => {
  if (!fechaISO) return '';
  const partes = fechaISO.split('-');
  return `${partes[2]}-${partes[1]}-${partes[0]}`;
};

const formatearAlimentacion = (valor: string) => {
  if (valor === 'Leche de formula') return 'Leche de fórmula';
  return valor;
};

const ResumenDatosBebe = () => {
  const navigation = useNavigation();
  const [datosBebe, setDatosBebe] = useState<any>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      const uid = await obtenerUIDUsuarioActual();
      if (!uid) return;

      const datos = await obtenerDatosBebe(uid);
      setDatosBebe(datos);
    };

    cargarDatos();
  }, []);

  if (!datosBebe) {
    return (
      <ImageBackground source={fondo} style={styles.fondo} resizeMode="cover">
        <View style={[styles.overlay, styles.contenedor]}>
          <Text style={styles.texto}>Cargando datos del bebé...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={fondo} style={styles.fondo} resizeMode="cover">
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.contenedor}>
          <Text style={styles.titulo}>Datos del Bebé</Text>

          {datosBebe.fotoLocal && (
            <Image source={{ uri: datosBebe.fotoLocal }} style={styles.imagen} />
          )}

          <Text style={styles.texto}>Nombre: {datosBebe.nombre}</Text>
          <Text style={styles.texto}>
            Fecha de Nacimiento: {formatearFechaMostrada(datosBebe.fechaNacimiento)}
          </Text>
          <Text style={styles.texto}>Sexo: {datosBebe.sexo}</Text>
          <Text style={styles.texto}>Peso: {datosBebe.peso} kg</Text>
          <Text style={styles.texto}>Altura: {datosBebe.altura} cm</Text>
          <Text style={styles.texto}>
            Alimentación: {formatearAlimentacion(datosBebe.alimentacion)}
          </Text>
          <Text style={styles.texto}>
            Recibir Notificaciones: {datosBebe.recibirNotificaciones ? 'Sí' : 'No'}
          </Text>

          <View style={styles.botonContainer}>
            <Button title="Editar Datos" onPress={() => navigation.navigate('EditarDatosBebe')} />
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)', // Ajusta la opacidad si es necesario
  },
  contenedor: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  texto: {
    fontSize: 18,
    marginVertical: 5,
    color: '#333',
  },
  imagen: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  botonContainer: {
    marginTop: 20,
    width: '10%',
  },
});

export default ResumenDatosBebe;
