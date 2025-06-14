import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
  Modal,
  Alert,
} from 'react-native';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { Ionicons } from '@expo/vector-icons';

const obtenerFechaActual = () => {
  const fecha = new Date();
  return `${fecha.toLocaleDateString()} a las ${fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

const riegosIniciales = [
  {
    id: '1',
    ambiente: 'Jard├¡n',
    plantas: 3,
    imagen: require('../../assets/images/foto.png'),
    estado: 'inactivo',
    ultimoRiego: null,
  },
  {
    id: '2',
    ambiente: 'Huerto',
    plantas: 2,
    imagen: require('../../assets/images/foto.png'),
    estado: 'completado',
    ultimoRiego: '31/12/2024 a las 00:00',
  },
];

const RiegoScreen = () => {
  const [riegosManuales, setRiegosManuales] = useState(riegosIniciales);
  const [estadoAuto, setEstadoAuto] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [riegoSeleccionado, setRiegoSeleccionado] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState(false);
  const [modalPlantasVisible, setModalPlantasVisible] = useState(false);

  const toggleSwitch = (item) => {
    setRiegoSeleccionado(item);
    setNuevoEstado(!estadoAuto[item.id]);
    setModalVisible(true);
  };

  const confirmarCambio = () => {
    setEstadoAuto((prev) => ({ ...prev, [riegoSeleccionado.id]: nuevoEstado }));
    setModalVisible(false);

    // Simula lectura de humedad
    const humedad = Math.floor(Math.random() * 100);
    if (nuevoEstado && humedad < 30) {
      iniciarRiegoAutomatico(riegoSeleccionado.id);
    }
  };

  const iniciarRiegoAutomatico = (id) => {
    setRiegosManuales((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, estado: 'regando' } : r
      )
    );
    setTimeout(() => {
      setRiegosManuales((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, estado: 'completado', ultimoRiego: obtenerFechaActual() } : r
        )
      );
    }, 3000);
  };

  const iniciarRiegoManualAmbiente = (id) => {
    setRiegosManuales((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, estado: 'regando' } : r
      )
    );
    setTimeout(() => {
      setRiegosManuales((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, estado: 'completado', ultimoRiego: obtenerFechaActual() } : r
        )
      );
    }, 3000);
  };

  const detenerRiego = (id) => {
    setRiegosManuales((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, estado: 'completado', ultimoRiego: obtenerFechaActual() } : r
      )
    );
  };

  const abrirModalPlantas = () => setModalPlantasVisible(true);
  const cerrarModalPlantas = () => setModalPlantasVisible(false);

  const renderRiegoManual = ({ item }) => (
    <View key={item.id} style={styles.card}>
      <Image source={item.imagen} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.ambiente}>{item.ambiente}</Text>
        <Text style={styles.subtexto}>{item.plantas} Planta{item.plantas > 1 ? 's' : ''}</Text>

        {item.estado === 'inactivo' && (
          <>
            <TouchableOpacity
              style={styles.botonCeleste}
              onPress={() => iniciarRiegoManualAmbiente(item.id)}
            >
              <Ionicons name="water" size={16} color="white" style={styles.icono} />
              <Text style={styles.botonTexto}>Regar todo el ambiente</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.botonTransparente}
              onPress={abrirModalPlantas}
            >
              <Ionicons name="leaf-outline" size={16} color="#00BFA6" style={styles.icono} />
              <Text style={styles.botonTextoCeleste}>Seleccionar planta</Text>
            </TouchableOpacity>
          </>
        )}

        {item.estado === 'regando' && (
          <>
            <Text style={styles.subtexto}>­ƒÆº Riego en curso...</Text>
            <TouchableOpacity
              style={styles.botonCeleste}
              onPress={() => detenerRiego(item.id)}
            >
              <Text style={styles.botonTexto}>Detener riego</Text>
            </TouchableOpacity>
          </>
        )}

        {item.estado === 'completado' && (
          <>
            <Text style={styles.subtexto}>├Ültimo riego: {item.ultimoRiego}</Text>
            <TouchableOpacity
              style={styles.botonCeleste}
              onPress={() => iniciarRiegoManualAmbiente(item.id)}
            >
              <Ionicons name="refresh" size={16} color="white" style={styles.icono} />
              <Text style={styles.botonTexto}>Repetir riego</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Control de Riego" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
        <Text style={styles.sectionTitle}>Riego Manual</Text>
        {riegosManuales.map((item) => renderRiegoManual({ item }))}

        <Text style={styles.sectionTitle}>Riego autom├ítico</Text>
        {riegosManuales.map((item) => (
          <View key={`auto-${item.id}`} style={styles.card}>
            <Image source={item.imagen} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.ambiente}>{item.ambiente}</Text>
              <Text style={styles.subtexto}>{item.plantas} Planta</Text>
              <Text style={styles.subtexto}>
                ├Ültimo riego: {item.ultimoRiego || 'N/A'}
              </Text>
            </View>
            <Switch
              value={estadoAuto[item.id] || false}
              onValueChange={() => toggleSwitch(item)}
              thumbColor={estadoAuto[item.id] ? '#00BFA6' : '#ccc'}
              trackColor={{ false: '#ccc', true: '#b2dfdb' }}
            />
          </View>
        ))}
      </ScrollView>

      {/* Modal Cambio Riego */}
      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={20} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{riegoSeleccionado?.ambiente}</Text>
            <Text style={styles.modalText}>{riegoSeleccionado?.plantas} Planta</Text>
            <Text style={styles.modalSubText}>
              {nuevoEstado ? 'Riego Autom├ítico' : 'Riego Manual'}
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={confirmarCambio}
            >
              <Text style={styles.modalButtonText}>
                Cambiar a {nuevoEstado ? 'Riego Autom├ítico' : 'Riego Manual'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Selecci├│n de Planta */}
      <Modal transparent visible={modalPlantasVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={cerrarModalPlantas}
            >
              <Ionicons name="close" size={20} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Selecciona una planta</Text>
            <Text style={styles.modalSubText}>ÔÜÖ´©Å Funcionalidad simulada</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                cerrarModalPlantas();
                Alert.alert('Simulaci├│n', 'Regando planta seleccionada...');
              }}
            >
              <Text style={styles.modalButtonText}>Regar planta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Menu />
    </View>
  );
};

export default RiegoScreen;


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#004D40',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    borderWidth: 1,
    borderColor: '#eee',
  },
  image: { width: 50, height: 50, marginRight: 12 },
  infoContainer: { flex: 1 },
  ambiente: { fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  subtexto: { fontSize: 12, color: '#555' },
  botonCeleste: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#80DEEA',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  botonTexto: { color: '#fff', fontWeight: 'bold' },
  botonTransparente: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00BFA6',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  botonTextoCeleste: { color: '#00BFA6', fontWeight: 'bold' },
  icono: { marginRight: 6 },

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    marginBottom: 10,
  },
  modalClose: { position: 'absolute', top: 10, right: 10 },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004D40',
  },
  modalText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  modalSubText: {
    fontSize: 14,
    color: '#aaa',
    marginVertical: 10,
  },
  modalButton: {
    backgroundColor: '#00C853',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  plantaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    width: '100%',
  },
});

