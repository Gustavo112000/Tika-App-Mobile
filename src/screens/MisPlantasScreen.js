import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import Menu from '../components/Menu';

const MisPlantasScreen = () => {
  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Mis Plantas</Text>
      <View style={styles.content}>

        <Image
          source={require('../../assets/images/empty-plant.png')}
          style={styles.image}
        />
        <Text style={styles.subtitle}>Aún no has agregado ninguna planta</Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Añadir Espacio</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Empieza a cuidar tu jardín agregando tus plantas favoritas
          para monitorear su riego y salud.
        </Text>
      </View>

      <Menu />
    </View>
  );
};

export default MisPlantasScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 30,
  },
  title: {
    textAlign: 'left',
    marginTop: 20,
    marginStart: 20,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
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
});
