// components/plant-detail-form.js
import { NavigationContainer } from '@react-navigation/native'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';


export default function PlantDetailForm({ visible, onClose, plant, onSuccess }) {
  const [plantDate, setPlantDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [potType, setPotType] = useState('');
  const [soilType, setSoilType] = useState('');
  const [wateringFrequency, setWateringFrequency] = useState('');

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, 'ambientes'), {
        plantaId: plant.id,
        nombre: plant.nombre,
        resumenPlanta: plant.resumenPlanta || '',
        fechaPlantacion: plantDate,
        tipoMaceta: potType,
        tipoSuelo: soilType,
        frecuenciaRiego: wateringFrequency,
        fechaAgregado: new Date(),
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error al guardar la planta:', error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{plant?.nombre}</Text>

          <Text style={styles.label}>Fecha de plantación</Text>
          <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.input}>
            <Text>{plantDate.toDateString()}</Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={plantDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowPicker(Platform.OS === 'ios');
                if (date) setPlantDate(date);
              }}
            />
          )}

          <Text style={styles.label}>Tipo de maceta</Text>
          <TextInput style={styles.input} placeholder="Ej. Grande" value={potType} onChangeText={setPotType} />

          <Text style={styles.label}>Tipo de suelo</Text>
          <TextInput style={styles.input} placeholder="Ej. Tierra negra" value={soilType} onChangeText={setSoilType} />

          <Text style={styles.label}>Frecuencia de riego</Text>
          <TextInput style={styles.input} placeholder="Ej. Cada 3 días" value={wateringFrequency} onChangeText={setWateringFrequency} />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Añadir planta</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.cancel}>
            <Text>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 4,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#14AE5C',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancel: {
    alignItems: 'center',
    marginTop: 10,
  },
});
