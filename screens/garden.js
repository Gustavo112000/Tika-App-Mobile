import React from 'react';
import { View, StyleSheet } from 'react-native';
import AddPlantCard from '../components/add-plant-card';
import { useNavigation } from '@react-navigation/native';
import Header from '../src/components/Header';
import Menu from '../src/components/Menu';


export default function Garden() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Header title="Mis Plantas" />
      <AddPlantCard onPress={() => navigation.navigate('AllPlants')} />
      {/* Aquí puedes seguir renderizando PlantCards o lo que tengas */}
      <Menu />
    </View>
  );
}

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
});
