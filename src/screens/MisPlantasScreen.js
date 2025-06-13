import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Header from '../components/Header';
import Menu from '../components/Menu';
import AñadirEspacioModal from '../components/AñadirEspacio';

const MisPlantasScreen = () => {
  const [espacios, setEspacios] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const cargarEspacios = async () => {
      const snapshot = await getDocs(collection(db, 'ambientes'));
      const datos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEspacios(datos);
    };
    cargarEspacios();
  }, []);

  const handleGuardarEspacio = (nuevo) => {
    setEspacios(prev => [...prev, nuevo]);
    setMostrarModal(false);
  };

    const eliminarEspacio = async (id) => {
      Alert.alert(
        'Confirmación',
        '¿Estás segura de que deseas eliminar este ambiente?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: async () => {
              await deleteDoc(doc(db, 'ambientes', id));
              setEspacios(prev => prev.filter(e => e.id !== id));
            },
          },
        ]
      );
    };
  const renderItem = ({ item }) => (
    <View style={styles.espacioCard}>
      <View style={styles.espacioInfo}>
        <Ionicons name="leaf" size={24} color="#4CAF50" />
        <Text style={styles.espacioTexto}>
          {item.tipo} - {item.sububicacion} ({item.luz})
        </Text>
      </View>

      <Text style={styles.noPlantas}>No hay plantas aún</Text>
      <TouchableOpacity style={styles.agregarBtn}>
        <Text style={styles.agregarText}>Agregar Planta</Text>
      </TouchableOpacity>

      <View style={styles.botones}>
        <TouchableOpacity style={styles.botonEditar}>
          <Text style={styles.botonTexto}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botonEliminar}
          onPress={() => eliminarEspacio(item.id)}
        >
          <Text style={styles.botonTexto}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );


  return (
    <View style={styles.container}>
      <Header title="Mis Ambientes" />

      <Text style={styles.title}>Mis Ambientes</Text>

      {espacios.length === 0 ? (
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
      ) : (
        <FlatList
          data={espacios}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
        />
      )}

      <TouchableOpacity style={styles.botonFlotante} onPress={() => setMostrarModal(true)}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {mostrarModal && (
        <AñadirEspacioModal
          onClose={() => setMostrarModal(false)}
          onSave={() => {}} // ya no hace falta añadir aquí, se actualizará automáticamente
        />
      )}

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
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 30,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 24,
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
  note: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
    marginTop: 10,
  },
  botonFlotante: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  lista: {
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
  },
  cardImage: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 8,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSub: {
    fontSize: 14,
    color: '#555',
  },
});
