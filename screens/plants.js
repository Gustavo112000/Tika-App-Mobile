import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Alert,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  Platform
} from 'react-native';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import PlantCard from '../components/plant-card';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../src/components/Header';
import Menu from '../src/components/Menu';

export default function AllPlantsScreen() {
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const [nombrePersonalizado, setNombrePersonalizado] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [maceta, setMaceta] = useState('');
  const [suelo, setSuelo] = useState('');
  const [frecuencia, setFrecuencia] = useState('');
  const [mostrarFechaPicker, setMostrarFechaPicker] = useState(false);

  const navigation = useNavigation();

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

  const handleSelectPlant = (plant) => {
    setSelectedPlant(plant);
    setNombrePersonalizado(plant.nombre || '');
    setDescripcion('');
    setFecha(new Date());
    setMaceta('');
    setSuelo('');
    setFrecuencia('');
    setBottomSheetVisible(true);
  };

  const handleAddToGarden = async () => {
    try {
      await addDoc(collection(db, 'ambientes'), {
        plantaId: selectedPlant.id,
        nombre: nombrePersonalizado || selectedPlant.nombre,
        resumenPlanta: descripcion,
        fechaPlantacion: fecha,
        tipoMaceta: maceta,
        tipoSuelo: suelo,
        frecuenciaRiego: frecuencia,
        fechaAgregado: new Date(),
      });

      setBottomSheetVisible(false);
      setSelectedPlant(null);

      Alert.alert(
        '¡Éxito!',
        `${nombrePersonalizado || selectedPlant.nombre} ha sido añadida a tu jardín.`,
        [{ text: 'OK', onPress: () => navigation.navigate('Garden') }],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error al agregar planta al jardín:', error);
      Alert.alert('Error', 'No se pudo agregar la planta a tu jardín.');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Todas las Plantas" />

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
              onPress={() => handleSelectPlant(item)}
            />
          )}
        />
      )}

      {/* Modal tipo bottom sheet */}
      <Modal
        visible={bottomSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setBottomSheetVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={{ flex: 1 }} onPress={() => setBottomSheetVisible(false)} />
          <View style={styles.modalContent}>
            <Pressable style={styles.closeButton} onPress={() => setBottomSheetVisible(false)}>
              <AntDesign name="closecircle" size={24} color="gray" />
            </Pressable>

            <Text style={styles.title}>
              Personalizar {selectedPlant?.nombre}
            </Text>

            <TextInput
              placeholder="Nombre personalizado"
              value={nombrePersonalizado}
              onChangeText={setNombrePersonalizado}
              style={inputStyle}
            />

            <TextInput
              placeholder="Descripción"
              value={descripcion}
              onChangeText={setDescripcion}
              style={[inputStyle, { height: 80 }]}
              multiline
            />

            <TouchableOpacity onPress={() => setMostrarFechaPicker(true)} style={[inputStyle, { justifyContent: 'center' }]}>
              <Text>{fecha.toLocaleDateString()}</Text>
            </TouchableOpacity>

            {mostrarFechaPicker && (
              <DateTimePicker
                value={fecha}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || fecha;
                  setMostrarFechaPicker(false);
                  setFecha(currentDate);
                }}
              />
            )}

            <TextInput
              placeholder="Tipo de maceta"
              value={maceta}
              onChangeText={setMaceta}
              style={inputStyle}
            />
            <TextInput
              placeholder="Tipo de suelo"
              value={suelo}
              onChangeText={setSuelo}
              style={inputStyle}
            />
            <TextInput
              placeholder="Frecuencia de riego"
              value={frecuencia}
              onChangeText={setFrecuencia}
              style={inputStyle}
            />

            <TouchableOpacity style={styles.button} onPress={handleAddToGarden}>
              <Text style={styles.buttonText}>Añadir planta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.menuContainer}>
        <Menu />
      </View>
    </View>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: Platform.OS === 'ios' ? 14 : 10,
  marginBottom: 12,
  backgroundColor: '#f9f9f9',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    paddingTop: 10,
    paddingBottom: 80, // Espacio para el menú inferior
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#14AE5C',
    borderRadius: 30,
    paddingVertical: 14,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },

});
