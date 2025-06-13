import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Switch } from 'react-native';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { Ionicons } from '@expo/vector-icons';

const riegosManuales = [
  {
    id: '1',
    ambiente: 'Jardín',
    plantas: 1,
    imagen: require('../../assets/images/vacio.png'),
    estado: 'inactivo', // puede ser 'inactivo', 'regando', 'completado'
    ultimoRiego: null,
  },
  {
    id: '2',
    ambiente: 'Sala',
    plantas: 2,
    imagen: require('../../assets/images/vacio.png'),
    estado: 'regando',
    ultimoRiego: '31/12/2024 a las 00:00',
  },
];

const riegosAutomaticos = [
  {
    id: '3',
    ambiente: 'Terraza',
    plantas: 1,
    imagen: require('../../assets/images/vacio.png'),
    ultimoRiego: '31/12/2024 a las 00:00',
    enCurso: false,
  },
  {
    id: '4',
    ambiente: 'Balcón',
    plantas: 1,
    imagen: require('../../assets/images/vacio.png'),
    enCurso: true,
    proximoRiego: '31/12/2024 a las 23:00',
  },
];

const RiegoScreen = () => {
  const [estadoAuto, setEstadoAuto] = useState({});

  const toggleSwitch = (id) => {
    setEstadoAuto((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderRiegoManual = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.imagen} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.ambiente}>{item.ambiente}</Text>
        <Text style={styles.subtexto}>{item.plantas} Planta{item.plantas > 1 ? 's' : ''}</Text>

        {item.estado === 'inactivo' && (
          <>
            <TouchableOpacity style={styles.botonCeleste}>
              <Text style={styles.botonTexto}>Regar todo el ambiente</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonTransparente}>
              <Text style={styles.botonTextoCeleste}>Seleccionar planta</Text>
            </TouchableOpacity>
          </>
        )}

        {item.estado === 'regando' && (
          <>
            <Text style={styles.subtexto}>Riego en curso...</Text>
            <TouchableOpacity style={styles.botonCeleste}>
              <Text style={styles.botonTexto}>Detener riego</Text>
            </TouchableOpacity>
          </>
        )}

        {item.estado === 'completado' && (
          <>
            <Text style={styles.subtexto}>Último riego: {item.ultimoRiego}</Text>
            <TouchableOpacity style={styles.botonCeleste}>
              <Text style={styles.botonTexto}>Repetir riego</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  const renderRiegoAutomatico = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.imagen} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.ambiente}>{item.ambiente}</Text>
        <Text style={styles.subtexto}>{item.plantas} Planta</Text>
        <Text style={styles.subtexto}>
          Último riego: {item.ultimoRiego || 'N/A'}
        </Text>
        <Switch
          value={estadoAuto[item.id] || false}
          onValueChange={() => toggleSwitch(item.id)}
          thumbColor={estadoAuto[item.id] ? '#00BFA6' : '#ccc'}
          trackColor={{ false: '#ccc', true: '#b2dfdb' }}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Control de Riego" />
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={styles.sectionTitle}>Riego Manual</Text>
        <FlatList
          data={riegosManuales}
          keyExtractor={(item) => item.id}
          renderItem={renderRiegoManual}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
        <Text style={styles.sectionTitle}>Riego automático</Text>
        <FlatList
          data={riegosAutomaticos}
          keyExtractor={(item) => item.id}
          renderItem={renderRiegoAutomatico}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
      <Menu />
    </View>
  );
};

export default RiegoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#00796B',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  image: {
    width: 64,
    height: 64,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  ambiente: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtexto: {
    color: '#555',
    marginBottom: 4,
  },
  botonCeleste: {
    backgroundColor: '#80DEEA',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 6,
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  botonTransparente: {
    borderWidth: 1,
    borderColor: '#80DEEA',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 6,
  },
  botonTextoCeleste: {
    color: '#00BFA6',
    textAlign: 'center',
  },
});
