import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Modal, Dimensions } from 'react-native';
import { MaterialCommunityIcons, Feather, Entypo, FontAwesome } from '@expo/vector-icons';

const CARD_WIDTH = Dimensions.get('window').width / 2 - 30;

export default function PlantCard({ name, onEdit, onDelete, onPress }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Pressable
        style={styles.card}
         onPress={onPress}
        onLongPress={() => setModalVisible(true)}
        
      >
        <Image
          source={require('../assets/plant-default.png')}
          style={styles.image}
        />
        <Text style={styles.name}>{name}</Text>
        <View style={styles.iconsRow}>
          <Feather name="droplet" size={20} style={styles.icon} />
          <MaterialCommunityIcons name="white-balance-sunny" size={20} style={styles.icon} />
        </View>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackground} onPress={() => setModalVisible(false)} />
          <View style={styles.bottomSheet}>
            <View style={styles.dragBar} />
            <Pressable style={styles.closeIcon} onPress={() => setModalVisible(false)}>
              <Entypo name="cross" size={24} color="black" />
            </Pressable>
            <Text style={styles.sheetTitle}>{name}</Text>
            <Text style={styles.sheetSubtitle}>Ambiente</Text>

            <Pressable
              style={styles.editButton}
              onPress={() => {
                setModalVisible(false);
                onEdit?.();
              }}
            >
              <Text style={styles.editText}>Editar planta</Text>
              <Feather name="edit-2" size={20} color="#fff" />
            </Pressable>

            <Pressable
              style={styles.deleteButton}
              onPress={() => {
                setModalVisible(false);
                onDelete?.();
              }}
            >
              <Text style={styles.deleteText}>Eliminar planta</Text>
              <FontAwesome name="trash-o" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  iconsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  icon: {
    borderWidth: 2,
    borderColor: '#14AE5C',
    borderRadius: 6,
    padding: 4,
    color: '#14AE5C',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBackground: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dragBar: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 8,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 15,
    padding: 10,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#14AE5C',
    padding: 12,
    borderRadius: 30,
    marginBottom: 12,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E53935',
    padding: 12,
    borderRadius: 30,
  },
  editText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
