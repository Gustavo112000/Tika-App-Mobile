import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot } from 'firebase/firestore';

import { db } from '../firebase/firebase';
import AddPlantCard from '../components/add-plant-card';
import PlantCard from '../components/plant-card';
import Header from '../src/components/Header';
import Menu from '../src/components/Menu';

const Garden = () => {
  const navigation = useNavigation();
  const [plantas, setPlantas] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'plantas'), (snapshot) => {
      const datos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlantas(datos);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Mi jardín" />

      <FlatList
        data={plantas}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <AddPlantCard onPress={() => navigation.navigate('plants')} />
        }
        renderItem={({ item }) => (
          <PlantCard planta={item} />
        )}
        contentContainerStyle={styles.lista}
      />

      <Menu />
    </View>
  );
};

export default Garden;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 120, // espacio para que el menú no tape las tarjetas
  },
});
