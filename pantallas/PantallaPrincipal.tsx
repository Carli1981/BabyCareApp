import React from 'react';
import { View, Text, Button, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FondoPrincipal = require('../assets/FondoPantallaPrincipal.jpg'); // Cambia a tu fondo real

const PantallaPrincipal = () => {
  const navigation = useNavigation();

  const irResumenDatos = () => {
    navigation.navigate('ResumenDatosBebe');
  };

  return (
    <ImageBackground source={FondoPrincipal} style={styles.fondo}>
      <View style={styles.contenedor}>
        <Text style={styles.titulo}>Bienvenido a BabyCareApp</Text>
        <Button title="Perfil del bebé" onPress={irResumenDatos} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'cover',
  },
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    margin: 20,
    borderRadius: 15,
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default PantallaPrincipal;
