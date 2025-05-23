import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Alert,
  ImageBackground,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { scale, verticalScale, moderateScale } from '../utils/responsive';

const fondo = require('../assets/FondoPantallaFiltros.jpg');

// Actividades
const tiposActividad = [
  'Pipí',
  'Evacuación',
  'Cambio de pañal',
  'Baño',
  'Pasear',
  'Sueño',
  'Dar pecho',
  'Dar biberón',
];

const isValidDateString = (dateString: string) => {
  const regex = /^\d{2}-\d{2}-\d{4}$/;
  if (!regex.test(dateString)) return false;
  const [day, month, year] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const now = new Date();
  return (
    !isNaN(date.getTime()) &&
    date.getDate() === day &&
    date.getMonth() === month - 1 &&
    date.getFullYear() === year &&
    date <= now
  );
};

const parseDate = (dateString: string) => {
  const [day, month, year] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('es-ES').split('/').join('-');
};

const PantallaFiltros = () => {
  const [tiposSeleccionados, setTiposSeleccionados] = useState<string[]>([]);
  const [desde, setDesde] = useState<Date | null>(null);
  const [hasta, setHasta] = useState<Date | null>(null);
  const [desdeTexto, setDesdeTexto] = useState('');
  const [hastaTexto, setHastaTexto] = useState('');
  const [showDesdePicker, setShowDesdePicker] = useState(false);
  const [showHastaPicker, setShowHastaPicker] = useState(false);
  const [comentarioFiltro, setComentarioFiltro] = useState<string>('');
  const [soloConComentario, setSoloConComentario] = useState<boolean>(false); // filtro con comentario

  const navigation = useNavigation<any>();

  const toggleTipo = (tipo: string) => {
    setTiposSeleccionados(prev =>
      prev.includes(tipo) ? prev.filter(t => t !== tipo) : [...prev, tipo]
    );
  };

  const aplicarFiltros = () => {
    if (
      (desdeTexto && !isValidDateString(desdeTexto)) ||
      (hastaTexto && !isValidDateString(hastaTexto))
    ) {
      Alert.alert('Error', 'El formato de la fecha no es correcta.');
      return;
    }

    if (desde && hasta && desde > hasta) {
      Alert.alert('Error', 'La fecha "Desde" no puede ser posterior a "Hasta".');
      return;
    }

    const hoy = new Date();
    if ((desde && desde > hoy) || (hasta && hasta > hoy)) {
      Alert.alert('Error', 'No se permiten fechas futuras.');
      return;
    }

    const hastaFinal = hasta
      ? new Date(hasta.getFullYear(), hasta.getMonth(), hasta.getDate(), 23, 59, 59, 999)
      : null;

    navigation.navigate('PantallaResultadosFiltros', {
      filtros: {
        tipo: tiposSeleccionados.length > 0 ? tiposSeleccionados : null,
        desde: desde ? desde.toISOString() : null,
        hasta: hastaFinal ? hastaFinal.toISOString() : null,
        comentario: comentarioFiltro.trim() !== '' ? comentarioFiltro.trim() : null,
        soloConComentario: soloConComentario, // nuevo filtro
      },
    });
  };

  const limpiarFiltros = () => {
    setTiposSeleccionados([]);
    setDesde(null);
    setHasta(null);
    setDesdeTexto('');
    setHastaTexto('');
    setComentarioFiltro('');
    setSoloConComentario(false);
  };

  const autoFormatearFecha = (text: string) => {
    const soloNumeros = text.replace(/\D/g, '').slice(0, 8);
    let resultado = '';
    for (let i = 0; i < soloNumeros.length; i++) {
      resultado += soloNumeros[i];
      if (i === 1 || i === 3) resultado += '-';
    }
    return resultado;
  };

  return (
    <ImageBackground source={fondo} style={styles.fondo} resizeMode="cover">
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.contenedor}>
          <Text style={styles.titulo}>Filtros de Actividades</Text>

          {/* Filtro por tipo */}
          <View style={styles.tiposContainer}>
            {tiposActividad.map((tipo) => {
              const seleccionado = tiposSeleccionados.includes(tipo);
              return (
                <TouchableOpacity
                  key={tipo}
                  style={[styles.tipoBoton, seleccionado && styles.tipoBotonSeleccionado]}
                  onPress={() => toggleTipo(tipo)}
                >
                  <Text style={[styles.tipoTexto, seleccionado && styles.tipoTextoSeleccionado]}>
                    {tipo}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Fecha Desde */}
          <Text style={styles.subtitulo}>Desde</Text>
          {Platform.OS === 'web' ? (
            <TextInput
              style={styles.input}
              value={desdeTexto}
              placeholder="DD-MM-YYYY"
              onChangeText={(text) => setDesdeTexto(autoFormatearFecha(text))}
              onBlur={() => {
                if (desdeTexto && isValidDateString(desdeTexto)) {
                  const fecha = parseDate(desdeTexto);
                  if (hasta && fecha > hasta) {
                    Alert.alert('Error', '"Desde" no puede ser posterior a "Hasta".');
                    return;
                  }
                  setDesde(fecha);
                } else {
                  setDesde(null);
                }
              }}
              keyboardType="number-pad"
            />
          ) : (
            <>
              <TouchableOpacity style={styles.input} onPress={() => setShowDesdePicker(true)}>
                <Text>{desde ? formatDate(desde) : 'Seleccionar fecha'}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={showDesdePicker}
                mode="date"
                date={desde || new Date()}
                maximumDate={new Date()}
                onConfirm={(date) => {
                  if (hasta && date > hasta) {
                    Alert.alert('Error', '"Desde" no puede ser posterior a "Hasta".');
                    return;
                  }
                  setDesde(date);
                  setDesdeTexto(formatDate(date));
                  setShowDesdePicker(false);
                }}
                onCancel={() => setShowDesdePicker(false)}
              />
            </>
          )}

          {/* Fecha Hasta */}
          <Text style={styles.subtitulo}>Hasta</Text>
          {Platform.OS === 'web' ? (
            <TextInput
              style={styles.input}
              value={hastaTexto}
              placeholder="DD-MM-YYYY"
              onChangeText={(text) => setHastaTexto(autoFormatearFecha(text))}
              onBlur={() => {
                if (hastaTexto && isValidDateString(hastaTexto)) {
                  const fecha = parseDate(hastaTexto);
                  if (desde && fecha < desde) {
                    Alert.alert('Error', '"Hasta" no puede ser anterior a "Desde".');
                    return;
                  }
                  setHasta(fecha);
                } else {
                  setHasta(null);
                }
              }}
              keyboardType="number-pad"
            />
          ) : (
            <>
              <TouchableOpacity style={styles.input} onPress={() => setShowHastaPicker(true)}>
                <Text>{hasta ? formatDate(hasta) : 'Seleccionar fecha'}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={showHastaPicker}
                mode="date"
                date={hasta || new Date()}
                maximumDate={new Date()}
                minimumDate={desde || undefined}
                onConfirm={(date) => {
                  if (desde && date < desde) {
                    Alert.alert('Error', '"Hasta" no puede ser anterior a "Desde".');
                    return;
                  }
                  setHasta(date);
                  setHastaTexto(formatDate(date));
                  setShowHastaPicker(false);
                }}
                onCancel={() => setShowHastaPicker(false)}
              />
            </>
          )}

          {/* Filtro Comentarios */}
          <Text style={styles.subtitulo}>Buscar Comentario</Text>
          <TextInput
            style={styles.input}
            placeholder="Palabra clave"
            value={comentarioFiltro}
            onChangeText={setComentarioFiltro}
          />

          {/* Nuevo filtro: solo registros con comentario */}
          <View style={styles.filtroConComentarioContainer}>
            <Text style={styles.subtitulo}>Solo registros con comentario</Text>
            <TouchableOpacity
              style={[
                styles.checkbox,
                { backgroundColor: soloConComentario ? '#007BFF' : 'white' },
              ]}
              onPress={() => setSoloConComentario((prev) => !prev)}
            >
              <Text style={{ color: soloConComentario ? 'white' : '#000' }}>
                {soloConComentario ? '✔' : ''}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botones */}
          <View style={styles.botonesContainer}>
            <TouchableOpacity style={styles.botonAplicar} onPress={aplicarFiltros}>
              <MaterialCommunityIcons name="check" size={moderateScale(20)} color="white" />
              <Text style={styles.textoBoton}> Aplicar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botonLimpiar} onPress={limpiarFiltros}>
              <MaterialCommunityIcons name="close" size={moderateScale(20)} color="#007BFF" />
              <Text style={[styles.textoBoton, { color: '#007BFF' }]}> Limpiar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  fondo: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.4)' },
  contenedor: { padding: scale(20), flexGrow: 1 },
  titulo: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    marginBottom: verticalScale(25),
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginTop: verticalScale(15),
    marginBottom: verticalScale(8),
  },
  tiposContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  tipoBoton: {
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: moderateScale(20),
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(8),
    margin: scale(5),
  },
  tipoBotonSeleccionado: { backgroundColor: '#007BFF' },
  tipoTexto: { color: '#007BFF', fontWeight: '500' },
  tipoTextoSeleccionado: { color: 'white' },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: moderateScale(8),
    padding: verticalScale(12),
    backgroundColor: 'white',
    marginBottom: verticalScale(10),
    width: scale(150),
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: verticalScale(30),
  },
  botonAplicar: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
  botonLimpiar: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007BFF',
  },
  textoBoton: { fontWeight: '600', fontSize: moderateScale(16) },
  filtroConComentarioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(10),
  },
  checkbox: {
    width: scale(24),
    height: verticalScale(24),
    borderWidth: 1,
    borderColor: '#007BFF',
    marginLeft: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PantallaFiltros;
