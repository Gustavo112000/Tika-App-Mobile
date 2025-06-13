import React from 'react';
import { StatusBar } from 'expo-status-bar';
import DescripcionPlantaScreen from './screens/detalles-plants'; // Asegúrate de respetar mayúsculas/minúsculas
import { NavigationContainer } from '@react-navigation/native'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlantCard } from './components/plant-card';
import { GardenScreen } from './screens/garden';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
    <NavigationContainer>
       <StatusBar style="auto" />
       <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={GardenScreen} />
            
            <Stack.Screen name="DescripcionPlanta" component={DescripcionPlantaScreen} />
       </Stack.Navigator>
      </NavigationContainer>
   
    </>
  );
}
