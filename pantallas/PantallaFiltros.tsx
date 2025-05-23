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

const fondo = require('../assets/FondoPantallaFiltros.jpg');

const tiposActividad = ['Pipí', 'Evacuación', 'Cambio de pañal', 'Baño', 'Pasear', 'Sueño'];

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

  const navigation = useNavigation<any>();

  const toggleTipo = (tipo: string) => {
    setTiposSeleccionados(prev =>
      prev.includes(tipo) ? prev.filter(t => t !== tipo) : [...prev, tipo]
    );
  };

  const aplicarFiltros = () => {
    if ((desdeTexto && !isValidDateString(desdeTexto)) || (hastaTexto && !isValidDateString(hastaTexto))) {
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
      },
    });
  };

  const limpiarFiltros = () => {
    setTiposSeleccionados([]);
    setDesde(null);
    setHasta(null);
    setDesdeTexto('');
    setHastaTexto('');
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

          <View style={styles.botonesContainer}>
            <TouchableOpacity style={styles.botonAplicar} onPress={aplicarFiltros}>
              <MaterialCommunityIcons name="check" size={20} color="white" />
              <Text style={styles.textoBoton}> Aplicar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botonLimpiar} onPress={limpiarFiltros}>
              <MaterialCommunityIcons name="close" size={20} color="#007BFF" />
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
  contenedor: { padding: 20, flexGrow: 1 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 25, textAlign: 'center' },
  subtitulo: { fontSize: 18, fontWeight: '600', marginTop: 15, marginBottom: 8 },
  tiposContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  tipoBoton: {
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    margin: 5,
  },
  tipoBotonSeleccionado: { backgroundColor: '#007BFF' },
  tipoTexto: { color: '#007BFF', fontWeight: '500' },
  tipoTextoSeleccionado: { color: 'white' },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
    marginBottom: 10,
    width: 150,
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  botonAplicar: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonLimpiar: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007BFF',
  },
  textoBoton: { fontWeight: '600', fontSize: 16 },
});

export default PantallaFiltros;
