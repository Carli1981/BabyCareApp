import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  registrarActividad,
  obtenerActividades,
  actualizarComentarioActividad,
  eliminarActividad,
} from '../servicios/actividadesService';
import { useSueno } from '../contextos/contextoSueno';

const actividades = [
  { tipo: 'Pipí', icono: 'water' },
  { tipo: 'Evacuación', icono: 'emoticon-poop' },
  { tipo: 'Cambio de pañal', icono: 'baby-face-outline' },
  { tipo: 'Baño', icono: 'bathtub' },
];

const PantallaActividades = () => {
  const [registros, setRegistros] = useState<any[]>([]);
  const [comentario, setComentario] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [registroSeleccionado, setRegistroSeleccionado] = useState<any>(null);
  const [tiempoActual, setTiempoActual] = useState(new Date());
  const [mostrarAyer, setMostrarAyer] = useState(false);
  const [mostrarOtros, setMostrarOtros] = useState(false);

  const { suenoActivo, iniciarSueno, finalizarSueno, horaInicioSueno } = useSueno();
  const intervaloRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    cargarActividades();
  }, []);

  useEffect(() => {
    if (suenoActivo) {
      const intervalo = setInterval(() => {
        setTiempoActual(new Date());
      }, 1000);
      setTiempoActual(new Date());
      return () => clearInterval(intervalo);
    }
  }, [suenoActivo]);

  const cargarActividades = async () => {
    const datos = await obtenerActividades();
    setRegistros(datos);
  };

const manejarActividad = async (tipo: string) => {
  const res = await registrarActividad(tipo, comentario);
  if (!res || !res.success) {
    alert('Error registrando actividad');
    return;
  }
  await cargarActividades();
};


  const abrirModalComentario = (registro: any) => {
    setRegistroSeleccionado(registro);
    setComentario(registro.comentario || '');
    setModalVisible(true);
  };

  const guardarComentario = async () => {
    if (registroSeleccionado?.id) {
      await actualizarComentarioActividad(registroSeleccionado.id, comentario);
      await cargarActividades();
    }
    setComentario('');
    setRegistroSeleccionado(null);
    setModalVisible(false);
  };

  const borrarRegistro = async (id: string) => {
    await eliminarActividad(id);
    await cargarActividades();
  };

  const formatearDuracion = (milisegundos: number) => {
    const horas = Math.floor(milisegundos / 3600000);
    const minutos = Math.floor((milisegundos % 3600000) / 60000);
    const segundos = Math.floor((milisegundos % 60000) / 1000);
    return `${horas.toString().padStart(2, '0')}:${minutos
      .toString()
      .padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  };

  const renderRegistro = ({ item }: { item: any }) => {
    const fecha = item.timestamp?.toDate?.() ?? new Date();
    const fechaStr = fecha.toLocaleDateString();
    const horaStr = fecha.toLocaleTimeString();

    return (
      <View style={styles.registroItem}>
        <View style={styles.registroCabecera}>
          <Text>📝 {item.tipo} - {fechaStr} {horaStr}</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity onPress={() => abrirModalComentario(item)}>
              <MaterialCommunityIcons name="comment-edit-outline" size={20} color="#007BFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => borrarRegistro(item.id)}>
              <MaterialCommunityIcons name="trash-can-outline" size={20} color="red" />
            </TouchableOpacity>
          </View>
        </View>

        {item.tipo === 'Sueño' && item.timestampInicio && item.timestampFin && item.duracion && (
          <Text>
            🛌 Fecha: {fechaStr} - Inicio: {new Date(item.timestampInicio.toDate()).toLocaleTimeString()} - Fin: {new Date(item.timestampFin.toDate()).toLocaleTimeString()} ({formatearDuracion(item.duracion)})
          </Text>
        )}

        {item.comentario && <Text>💬 {item.comentario}</Text>}
      </View>
    );
  };

  const agruparPorFecha = () => {
    const hoy = new Date();
    const ayer = new Date();
    ayer.setDate(hoy.getDate() - 1);

    const grupos: { hoy: any[]; ayer: any[]; otros: any[] } = { hoy: [], ayer: [], otros: [] };

    [...registros]
      .sort((a, b) => (b.timestamp?.toDate?.() ?? 0) - (a.timestamp?.toDate?.() ?? 0))
      .forEach((registro) => {
        const fecha = registro.timestamp?.toDate?.() ?? new Date();
        const fechaSolo = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());

        const hoySolo = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        const ayerSolo = new Date(ayer.getFullYear(), ayer.getMonth(), ayer.getDate());

        if (fechaSolo.getTime() === hoySolo.getTime()) {
          grupos.hoy.push(registro);
        } else if (fechaSolo.getTime() === ayerSolo.getTime()) {
          grupos.ayer.push(registro);
        } else {
          grupos.otros.push(registro);
        }
      });

    return grupos;
  };

  const formatoDuracion = () => {
    if (!horaInicioSueno) return '';
    const ahora = tiempoActual.getTime();
    const inicio = new Date(horaInicioSueno).getTime();
    const duracionMs = ahora - inicio;
    if (duracionMs < 0 || isNaN(duracionMs)) return '00:00:00';
    return formatearDuracion(duracionMs);
  };

  const grupos = agruparPorFecha();

  return (
    <ScrollView style={styles.contenedor}>
      <Text style={styles.titulo}>Actividades del Bebé</Text>

      {suenoActivo && (
        <View>
          <Text style={styles.cronometro}>
            🛌 Durmiendo desde hace: {formatoDuracion()}
          </Text>
        </View>
      )}

      <View style={styles.grid}>
        {actividades.map((act, index) => (
          <TouchableOpacity
            key={index}
            style={styles.botonActividad}
            onPress={() => manejarActividad(act.tipo)}
          >
            <View style={styles.iconoFondo}>
              <MaterialCommunityIcons name={act.icono as any} size={30} color="#007BFF" />
            </View>
            <Text style={styles.textoActividad}>{act.tipo}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.botonActividad}
          onPress={() => suenoActivo ? finalizarSueno(cargarActividades) : iniciarSueno()}
        >
          <View style={[styles.iconoFondo, { backgroundColor: suenoActivo ? '#FFD3D3' : '#E0F7FF' }]}>
            <MaterialCommunityIcons name="bed-outline" size={30} color="#007BFF" />
          </View>
          <Text style={styles.textoActividad}>{suenoActivo ? 'Despertar' : 'Sueño'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitulo}>Historial</Text>

      {grupos.hoy.length > 0 && (
        <>
          <Text style={styles.seccionTitulo}>📅 Hoy</Text>
          <FlatList data={grupos.hoy} renderItem={renderRegistro} keyExtractor={(item) => item.id} />
        </>
      )}

      <Text style={styles.seccionTitulo} onPress={() => setMostrarAyer(!mostrarAyer)}>
        📆 Ayer {mostrarAyer ? '🔽' : '▶️'}
      </Text>
      {mostrarAyer && (
        <FlatList data={grupos.ayer} renderItem={renderRegistro} keyExtractor={(item) => item.id} />
      )}

      <Text style={styles.seccionTitulo} onPress={() => setMostrarOtros(!mostrarOtros)}>
        🗓️ Otros días {mostrarOtros ? '🔽' : '▶️'}
      </Text>
      {mostrarOtros && (
        <FlatList data={grupos.otros} renderItem={renderRegistro} keyExtractor={(item) => item.id} />
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <Text style={styles.subtitulo}>Agregar comentario</Text>
            <TextInput
              style={styles.input}
              placeholder="Escribe un comentario..."
              value={comentario}
              onChangeText={setComentario}
            />
            <TouchableOpacity style={styles.botonGuardar} onPress={guardarComentario}>
              <Text style={styles.textoBoton}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F2',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
  },
  botonActividad: {
    width: 90,
    height: 100,
    margin: 8,
    alignItems: 'center',
  },
  iconoFondo: {
    backgroundColor: '#E0F7FF',
    padding: 15,
    borderRadius: 50,
  },
  textoActividad: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  seccionTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  registroItem: {
    padding: 10,
    backgroundColor: '#E6F7FF',
    borderRadius: 8,
    marginBottom: 10,
  },
  registroCabecera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalFondo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContenido: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '80%',
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  botonGuardar: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cronometro: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#007BFF',
  },
});

export default PantallaActividades;