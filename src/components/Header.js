import React from 'react';
import { View, TextInput, StyleSheet, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Para ícono de lupa
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Para ícono de clima

const Header = () => {
  return (
    <View style={styles.container}>
      {/* Parte superior: clima */}
      <View style={styles.weatherContainer}>
        <Text style={styles.tempText}>36 °C</Text>
        <Text style={styles.tempRange}>36 °C - 8 °C</Text>
        <MaterialCommunityIcons name="weather-partly-cloudy" size={28} color="#000" style={styles.weatherIcon} />
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Buscar..."
          placeholderTextColor="#888"
        />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D4F1F9',
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  weatherContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
  },
  tempText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 6,
  },
  tempRange: {
    fontSize: 14,
    color: '#555',
    marginRight: 6,
  },
  weatherIcon: {
    marginLeft: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 12,
    height: 40,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});
