import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const CARD_WIDTH = Dimensions.get('window').width / 2 - 30;

export default function AddPlantCard({ onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.plusCircle}>
        <AntDesign name="plus" size={32} color="#fff" />
      </View>
      <Text style={styles.text}>Añadir Planta</Text>
    </TouchableOpacity>
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
    justifyContent: 'center',
    elevation: 3,
  },
  plusCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#14AE5C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  text: {
    fontWeight: 'bold',
    color: '#14AE5C',
    textAlign: 'center',
  },
});
