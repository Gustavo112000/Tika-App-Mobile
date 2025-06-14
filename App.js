import React from 'react';
import { StatusBar } from 'expo-status-bar';

import { NavigationContainer } from '@react-navigation/native'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlantCard } from './components/plant-card';
import  GardenScreen  from './screens/garden';
import AllPlantsScreen from './screens/plants';
import { AddPlantCard } from './components/add-plant-card';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
    <NavigationContainer>
       <StatusBar style="auto" />
       <Stack.Navigator>
          <Stack.Screen name="Garden" component={GardenScreen} />
          <Stack.Screen name="AllPlants" component={AllPlantsScreen} options={{ title: "Todas las Plantas" }} />
        </Stack.Navigator>
      </NavigationContainer>
   
    </>
  );
}
