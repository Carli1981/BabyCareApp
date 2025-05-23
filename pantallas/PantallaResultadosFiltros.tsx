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
import { scale, verticalScale, moderateScale } from '../utils/responsive';

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

        // Filtro por tipo
        const cumpleTipo = filtros.tipo
          ? Array.isArray(filtros.tipo)
            ? filtros.tipo.includes(actividad.tipo)
            : actividad.tipo === filtros.tipo
          : true;

        // Filtro por fechas
        const cumpleDesde = filtros.desde ? fecha >= new Date(filtros.desde) : true;
        const cumpleHasta = filtros.hasta ? fecha <= new Date(filtros.hasta) : true;

        // Filtro por comentario (si existe y se especificó)
        let cumpleComentario = true;
        if (filtros.comentario) {
          const comentario = actividad.comentario ?? '';
          const filtroComentarioLower = filtros.comentario.toLowerCase();
          cumpleComentario = comentario.toLowerCase().includes(filtroComentarioLower);
        }

        // Filtro solo con comentarios
        if (filtros.soloConComentario) {
          const tieneComentario = actividad.comentario && actividad.comentario.trim() !== '';
          cumpleComentario = cumpleComentario && tieneComentario;
        }

        // Filtro por duración (en milisegundos)
        let cumpleDuracion = true;
        if (filtros.minDuracion) {
          const minDuracionMs = filtros.minDuracion * 60 * 1000; // Convertir minutos a ms
          cumpleDuracion = actividad.duracion >= minDuracionMs;
        }

        return cumpleTipo && cumpleDesde && cumpleHasta && cumpleComentario && cumpleDuracion;
      });

      datos.sort((a, b) => (b.timestamp?.toDate?.() ?? 0) - (a.timestamp?.toDate?.() ?? 0));
      setResultados(datos);
    };

    cargar();
  }, [filtros]);

  // Función para formatear duración en h, m, s
  const formatearDuracion = (milisegundos: number): string => {
    const totalSegundos = Math.floor(milisegundos / 1000);
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;

    const partes = [];
    if (horas > 0) partes.push(`${horas}h`);
    if (minutos > 0 || horas > 0) partes.push(`${minutos}m`);
    partes.push(`${segundos}s`);

    return partes.join(' ');
  };

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

            const duracionDisplay = item.duracion
              ? `⏱️ ${formatearDuracion(item.duracion)}`
              : '';

            return (
              <View key={item.id} style={styles.item}>
                <Text style={styles.textoItem}>
                  {item.tipo} - {fecha.toLocaleDateString()} {fecha.toLocaleTimeString()}
                </Text>
                {item.comentario && <Text style={styles.textoItem}>💬 {item.comentario}</Text>}
                {item.duracion && <Text style={styles.textoItem}>{duracionDisplay}</Text>}
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
    padding: scale(20),
  },
  titulo: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    marginBottom: verticalScale(10),
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      maxHeight: '80vh',
      overflowY: 'scroll',
    }),
  },
  scrollContent: {
    paddingBottom: verticalScale(40),
  },
  item: {
    padding: scale(10),
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: moderateScale(6),
    marginBottom: verticalScale(8),
  },
  textoItem: {
    fontSize: moderateScale(14),
  },
  botonCerrar: {
    backgroundColor: '#007BFF',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    marginTop: verticalScale(20),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
  textoCerrar: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: moderateScale(16),
  },
});

export default PantallaResultadosFiltros;
