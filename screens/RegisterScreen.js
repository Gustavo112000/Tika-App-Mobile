import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');

  return (
    <ImageBackground
      source={require('../assets/images/hojasFondo.png')}
      style={styles.background}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.container}>
        <Image source={require('../assets/images/logoTika.png')} style={styles.logo} />
        <Text style={styles.title}>Registrarse</Text>

        <TextInput style={styles.input} placeholder="Usuario" value={user} onChangeText={setUser} />
        <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={pass} onChangeText={setPass} />
        <TextInput style={styles.input} placeholder="Confirmar contraseña" secureTextEntry value={confirm} onChangeText={setConfirm} />
        <TextInput style={styles.input} placeholder="Correo electrónico" value={email} onChangeText={setEmail} />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Registrarse</Text>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  logo: { 
    width: 100, 
    height: 100, 
    alignSelf: 'center', 
    marginBottom: 10 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: 'white', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  button: { 
    backgroundColor: '#2b6a4f',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
  },
});
