// src/components/Menu.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Menu = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const tabs = [
    { name: 'Inicio', icon: 'home-outline', screen: 'Ambientes' },
    { name: 'Mis Plantas', icon: 'leaf-outline', screen: 'MisPlantas' },
    { name: 'Riego', icon: 'water-outline', screen: 'RiegoManual' },
    { name: 'Humedad', icon: 'thermometer-outline', screen: 'Notificaciones' },
  ];

  return (
    <View style={styles.menuContainer}>
      {tabs.map((tab) => {
        const isActive = route.name === tab.screen;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => navigation.navigate(tab.screen)}
          >
            <Ionicons
              name={tab.icon}
              size={24}
              color={isActive ? '#28a745' : 'gray'}
            />
            <Text style={[styles.tabText, { color: isActive ? '#28a745' : 'gray' }]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default Menu;
