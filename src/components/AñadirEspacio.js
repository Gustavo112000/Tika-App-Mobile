import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AñadirEspacioModal = ({ onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [tipo, setTipo] = useState('');
  const [sububicacion, setSububicacion] = useState('');
  const [luz, setLuz] = useState('');

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      const nuevoEspacio = { tipo, sububicacion, luz };
      onSave(nuevoEspacio);
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onClose();
  };

  const tipos = ['Interior', 'Exterior'];

  const sububicaciones = {
    Interior: ['Sala', 'Dormitorio', 'Cocina', 'Oficina', 'Baño', 'Pasillo'],
    Exterior: ['Patio trasero', 'Patio delantero', 'Jardín', 'Huerto', 'Balcón', 'Terraza'],
  };

  const tiposDeLuz = ['Soleado', 'Sol parcial', 'Sombra', 'Oscuro'];

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>Añadir Nuevo Espacio</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} />
          </TouchableOpacity>
        </View>

        {step === 1 && (
          <>
            <Text style={styles.subtitle}>Elegir tipo de espacio</Text>
            <View style={styles.options}>
              {tipos.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.option, tipo === t && styles.selected]}
                  onPress={() => setTipo(t)}
                >
                  <Text>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.subtitle}>Elegir sububicación</Text>
            <ScrollView style={styles.scroll}>
              <View style={styles.options}>
                {sububicaciones[tipo]?.map((sub) => (
                  <TouchableOpacity
                    key={sub}
                    style={[styles.option, sububicacion === sub && styles.selected]}
                    onPress={() => setSububicacion(sub)}
                  >
                    <Text>{sub}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.subtitle}>Elegir tipo de luz</Text>
            <View style={styles.options}>
              {tiposDeLuz.map((l) => (
                <TouchableOpacity
                  key={l}
                  style={[styles.option, luz === l && styles.selected]}
                  onPress={() => setLuz(l)}
                >
                  <Text>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <View style={styles.footer}>
          <TouchableOpacity onPress={handleBack} style={styles.footerBtn}>
            <Text>Volver</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            style={[styles.footerBtn, { backgroundColor: '#4CAF50' }]}
          >
            <Text style={{ color: '#fff' }}>{step < 3 ? 'Siguiente' : 'Guardar'}</Text>
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
    maxHeight: '80%',
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
  subtitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  option: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
    margin: 5,
  },
  selected: {
    backgroundColor: '#A5D6A7',
  },
  scroll: {
    maxHeight: 200,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  footerBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
});
