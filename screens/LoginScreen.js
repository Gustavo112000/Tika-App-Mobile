import React, { useState } from 'react';
import { iniciarSesion } from '../pseudobackend/verificacionDeLoginUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  Image, ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// import { useNavigation } from '@react-navigation/native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ImageBackground
      source={require('../assets/images/hojasFondo.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
      imageStyle={{
        opacity: 0.3,
        transform: [{ scaleX: -1 }],
      }}
    >
      <View style={styles.container}>
        <Image source={require('../assets/images/logoTika.png')} style={styles.logo} />
        <Text style={styles.title}>Iniciar sesión</Text>

        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="#14AE5C" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Usuario"
            placeholderTextColor="#14AE5C"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#14AE5C" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#14AE5C"
            secureTextEntry={!showPassword}
            value={pass}
            onChangeText={setPass}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#14AE5C" />
          </TouchableOpacity>
        </View>

	<TouchableOpacity style={styles.button}
	onPress={async () => {
	    try {
		console.log('Se hizo clic');

		const id = await iniciarSesion(email, pass);
		const token = await AsyncStorage.getItem('token');
		console.log('Después de iniciarSesion:', id);
		navigation.navigate('AmbientesScreen'); // o a donde quieras dirigirlo
	    } catch (error) {
		Alert.alert('Error', error.message);
	    }
	}}
	>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <Text style={styles.textCenter}>¿No tienes cuenta?</Text>
        <TouchableOpacity style={styles.buttonOutline} onPress={() => navigation.navigate('RegisterScreen')}>
          <Text style={styles.buttonTextOutline}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-start',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: '75%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '30%',
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#02433B',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 5,
    width: '80%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#02433B',
  },
  button: {
    backgroundColor: '#14AE5C',
    paddingVertical: 10,
    paddingHorizontal: 125,
    borderRadius: 20,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonOutline: {
    borderWidth: 2,
    borderColor: '#14AE5C',
    paddingVertical: 10,
    paddingHorizontal: 125,
    borderRadius: 20,
    marginVertical: 10,
  },
  buttonTextOutline: {
    color: '#14AE5C',
    fontSize: 15,
    fontWeight: 'bold',
  },
  textCenter: {
    color: '#14AE5C',
    fontSize: 15,
    marginVertical: 10,
    textAlign: 'center',
  },
});
