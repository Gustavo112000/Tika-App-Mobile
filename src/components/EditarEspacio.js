import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const EditarEspacio = ({ espacio, onClose }) => {
  const [tipo, setTipo] = useState(espacio.tipo);
  const [sububicacion, setSububicacion] = useState(espacio.sububicacion);
  const [luz, setLuz] = useState(espacio.luz);
  const [step, setStep] = useState(1);

  const tipos = ['Interior', 'Exterior'];
  const sububicaciones = {
    Interior: ['Sala', 'Dormitorio', 'Cocina', 'Oficina', 'Baño', 'Pasillo'],
    Exterior: ['Patio trasero', 'Jardín', 'Huerto', 'Balcón', 'Terraza'],
  };
  const tiposDeLuz = ['Soleado', 'Sol parcial', 'Sombra', 'Oscuro'];

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

  const renderOptions = (items, selectedItem, onSelect) => (
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

  const handleNext = async () => {
    if (step === 1 && tipo) setStep(2);
    else if (step === 2 && sububicacion) setStep(3);
    else if (step === 3 && luz) {
      try {
        await updateDoc(doc(db, 'ambientes', espacio.id), {
          tipo,
          sububicacion,
          luz,
        });
        onClose(); // Cerrar después de guardar
      } catch (error) {
        console.error('Error al actualizar el espacio:', error);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onClose();
  };

  const getProgressWidth = () => `${(step / 3) * 100}%`;

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>Editar Espacio</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: getProgressWidth() }]} />
        </View>

        {step === 1 && (
          <>
            <Text style={styles.subtitle}>Tipo de espacio</Text>
            {renderOptions(tipos, tipo, setTipo)}
          </>
        )}
        {step === 2 && (
          <>
            <Text style={styles.subtitle}>Sububicación</Text>
            {renderOptions(sububicaciones[tipo] || [], sububicacion, setSububicacion)}
          </>
        )}
        {step === 3 && (
          <>
            <Text style={styles.subtitle}>Tipo de luz</Text>
            {renderOptions(tiposDeLuz, luz, setLuz)}
          </>
        )}

        <View style={styles.footer}>
          <TouchableOpacity onPress={handleBack} style={styles.footerBtn}>
            <Text style={styles.footerText}>Volver</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            style={[
              styles.footerBtn,
              { backgroundColor: '#4CAF50' },
            ]}
          >
            <Text style={{ color: '#fff' }}>
              {step === 3 ? 'Guardar cambios' : 'Siguiente'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EditarEspacio;

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
