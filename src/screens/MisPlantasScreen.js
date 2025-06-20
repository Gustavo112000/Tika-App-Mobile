// ...importaciones (igual que antes)
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import Header from '../components/Header';
import Menu from '../components/Menu';
import AñadirEspacio from '../components/AñadirEspacio';
import EditarEspacio from '../components/EditarEspacio';
import { useNavigation } from '@react-navigation/native';

const MisPlantasScreen = () => {
  const [espacios, setEspacios] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalAccionesVisible, setModalAccionesVisible] = useState(false);
  const [espacioSeleccionado, setEspacioSeleccionado] = useState(null);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [cantidadPlantas, setCantidadPlantas] = useState({});



  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'ambientes'), snapshot => {
      const datos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEspacios(datos);
    });
    return unsubscribe;
  }, []);

  const eliminarEspacio = async (id) => {
    console.log('Intentando eliminar ambiente con ID:', id); // 🔍 VERIFICA SI EXISTE
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que deseas eliminar este ambiente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'ambientes', id));
              setModalAccionesVisible(false);
              console.log('Ambiente eliminado correctamente');
            } catch (error) {
              console.error('Error al eliminar:', error); // 🔍 MUESTRA ERRORES EXACTOS
            }
          },
        },
      ]
    );
  };
  

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onLongPress={() => {
        setEspacioSeleccionado(item);
        setModalAccionesVisible(true);
      }}
      style={styles.cardHorizontal}
      delayLongPress={500}
    >
      <Image
        source={require('../../assets/plant-default.png')}
        style={styles.cardImage}
      />
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.tipo}</Text>
        <Text style={styles.cardSub}>{item.sububicacion} • {item.luz}</Text>
        <Text style={styles.cardSub}>
          {cantidadPlantas[espacioSeleccionado?.id] || 0} Plantas
        </Text>

        <TouchableOpacity
          style={styles.btnAgregarPlanta}
          onPress={() => navigation.navigate('garden')}
        >
          <Ionicons name="leaf-outline" size={16} color="#fff" />
          <Text style={styles.textoAgregar}>Añadir planta</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Header title="Mis Ambientes" />
      <Text style={styles.title}>Mis Ambientes</Text>

      <FlatList
        data={espacios}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={espacios.length === 0 ? styles.vacioLista : styles.lista}
        ListEmptyComponent={
          <View style={styles.content}>
            <Image source={require('../../assets/images/vacio.png')} style={styles.image} />
            <Text style={styles.subtitle}>Aún no has agregado ningún espacio</Text>
            <TouchableOpacity style={styles.button} onPress={() => setMostrarModal(true)}>
              <Text style={styles.buttonText}>Añadir Espacio</Text>
            </TouchableOpacity>
            <Text style={styles.note}>
              Empieza a cuidar tu jardín agregando tus plantas favoritas
              para monitorear su riego y salud.
            </Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.botonFlotante} onPress={() => setMostrarModal(true)}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {mostrarModal && (
          <AñadirEspacio
            onClose={() => setMostrarModal(false)}
            onSave={() => {
              // Solo cerrar el modal, ya que el nuevo espacio ya se guardó
              setMostrarModal(false);
            }}
          />
        )}


      {mostrarModalEditar && espacioSeleccionado && (
        <EditarEspacio
          espacio={espacioSeleccionado}
          onClose={() => setMostrarModalEditar(false)}
        />
      )}

      <Modal
        visible={modalAccionesVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalAccionesVisible(false)}
      >
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>{espacioSeleccionado?.tipo}</Text>
            <Text style={styles.cardSub}>
              {cantidadPlantas[espacioSeleccionado?.id] || 0} Plantas
            </Text>

            <TouchableOpacity style={styles.btnModalEditar} onPress={() => {
              setModalAccionesVisible(false);
              setMostrarModalEditar(true);
            }}>
              <Ionicons name="create-outline" size={18} color="#fff" />
              <Text style={styles.textoModal}>Editar espacio</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnModalEliminar}
              onPress={() => eliminarEspacio(espacioSeleccionado.id)}
            >
              <Ionicons name="trash-outline" size={18} color="#fff" />
              <Text style={styles.textoModal}>Eliminar espacio</Text>
            </TouchableOpacity>

            <Pressable onPress={() => setModalAccionesVisible(false)}>
              <Text style={{ marginTop: 10, color: '#888' }}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Menu />
    </View>
  );
};

export default MisPlantasScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 20,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 16,
    textAlign: 'center',
  },
  note: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  lista: {
    paddingBottom: 120,
    paddingHorizontal: 20,
  },
  vacioLista: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 120,
  },

  // 🌿 Tarjeta horizontal
  cardHorizontal: {
    flexDirection: 'row',
    backgroundColor: '#f0fdf4',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSub: {
    fontSize: 14,
    color: '#777',
    marginVertical: 4,
  },
  btnAgregarPlanta: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  textoAgregar: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 13,
  },

  // 🔘 Botón flotante
  botonFlotante: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },

  // 📦 Modal inferior
  modalFondo: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'flex-end',
  },
  modalContenido: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
    alignItems: 'center',
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalSubtitulo: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  btnModalEditar: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  btnModalEliminar: {
    flexDirection: 'row',
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoModal: {
    color: '#fff',
    marginLeft: 10,
  },
});
