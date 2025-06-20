import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { getID } from '../../pseudobackend/auth/getIDauth';
import { obtenerPlantasDeAmbiente } from '../../pseudobackend/auth/getPlantas';

const HumedadScreen = () => {
  const [ambientes, setAmbientes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [plantas, setPlantas] = useState([]);
  const [ambienteActual, setAmbienteActual] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      cargarAmbientes();
    }, 2000);

    // Cargar inicialmente
    cargarAmbientes();

    return () => clearInterval(interval);
  }, []);

  const cargarAmbientes = async () => {
    try {
      const idUsuario = await getID();
      const ambientesRef = collection(db, `usuarios/${idUsuario}/ambientes`);
      const ambientesSnap = await getDocs(ambientesRef);

      const datos = [];

      for (const docAmbiente of ambientesSnap.docs) {
        const ambienteId = docAmbiente.id;
        const plantas = await obtenerPlantasDeAmbiente(ambienteId);

        const humedad = plantas.length > 0 ? plantas[0].humedad_actual || 0 : 0;

        datos.push({
          id: ambienteId,
          nombre: ambienteId,
          plantas: plantas.length,
          humedad,
          plantasDetalle: plantas,
        });
      }

      setAmbientes(datos);
    } catch (error) {
      console.error('Error cargando ambientes:', error.message);
    }
  };

  const obtenerEtiqueta = (humedad) => {
    if (humedad >= 70) return 'Óptimo';
    if (humedad >= 30) return 'Medio';
    return 'Bajo';
  };

  const obtenerIcono = (humedad) => {
    if (humedad >= 70) return require('../../assets/icons/verde.png');
    if (humedad >= 30) return require('../../assets/icons/amarillo.png');
    return require('../../assets/icons/rojo.png');
  };

  const abrirModal = (ambiente) => {
    setAmbienteActual(ambiente);
    setPlantas(ambiente.plantasDetalle);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Header title="Estado de Humedad del Suelo" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
        <Text style={styles.titulo}>Estado de Humedad del Suelo</Text>

        {ambientes.map((amb) => (
          <TouchableOpacity key={amb.id} style={styles.card} onPress={() => abrirModal(amb)}>
            <Image source={require('../../assets/images/foto.png')} style={styles.imagen} />
            <View style={styles.textos}>
              <Text style={styles.nombre}>{amb.nombre}</Text>
              <Text style={styles.subtexto}>Humedad: {amb.humedad}%</Text>
              <Text style={styles.subtexto}>{obtenerEtiqueta(amb.humedad)}</Text>
            </View>
            <Image source={obtenerIcono(amb.humedad)} style={{ width: 30, height: 30 }} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.close} onPress={() => setModalVisible(false)}>
              <Text style={{ fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.titulo}>{ambienteActual?.nombre}</Text>
            <Text style={styles.subtexto}>{ambienteActual?.plantas} Planta(s)</Text>

            <ScrollView contentContainerStyle={styles.plantaGrid}>
              {plantas.map((planta, index) => (
                <View key={index} style={styles.plantaCard}>
                  <Image
                    source={{ uri: planta.foto_url || 'https://via.placeholder.com/100' }}
                    style={styles.plantaImagen}
                  />
                  <Text style={styles.plantaNombre}>{planta.nombre}</Text>
                  <Text style={styles.plantaSub}>{planta.nombre_cientifico}</Text>
                  <Image source={obtenerIcono(planta.humedad_actual)} style={{ width: 20, height: 20, marginTop: 4 }} />
                  <Text style={styles.plantaHumedad}>
                    Humedad: {planta.humedad_actual}%{"\n"}
                    {obtenerEtiqueta(planta.humedad_actual)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Menu />
    </View>
  );
};

export default HumedadScreen;


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004D40',
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderColor: '#eee',
    borderWidth: 1,
    alignItems: 'center',
  },
  imagen: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  textos: {
    flex: 1,
  },
  nombre: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  subtexto: {
    fontSize: 12,
    color: '#555',
  },
  icono: {
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  close: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 1,
  },
  plantaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  plantaCard: {
    width: 160,
    margin: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  plantaImagen: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
  },
  plantaNombre: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  plantaSub: {
    fontSize: 12,
    color: '#777',
  },
  plantaHumedad: {
    fontSize: 12,
    marginTop: 4,
    color: '#333',
    textAlign: 'center',
  },
});
