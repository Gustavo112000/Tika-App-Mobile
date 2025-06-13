import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const CARD_WIDTH = Dimensions.get('window').width / 2 - 30;

export default function PlantCard({ name, image }) {
  return (
    <View style={styles.card}>
      <Image
        source={image || require('../assets/plant-default.png')}
        style={styles.image}
      />
      <Text style={styles.name}>{name}</Text>
      <View style={styles.iconsRow}>
        <Feather name="droplet" size={20} style={styles.icon} />
        <MaterialCommunityIcons name="white-balance-sunny" size={20} style={styles.icon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  iconsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  icon: {
    borderWidth: 2,
    borderColor: '#14AE5C',
    borderRadius: 6,
    padding: 4,
    color: '#14AE5C',
  },
});
