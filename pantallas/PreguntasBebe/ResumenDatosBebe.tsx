import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { obtenerUIDUsuarioActual } from '../../servicios/authService';
import { obtenerDatosBebe } from '../../servicios/firestoreService';

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
      <View style={styles.contenedor}>
        <Text>Cargando datos del bebé...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <Text style={styles.titulo}>Resumen de Datos del Bebé</Text>

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

      <Button title="Editar Datos" onPress={() => navigation.navigate('EditarDatosBebe')} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  texto: {
    fontSize: 18,
    marginVertical: 5,
  },
  imagen: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
});

export default ResumenDatosBebe;
