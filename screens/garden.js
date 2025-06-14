import React from 'react';
import { View, StyleSheet } from 'react-native';
import AddPlantCard from '../components/add-plant-card';
import { useNavigation } from '@react-navigation/native';


export default function Garden() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <AddPlantCard onPress={() => navigation.navigate('AllPlants')} />
      {/* Aquí puedes seguir renderizando PlantCards o lo que tengas */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
