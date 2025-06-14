import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { db } from '../../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';

const AñadirEspacioModal = ({ onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [tipo, setTipo] = useState('');
  const [sububicacion, setSububicacion] = useState('');
  const [luz, setLuz] = useState('');

  const tipos = ['Interior', 'Exterior'];
  const sububicaciones = {
    Interior: ['Sala', 'Dormitorio', 'Cocina', 'Oficina', 'Baño', 'Pasillo'],
    Exterior: ['Patio trasero', 'Jardín', 'Huerto', 'Balcón', 'Terraza'],
  };
  const tiposDeLuz = ['Soleado', 'Sol parcial', 'Sombra', 'Oscuro'];

  const handleNext = async () => {
    if (step === 1 && tipo) setStep(2);
    else if (step === 2 && sububicacion) setStep(3);
    else if (step === 3 && luz) {
      const nuevoEspacio = { tipo, sububicacion, luz };
      const docRef = await addDoc(collection(db, 'ambientes'), nuevoEspacio);
      onSave({ ...nuevoEspacio, id: docRef.id }); // Asegúrate de pasar el ID
      onClose(); // Cierra el modal automáticamente
    }
  };


  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onClose();
  };
  const iconos = {
    interior: require('../../assets/ambiente/interior.png'),
    exterior: require('../../assets/ambiente/exterior.png'),
    sala: require('../../assets/ambiente/sala.png'),
    dormitorio: require('../../assets/ambiente/dormitorio.png'),
    cocina: require('../../assets/ambiente/cocina.png'),
    oficina: require('../../assets/ambiente/oficina.png'),
    baño: require('../../assets/ambiente/baño.png'),
    pasillo: require('../../assets/ambiente/pasillo.png'),
    patiotrasero: require('../../assets/ambiente/patiotrasero.png'),
    jardin: require('../../assets/ambiente/jardin.png'),
    huerto: require('../../assets/ambiente/huerto.png'),
    balcon: require('../../assets/ambiente/balcon.png'),
    terraza: require('../../assets/ambiente/terraza.png'),
    soleado: require('../../assets/ambiente/soleado.png'),
    solparcial: require('../../assets/ambiente/solparcial.png'),
    sombra: require('../../assets/ambiente/sombra.png'),
    oscuro: require('../../assets/ambiente/oscuro.png'),
  };
  

  const renderOptions = (items, selectedItem, onSelect, carpeta) => (
    <ScrollView style={styles.scroll}>
      <View style={styles.options}>
        {items.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.option, selectedItem === item && styles.selected]}
            onPress={() => onSelect(item)}
          >
          <Image
            source={iconos[item.toLowerCase().replace(/\s/g, '')]}
            style={styles.icon}
          />
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const getProgressWidth = () => `${(step / 3) * 100}%`;

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Añadir Nuevo Espacio</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} />
          </TouchableOpacity>
        </View>

        {/* Barra de progreso */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: getProgressWidth() }]} />
        </View>

        {/* Contenido por paso */}
        {step === 1 && (
          <>
            <Text style={styles.subtitle}>¿Dónde estará ubicado?</Text>
            {renderOptions(tipos, tipo, setTipo)}
          </>
        )}
        {step === 2 && (
          <>
            <Text style={styles.subtitle}>¿En qué parte específica?</Text>
            {renderOptions(sububicaciones[tipo] || [], sububicacion, setSububicacion)}
          </>
        )}
        {step === 3 && (
          <>
            <Text style={styles.subtitle}>¿Qué tipo de luz recibe?</Text>
            {renderOptions(tiposDeLuz, luz, setLuz)}
          </>
        )}

        {/* Botones inferiores */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleBack} style={styles.footerBtn}>
            <Text style={styles.footerText}>Volver</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            style={[
              styles.footerBtn,
              { backgroundColor: step === 3 && luz ? '#4CAF50' : step === 2 && sububicacion ? '#4CAF50' : step === 1 && tipo ? '#4CAF50' : '#ccc' },
            ]}
            disabled={
              (step === 1 && !tipo) ||
              (step === 2 && !sububicacion) ||
              (step === 3 && !luz)
            }
          >
            <Text style={{ color: '#fff' }}>{step === 3 ? 'Guardar' : 'Siguiente'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AñadirEspacioModal;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modal: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginVertical: 12,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 12,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  option: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    margin: 8,
    width: 100,
  },
  selected: {
    backgroundColor: '#A5D6A7',
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 6,
  },
  optionText: {
    fontSize: 13,
    textAlign: 'center',
  },
  scroll: {
    maxHeight: 250,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  footerBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  footerText: {
    fontSize: 14,
  },
});
