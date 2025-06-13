import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import PlantCard from '../components/plant-card';
import AddPlantCard from '../components/add-plant-card';

const dummyPlants = [
  { id: '1', name: 'Cactus' },
  { id: '2', name: 'Orquídea' },
  { id: '3', name: 'Lavanda' },
];

export default function GardenScreen({ navigation }) {
  const renderItem = ({ item }) => {
    if (item.type === 'add') {
      return <AddPlantCard />;
    }
    return <PlantCard name={item.name} />;
  };

  const dataWithAdd = [{ id: 'add', type: 'add' }, ...dummyPlants];

  return (
    <View style={styles.container}>
      <FlatList
        data={dataWithAdd}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 10,
  },
});
