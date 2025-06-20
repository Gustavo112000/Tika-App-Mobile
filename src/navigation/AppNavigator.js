import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MisPlantasScreen from '../screens/MisPlantasScreen';
import AmbientesScreen from '../screens/AmbientesScreen';
import RiegoManualScreen from '../screens/RiegoManual';
import NotificacionesScreen from '../screens/NotificacionesScreen';
import Garden from '../../screens/garden';
import AllPlantsScreen from '../../screens/plants';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="MisPlantas">
      <Stack.Screen name="MisPlantas" component={MisPlantasScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Ambientes" component={AmbientesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="RiegoManual" component={RiegoManualScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Notificaciones" component={NotificacionesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="garden" component={Garden} options={{ headerShown: false }} /> 
      <Stack.Screen name="plants" component={AllPlantsScreen} options={{ headerShown: false }} /> 
    </Stack.Navigator>
  );
};

export default AppNavigator;
