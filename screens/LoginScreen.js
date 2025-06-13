import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity,Image, ImageBackground } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  return (
    <ImageBackground
      source={require('../assets/images/hojasFondo.png')}
      style={styles.background}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.container}>
        <Image source={require('../assets/images/logoTika.png')} style={styles.logo} />
        <Text style={styles.title}>Iniciar sesión</Text>

        <TextInput style={styles.input} placeholder="Usuario" value={user} onChangeText={setUser} />
        <TextInput style={styles.input} placeholder="Contraseña" value={pass} onChangeText={setPass} secureTextEntry />

        <TouchableOpacity>
          <Text style={styles.link}>¿Olvidaste la contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>¿No tienes cuenta?</Text>
        </TouchableOpacity>
  
        <TouchableOpacity style={styles.buttonOutline} onPress={() => navigation.navigate('RegisterScreen')}>
          <Text style={styles.buttonTextOutline}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
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
    height: '75%' 
  },
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
    paddingHorizontal: 20 
  },
  logo: {
    width: 100, 
    height: 100, 
    marginBottom: 20, 
    alignSelf: 'center',
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold' 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#888', 
    marginBottom: 30 
  },
  button: { 
    backgroundColor: '#43B97F', 
    padding: 15, 
    borderRadius: 30, 
    width: '80%', 
    alignItems: 'center' 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16 
  },
  link: { 
    marginTop: 15, 
    color: '#43B97F' 
  },
  buttonOutline: {
    borderWidth: 2,
    borderColor: '#14AE5C',
    paddingVertical: 10,
    paddingHorizontal: 125,
    borderRadius: 20,
    marginVertical: 3,
  },
  buttonTextOutline: { 
    color: '#14AE5C', 
    fontSize: 15, 
    fontWeight: 'bold' 
  },
  secondaryButton: { 
    marginTop: 15, 
    borderColor: '#43B97F',
    borderWidth: 1, 
    padding: 10, 
    borderRadius: 30, 
    width: '80%', 
    alignItems: 'center' 
  },
  secondaryText: { 
    color: '#43B97F' 
  },
});
