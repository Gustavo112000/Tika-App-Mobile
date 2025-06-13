// screens/DescripcionPlantaScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

export default function DescripcionPlantaScreen({ route, navigation }) {
  const { planta } = route.params || {
    planta: {
      nombre: 'Ficus',
      nombreCientifico: 'Ficus benjamina',
      tipo: 'Interior',
      cuidado: 'Moderado',
      agua: '2 veces/semana',
      sol: 'Luz indirecta',
      descripcion: 'Planta decorativa ideal para interiores.',
      fecha: '01/01/2024',
      maceta: 'Mediana',
      suelo: 'Tierra fértil',
      frecuencia: 'Cada 3 días',
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={require('../assets/plant-default.png')} style={styles.image} />
      <Text style={styles.title}>{planta.nombre} ({planta.nombreCientifico})</Text>

      <View style={styles.infoBox}>
        <Text>🌿 Tipo: {planta.tipo}</Text>
        <Text>💧 Agua: {planta.agua}</Text>
        <Text>☀️ Sol: {planta.sol}</Text>
        <Text>🛡️ Cuidado: {planta.cuidado}</Text>
      </View>

      <Text style={styles.subtitle}>Descripción</Text>
      <Text>{planta.descripcion}</Text>

      <Text style={styles.subtitle}>Detalles</Text>
      <Text>📅 Plantación: {planta.fecha}</Text>
      <Text>🪴 Maceta: {planta.maceta}</Text>
      <Text>🌱 Suelo: {planta.suelo}</Text>
      <Text>📆 Frecuencia: {planta.frecuencia}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  image: { width: '100%', height: 200, borderRadius: 10 },
  title: { fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  subtitle: { marginTop: 16, fontWeight: 'bold' },
  infoBox: { marginTop: 10, marginBottom: 10 },
});