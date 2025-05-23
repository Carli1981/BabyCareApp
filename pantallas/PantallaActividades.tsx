import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ImageBackground,
  ScrollView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  registrarActividad,
  obtenerActividades,
  actualizarComentarioActividad,
  eliminarActividad,
} from '../servicios/actividadesService';
import { useSueno } from '../contextos/contextoSueno';
import { useNavigation, useRoute } from '@react-navigation/native';
import Cronometro from '../componentes/Cronometro';
import { Timestamp } from 'firebase/firestore';

const actividades = [
  { tipo: 'Pipí', icono: 'water' },
  { tipo: 'Evacuación', icono: 'emoticon-poop' },
  { tipo: 'Cambio de pañal', icono: 'baby-face-outline' },
  { tipo: 'Baño', icono: 'bathtub' },
  { tipo: 'Dar pecho', icono: 'baby-bottle-outline' },
  { tipo: 'Dar biberón', icono: 'bottle-soda-outline' },
];

const PantallaActividades = () => {
  const [registros, setRegistros] = useState<any[]>([]);
  const [comentario, setComentario] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [registroSeleccionado, setRegistroSeleccionado] = useState<any>(null);
  const [mostrarAyer, setMostrarAyer] = useState(false);
  const [mostrarOtros, setMostrarOtros] = useState(false);
  const [modalBiberonVisible, setModalBiberonVisible] = useState(false);
  const [mlBiberon, setMlBiberon] = useState('');
  const [pechoActivo, setPechoActivo] = useState(false);
  const [inicioPecho, setInicioPecho] = useState<Date | null>(null);
  const [contador, setContador] = useState(0);
  const [tiempoActual, setTiempoActual] = useState(new Date());
  const [tiempoActualPecho, setTiempoActualPecho] = useState(new Date());
  const { suenoActivo, iniciarSueno, finalizarSueno, horaInicioSueno } = useSueno();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const filtros = route.params?.filtros;

  // Nuevo estado para controlar plegado de "Hoy"
  const [mostrarHoy, setMostrarHoy] = useState(true);

  useEffect(() => {
    cargarActividades();
  }, [filtros]);

  useEffect(() => {
    let intervalo: any;
    if (suenoActivo || pechoActivo) {
      intervalo = setInterval(() => {
        setContador((prev) => prev + 1); // fuerza re-render
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [suenoActivo, pechoActivo]);

  useEffect(() => {
    if (suenoActivo) {
      const intervalo = setInterval(() => {
        setTiempoActual(new Date());
      }, 1000);
      return () => clearInterval(intervalo);
    }
  }, [suenoActivo]);

  useEffect(() => {
    if (pechoActivo) {
      const intervalo = setInterval(() => {
        setTiempoActualPecho(new Date());
      }, 1000);
      return () => clearInterval(intervalo);
    }
  }, [pechoActivo]);

  const cargarActividades = async () => {
    let datos = await obtenerActividades();
    if (filtros) {
      datos = datos.filter((actividad: any) => {
        const fecha = actividad.timestamp?.toDate?.() ?? new Date();
        const cumpleTipo = filtros.tipo ? actividad.tipo === filtros.tipo : true;
        const cumpleDesde = filtros.desde ? fecha >= new Date(filtros.desde) : true;
        const cumpleHasta = filtros.hasta ? fecha <= new Date(filtros.hasta) : true;
        return cumpleTipo && cumpleDesde && cumpleHasta;
      });
    } else {
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - 10);
      datos = datos.filter((actividad: any) => {
        const fecha = actividad.timestamp?.toDate?.() ?? new Date();
        return fecha >= fechaLimite;
      });
    }

    (datos as any[]).sort((a, b) => (b.timestamp?.toDate?.()?.getTime() ?? 0) - (a.timestamp?.toDate?.()?.getTime() ?? 0));

    setRegistros(datos);
  };

  const manejarActividad = async (tipo: string) => {
    if (tipo === 'Dar biberón') {
      setModalBiberonVisible(true);
      return;
    }

    if (tipo === 'Dar pecho') {
      if (pechoActivo) {
        const fin = new Date();
        if (inicioPecho) {
          const duracionMs = fin.getTime() - inicioPecho.getTime();

          const res = await registrarActividad('Dar pecho', '', {
            timestampInicio: Timestamp.fromDate(inicioPecho),
            timestampFin: Timestamp.fromDate(fin),
            duracion: duracionMs,
          });

          if (!res?.success) {
            alert('Error registrando actividad');
            return;
          }
          setPechoActivo(false);
          setInicioPecho(null);
          await cargarActividades();
        }
      } else {
        setInicioPecho(new Date());
        setPechoActivo(true);
      }
      return;
    }

    const res = await registrarActividad(tipo, comentario);
    if (!res?.success) {
      alert('Error registrando actividad');
      return;
    }
    setComentario('');
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
    const h = Math.floor(milisegundos / 3600000);
    const m = Math.floor((milisegundos % 3600000) / 60000);
    const s = Math.floor((milisegundos % 60000) / 1000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const agruparPorFecha = () => {
    const hoy = new Date();
    const ayer = new Date();
    ayer.setDate(hoy.getDate() - 1);

    const grupos = { hoy: [], ayer: [], otros: [] } as { hoy: any[]; ayer: any[]; otros: any[] };

    registros.forEach((registro) => {
      const fecha = registro.timestamp?.toDate?.() ?? new Date();
      const fechaSolo = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
      const hoySolo = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      const ayerSolo = new Date(ayer.getFullYear(), ayer.getMonth(), ayer.getDate());

      if (fechaSolo.getTime() === hoySolo.getTime()) grupos.hoy.push(registro);
      else if (fechaSolo.getTime() === ayerSolo.getTime()) grupos.ayer.push(registro);
      else grupos.otros.push(registro);
    });

    return grupos;
  };

  const formatearDuracionTotal = () => {
    if (!horaInicioSueno) return '00:00:00';
    const duracionMs = tiempoActual.getTime() - new Date(horaInicioSueno).getTime();
    return duracionMs < 0 || isNaN(duracionMs) ? '00:00:00' : formatearDuracion(duracionMs);
  };

  const formatearDuracionPecho = () => {
    if (!inicioPecho) return '00:00:00';
    const duracionMs = tiempoActualPecho.getTime() - inicioPecho.getTime();
    return duracionMs < 0 || isNaN(duracionMs) ? '00:00:00' : formatearDuracion(duracionMs);
  };

  const confirmarBiberon = async () => {
    if (!mlBiberon || isNaN(Number(mlBiberon))) {
      alert('Por favor, ingresa una cantidad válida de ml.');
      return;
    }

    const comentarioTexto = `Cantidad: ${mlBiberon.trim()} ml`;
    const res = await registrarActividad('Dar biberón', comentarioTexto);

    if (!res?.success) {
      alert('Error registrando actividad');
      return;
    }

    setMlBiberon('');
    setModalBiberonVisible(false);
    await cargarActividades();
  };

  const renderRegistro = (item: any) => {
    const fecha = item.timestamp?.toDate?.() ?? new Date();
    const fechaStr = fecha.toLocaleDateString();
    const horaStr = fecha.toLocaleTimeString();

    return (
      <View style={styles.registroItem} key={item.id}>
        <View style={styles.registroCabecera}>
          <Text style={styles.textoRegistro}>📝 {item.tipo} - {fechaStr} {horaStr}</Text>
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
          <Text style={styles.textoRegistro}>
            🛌 Inicio: {new Date(item.timestampInicio.toDate()).toLocaleTimeString()} - Fin: {new Date(item.timestampFin.toDate()).toLocaleTimeString()} ({formatearDuracion(item.duracion)})
          </Text>
        )}
        {item.tipo === 'Dar pecho' && item.timestampInicio && item.timestampFin && item.duracion && (
  <Text style={{ color: '#28a745' }}>
    🍼 Inicio: {new Date(item.timestampInicio.toDate()).toLocaleTimeString()} - Fin: {new Date(item.timestampFin.toDate()).toLocaleTimeString()} ({formatearDuracion(item.duracion)})
  </Text>
)}

        {item.tipo === 'Dar pecho' && item.comentario && (
          <Text style={[styles.textoComentario, { color: '#28a745' }]}>🍼 {item.comentario}</Text>
        )}
        {item.tipo === 'Dar biberón' && (
          <Text style={[styles.textoComentario, { color: '#7952B3' }]}>
            🍼 {typeof item.comentario === 'string' && item.comentario.trim().length > 0 ? item.comentario : 'Sin datos de cantidad'}
          </Text>
        )}

        {item.tipo !== 'Dar biberón' && item.tipo !== 'Dar pecho' && item.comentario && (
          <Text style={styles.textoComentario}>💬 {item.comentario}</Text>
        )}
      </View>
    );
  };

  const grupos = agruparPorFecha();

  return (
    <ImageBackground source={require('../assets/FondoPantallaActividades.jpg')} style={styles.fondo} resizeMode="cover">
      <View style={styles.contenedorPrincipal}>
        {/* Para forzar re-render */}
        <Text style={{ display: 'none' }}>{contador}</Text>
        {/* Barra lateral izquierda */}
        <View style={styles.barraIzquierda}>
          {/* Aquí dividimos en dos columnas */}
          <View style={styles.columnas}>
            {/* Primera columna */}
            <View style={styles.columna}>
              {actividades.slice(0, Math.ceil(actividades.length / 2)).map((act, idx) => (
                <TouchableOpacity key={idx} style={styles.botonActividadColumna} onPress={() => manejarActividad(act.tipo)}>
                  <View style={styles.iconoContainer}>
                    <MaterialCommunityIcons name={act.icono as any} size={30} color="#fff" />
                  </View>
                  <Text style={styles.etiquetaIcono}>{act.tipo}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Segunda columna */}
            <View style={styles.columna}>
              {actividades.slice(Math.ceil(actividades.length / 2)).map((act, idx) => (
                <TouchableOpacity key={idx} style={styles.botonActividadColumna} onPress={() => manejarActividad(act.tipo)}>
                  <View style={styles.iconoContainer}>
                    <MaterialCommunityIcons name={act.icono as any} size={30} color="#fff" />
                  </View>
                  <Text style={styles.etiquetaIcono}>{act.tipo}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* Botón Sueño */}
          <TouchableOpacity style={[styles.botonActividadColumna, { marginTop: 30 }]} onPress={() => suenoActivo ? finalizarSueno(cargarActividades) : iniciarSueno()}>
            <View style={[styles.iconoContainer, { backgroundColor: '#7952B3' }]}>
              <MaterialCommunityIcons name="bed-outline" size={30} color="#fff" />
            </View>
            <Text style={styles.etiquetaIcono}>Sueño</Text>
          </TouchableOpacity>
          {/* Botón Filtros */}
          <TouchableOpacity style={[styles.botonActividadColumna, { marginTop: 30 }]} onPress={() => navigation.navigate('PantallaFiltros')}>
            <View style={[styles.iconoContainer, { backgroundColor: '#DC3545' }]}>
              <MaterialCommunityIcons name="filter" size={30} color="#fff" />
            </View>
            <Text style={styles.etiquetaIcono}>Filtro para histórico</Text>
          </TouchableOpacity>
        </View>

        {/* Sección registros */}
        <View style={styles.columnaRegistros}>
          {suenoActivo && (
            <Cronometro
              inicio={horaInicioSueno}
              icono="🛌"
              texto="Durmiendo desde:"
            />
          )}
          {pechoActivo && (
            <Cronometro
              inicio={inicioPecho}
              icono="🍼"
              texto="Dando pecho:"
              estilo={{ color: '#28a745' }}
            />
          )}

          {/* Scroll en registros con más espacio */}
          <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 30 }}>
            {/* Sección "Hoy" con plegado */}
            <TouchableOpacity onPress={() => setMostrarHoy(!mostrarHoy)}>
              <Text style={styles.seccionTitulo}>📅 Hoy {mostrarHoy ? '🔽' : '▶️'}</Text>
            </TouchableOpacity>
            {mostrarHoy && grupos.hoy.map(renderRegistro)}

            {/* Sección "Ayer" */}
            <TouchableOpacity onPress={() => setMostrarAyer(!mostrarAyer)}>
              <Text style={styles.seccionTitulo}>📆 Ayer {mostrarAyer ? '🔽' : '▶️'}</Text>
            </TouchableOpacity>
            {mostrarAyer && grupos.ayer.map(renderRegistro)}

            {/* Sección "Otros días" */}
            <TouchableOpacity onPress={() => setMostrarOtros(!mostrarOtros)}>
              <Text style={styles.seccionTitulo}>🗓️ Otros días {mostrarOtros ? '🔽' : '▶️'}</Text>
            </TouchableOpacity>
            {mostrarOtros && grupos.otros.map(renderRegistro)}
          </ScrollView>
        </View>
      </View>

      {/* Modales (igual que antes) */}
      {/* ... (mantener igual, no se repite aquí para ahorrar espacio) */}
      {/* Modal comentarios */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <Text style={styles.subtitulo}>Agregar comentario</Text>
            <TextInput
              style={styles.input}
              placeholder="Escribe un comentario..."
              value={comentario}
              onChangeText={setComentario}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity style={styles.botonGuardar} onPress={guardarComentario}>
              <Text style={styles.textoBoton}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.botonGuardar, { backgroundColor: 'gray', marginTop: 10 }]} onPress={() => setModalVisible(false)}>
              <Text style={styles.textoBoton}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Biberón */}
      <Modal visible={modalBiberonVisible} transparent animationType="slide" onRequestClose={() => setModalBiberonVisible(false)}>
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <Text style={styles.subtitulo}>¿Cuántos ml se le dio?</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese la cantidad en ml"
              value={mlBiberon}
              onChangeText={setMlBiberon}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.botonGuardar} onPress={confirmarBiberon}>
              <Text style={styles.textoBoton}>Registrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.botonGuardar, { backgroundColor: 'gray', marginTop: 10 }]} onPress={() => setModalBiberonVisible(false)}>
              <Text style={styles.textoBoton}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

// Estilos (igual que antes)
const styles = StyleSheet.create({
  fondo: { flex: 1 },
  contenedorPrincipal: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.9)' },
  barraIzquierda: {
    width: 160,
    backgroundColor: '#F2F6FC',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  columnas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  columna: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  botonActividadColumna: {
    width: '100%',
    marginVertical: 10,
    alignItems: 'center',
  },
  etiquetaIcono: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  iconoContainer: {
    backgroundColor: '#007BFF',
    borderRadius: 25,
    padding: 10,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnaRegistros: { flex: 1, paddingHorizontal: 15, paddingVertical: 10 },
  scroll: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      maxHeight: '80%',
      overflowY: 'scroll',
    }),
  },
  registroItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  registroCabecera: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  textoRegistro: { fontSize: 14 },
  textoComentario: { fontStyle: 'italic', color: '#555', marginTop: 4 },
  seccionTitulo: { fontSize: 17, fontWeight: 'bold', marginVertical: 10, backgroundColor: '#e8f0fe', padding: 6, borderRadius: 6 },
  cronometro: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#007BFF' },
  modalFondo: { flex: 1, backgroundColor: '#000000aa', justifyContent: 'center', paddingHorizontal: 20 },
  modalContenido: { backgroundColor: 'white', padding: 20, borderRadius: 10 },
  subtitulo: { fontSize: 18, marginBottom: 15, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16, minHeight: 60, textAlignVertical: 'top' },
  botonGuardar: { backgroundColor: '#007BFF', marginTop: 15, borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  textoBoton: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default PantallaActividades;