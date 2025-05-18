import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
  ImageBackground,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

import { obtenerUIDUsuarioActual } from '../servicios/authService';
import { obtenerDatosBebe, guardarDatoBebe } from '../servicios/firestoreService';

const EditarDatosBebe = () => {
  const navigation = useNavigation();
  const [datos, setDatos] = useState<any>({
    nombre: '',
    fechaNacimiento: '',
    sexo: '',
    peso: '',
    altura: '',
    alimentacion: '',
    recibirNotificaciones: false,
    fotoLocal: null,
  });

  const [estadoOriginalNotificaciones, setEstadoOriginalNotificaciones] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      const uid = await obtenerUIDUsuarioActual();
      if (!uid) return;

      const datosGuardados = await obtenerDatosBebe(uid);
      if (datosGuardados) {
        // Convertir fecha 2024-10-31 => 31-10-2024
        const fechaOriginal = datosGuardados.fechaNacimiento;
        if (fechaOriginal && /^\d{4}-\d{2}-\d{2}$/.test(fechaOriginal)) {
          const [a, m, d] = fechaOriginal.split('-');
          datosGuardados.fechaNacimiento = `${d}-${m}-${a}`;
        }

        setDatos(datosGuardados);
        setEstadoOriginalNotificaciones(datosGuardados.recibirNotificaciones ?? false);
      }
    };

    cargarDatos();
  }, []);

  const seleccionarImagen = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a las fotos');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      setDatos({ ...datos, fotoLocal: resultado.assets[0].uri });
    }
  };

  const formatearFechaInput = (texto: string) => {
    let limpio = texto.replace(/\D/g, '').slice(0, 8);
    if (limpio.length >= 5) return `${limpio.slice(0, 2)}-${limpio.slice(2, 4)}-${limpio.slice(4, 8)}`;
    else if (limpio.length >= 3) return `${limpio.slice(0, 2)}-${limpio.slice(2)}`;
    else return limpio;
  };

  const validarPeso = (texto: string) => {
    const limpio = texto.replace(',', '.');
    const valido = limpio.match(/^\d{0,1}(\.\d{0,3})?$/);
    if (valido || limpio === '') setDatos({ ...datos, peso: limpio });
  };

  const validarAltura = (texto: string) => {
    const limpio = texto.replace(/\D/g, '');
    if (limpio.length <= 2) setDatos({ ...datos, altura: limpio });
  };

  const guardarCambios = async () => {
    const uid = await obtenerUIDUsuarioActual();
    if (!uid) return;

    // Convertir fecha 31-10-2024 => 2024-10-31 antes de guardar
    let datosAGuardar = { ...datos };
    if (datos.fechaNacimiento && /^\d{2}-\d{2}-\d{4}$/.test(datos.fechaNacimiento)) {
      const [d, m, a] = datos.fechaNacimiento.split('-');
      datosAGuardar.fechaNacimiento = `${a}-${m}-${d}`;
    }

    await guardarDatoBebe(uid, datosAGuardar);

    const notificacionCambio = estadoOriginalNotificaciones !== datos.recibirNotificaciones;
    const mensajeNotificacion = datos.recibirNotificaciones
      ? 'Notificaciones activadas'
      : 'Notificaciones desactivadas';

    if (notificacionCambio) {
      if (Platform.OS === 'android') {
        ToastAndroid.show(mensajeNotificacion, ToastAndroid.SHORT);
      } else {
        Alert.alert('Notificación', mensajeNotificacion);
      }
    }

    Alert.alert('Éxito', 'Datos guardados correctamente');
    navigation.navigate('PantallaPrincipal');
  };

  const toggleNotificaciones = (valor: boolean) => {
    setDatos({ ...datos, recibirNotificaciones: valor });
  };

  return (
    <ImageBackground
      source={require('../assets/FondoEditar.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.row}>
              {/* FOTO */}
              <View style={styles.fotoContainer}>
                <Text style={styles.titulo}>Editar Datos del Bebé</Text>
                {datos.fotoLocal && <Image source={{ uri: datos.fotoLocal }} style={styles.imagen} />}
                <Button title="Cambiar Foto" onPress={seleccionarImagen} />
              </View>

              {/* FORMULARIO */}
              <View style={styles.formulario}>
                <Text style={styles.label}>Nombre</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre"
                  value={datos.nombre}
                  onChangeText={(text) => setDatos({ ...datos, nombre: text })}
                />

                <Text style={styles.label}>Fecha de Nacimiento (dd-mm-aaaa)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="dd-mm-aaaa"
                  keyboardType="numeric"
                  value={datos.fechaNacimiento}
                  onChangeText={(text) =>
                    setDatos({ ...datos, fechaNacimiento: formatearFechaInput(text) })
                  }
                />

                <Text style={styles.label}>Sexo</Text>
                <Picker
                  selectedValue={datos.sexo}
                  onValueChange={(itemValue) => setDatos({ ...datos, sexo: itemValue })}
                  style={styles.picker}
                >
                  <Picker.Item label="Seleccionar..." value="" />
                  <Picker.Item label="Niño" value="Niño" />
                  <Picker.Item label="Niña" value="Niña" />
                  <Picker.Item label="Otro" value="Otro" />
                </Picker>

                <Text style={styles.label}>Peso (kg)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: 2.600"
                  value={datos.peso}
                  onChangeText={validarPeso}
                  keyboardType="numeric"
                />

                <Text style={styles.label}>Altura (cm)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: 60"
                  value={datos.altura}
                  onChangeText={validarAltura}
                  keyboardType="numeric"
                />

                <Text style={styles.label}>Alimentación</Text>
                <Picker
                  selectedValue={datos.alimentacion}
                  onValueChange={(itemValue) => setDatos({ ...datos, alimentacion: itemValue })}
                  style={styles.picker}
                >
                  <Picker.Item label="Seleccionar..." value="" />
                  <Picker.Item label="Lactancia materna" value="Lactancia materna" />
                  <Picker.Item label="Leche de fórmula" value="Leche de formula" />
                  <Picker.Item label="Mixta" value="Mixta" />
                </Picker>

                <View style={styles.switchContainer}>
                  <Text style={styles.label}>¿Recibir notificaciones?</Text>
                  <Switch value={datos.recibirNotificaciones} onValueChange={toggleNotificaciones} />
                </View>

                <Button title="Guardar Cambios" onPress={guardarCambios} />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  fotoContainer: {
    width: '100%',
    maxWidth: 250,
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 20,
  },
  formulario: {
    flex: 1,
    minWidth: 250,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  imagen: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#000',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
});

export default EditarDatosBebe;
