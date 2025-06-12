import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import Menu from '../components/Menu';
import AñadirEspacioModal from '../components/AñadirEspacio';

const MisPlantasScreen = () => {
  const [espacios, setEspacios] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleGuardarEspacio = (nuevo) => {
    if (espacios.length >= 20) return;
    setEspacios([...espacios, nuevo]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.espacioCard}>
      <Ionicons name="leaf" size={20} color="#4CAF50" />
      <Text style={styles.espacioTexto}>{item.tipo} - {item.sububicacion} ({item.luz})</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Mis Plantas" />

      <View style={styles.content}>
        {espacios.length === 0 ? (
          <View style={styles.vacioContainer}>
            <Image
              source={require('../../assets/vacio.png')}
              style={styles.vacioIcono}
              resizeMode="contain"
            />
            <Text style={styles.vacioTexto}>No has añadido ningún espacio todavía.</Text>
          </View>
        ) : (
          <FlatList
            data={espacios}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.lista}
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.botonFlotante}
        onPress={() => setMostrarModal(true)}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {mostrarModal && (
        <AñadirEspacioModal
          onClose={() => setMostrarModal(false)}
          onSave={handleGuardarEspacio}
        />
      )}

      <Menu />
    </View>
  );
};

export default MisPlantasScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FFF5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  vacioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  vacioIcono: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  vacioTexto: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
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
  },
  espacioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
  espacioTexto: {
    marginLeft: 10,
    fontSize: 16,
  },
});
