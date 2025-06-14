// authID.js
// uso obligatorio despues de logearse
// ejemplo de uso 
// const id = await getID();
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getID = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return token;
  } catch (error) {
    console.error('Error al obtener el token:', error);
    return null;
  }
};

