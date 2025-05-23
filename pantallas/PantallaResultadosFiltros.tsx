import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { obtenerActividades } from '../servicios/actividadesService';

const fondo = require('../assets/FondoResultadosFiltros.jpg');

const PantallaResultadosFiltros = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const filtros = route.params?.filtros;
  const [resultados, setResultados] = useState<any[]>([]);

  useEffect(() => {
    const cargar = async () => {
      let datos = await obtenerActividades();

      datos = datos.filter((actividad: any) => {
        const fecha = actividad.timestamp?.toDate?.() ?? new Date();
        const cumpleTipo = filtros.tipo
          ? Array.isArray(filtros.tipo)
            ? filtros.tipo.includes(actividad.tipo)
            : actividad.tipo === filtros.tipo
          : true;
        const cumpleDesde = filtros.desde ? fecha >= new Date(filtros.desde) : true;
        const cumpleHasta = filtros.hasta ? fecha <= new Date(filtros.hasta) : true;
        return cumpleTipo && cumpleDesde && cumpleHasta;
      });

      datos.sort((a, b) => (b.timestamp?.toDate?.() ?? 0) - (a.timestamp?.toDate?.() ?? 0));
      setResultados(datos);
    };

    cargar();
  }, [filtros]);

  return (
    <ImageBackground source={fondo} style={styles.fondo} resizeMode="cover">
      <View style={styles.overlay}>
        <Text style={styles.titulo}>Resultados del Filtro</Text>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          {resultados.map((item) => {
            const fecha = item.timestamp?.toDate?.() ?? new Date();
            return (
              <View key={item.id} style={styles.item}>
                <Text>
                  {item.tipo} - {fecha.toLocaleDateString()} {fecha.toLocaleTimeString()}
                </Text>
                {item.comentario && <Text>💬 {item.comentario}</Text>}
              </View>
            );
          })}

          <TouchableOpacity
            style={styles.botonCerrar}
            onPress={() => navigation.navigate('PantallaActividades')}
          >
            <Text style={styles.textoCerrar}>Cerrar</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scroll: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      maxHeight: '80vh',
      overflowY: 'scroll',
    }),
  },
  scrollContent: {
    paddingBottom: 40,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 6,
    marginBottom: 8,
  },
  botonCerrar: {
    backgroundColor: '#007BFF',
    padding: 12,
    marginTop: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoCerrar: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PantallaResultadosFiltros;
