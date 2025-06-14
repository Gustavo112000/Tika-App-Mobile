import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, Alert } from 'react-native';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import PlantCard from '../components/plant-card';
import { useNavigation } from '@react-navigation/native';
export default function AllPlantsScreen() {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'planta'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlants(data);
      } catch (error) {
        console.error("Error al obtener las plantas:", error);
      }
    };

    fetchPlants();
  }, []);

  // Función para agregar planta al jardín
  const navigation = useNavigation();

  const addToGarden = async (plant) => {
    try {
      await addDoc(collection(db, 'ambiente'), {
        plantaId: plant.id,
        nombre: plant.nombre,
        resumenPlanta: plant.resumenPlanta || '',
        fechaAgregado: new Date(),
      });

      Alert.alert(
        '¡Éxito!',
        `${plant.nombre} ha sido añadida a tu jardín.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Garden'), // <- Aquí navegas a la pantalla del jardín
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error al agregar planta al jardín:', error);
      Alert.alert('Error', 'No se pudo agregar la planta a tu jardín.');
    }
  };

  



  return (
    <View style={styles.container}>
      {plants.length === 0 ? (
        <Text style={styles.emptyText}>No hay plantas registradas aún.</Text>
      ) : (
        <FlatList
          data={plants}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <PlantCard
              name={item.nombre}
              onEdit={() => console.log("Editar:", item.id)}
              onDelete={() => console.log("Eliminar:", item.id)}
              onPress={() => addToGarden(item)} // <-- Aquí la magia
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2', paddingTop: 20 },
  list: { paddingHorizontal: 10 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#999' },
});
