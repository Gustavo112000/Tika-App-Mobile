import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';


import { Alert } from 'react-native';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');

    useEffect(() => {
	const escribirYLeer = async () => {
	    const ref = doc(db, 'mensajes', 'hola-mundo');
	    await setDoc(ref, { mensaje: 'Hola mundo desde Expo + Firestore!' });

	    const snap = await getDoc(ref);
	    if (snap.exists()) {
		console.log('Documento:', snap.data());
	    }
	};

	escribirYLeer();
    }, []);

    function holi(){
	Alert.alert('holiwis uwu')
    }

  return (
    <ImageBackground
      source={require('../assets/images/hojasFondo.png')}
      style={styles.backgroundImage}
        imageStyle={{
          opacity: 0.3, // Reduce la intensidad del fondo
          transform: [{ scaleX: -1 }], // Invierte horizontalmente
        }}
    >
      <View style={styles.container}>
        <Image source={require('../assets/images/logoTika.png')} style={styles.logo} />
        <Text style={styles.title}>Registrarse</Text>

        <TextInput style={styles.input} placeholder="Usuario" value={user} onChangeText={setUser} />
        <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={pass} onChangeText={setPass} />
        <TextInput style={styles.input} placeholder="Confirmar contraseña" secureTextEntry value={confirm} onChangeText={setConfirm} />
        <TextInput style={styles.input} placeholder="Correo electrónico" value={email} onChangeText={setEmail} />

	<TouchableOpacity 
	style={styles.button}
	onPress={() => holi()}
    >
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
    height: '90%' 
  },
  container: { 
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    color: 'black', 
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
