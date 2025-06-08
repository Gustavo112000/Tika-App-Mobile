import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';

export default function WelcomeScreen({ navigation }) { 
  return (
    <ImageBackground
        source={require('../assets/images/hojasFondo.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
        imageStyle={{
          opacity: 0.3, // Reduce la intensidad del fondo
          transform: [{ scaleX: -1 }], // Invierte horizontalmente
        }}
    >
      <View style={styles.container}>
        <Image source={require('../assets/images/logoTika.png')} style={styles.logo} />
        
        <Text style={styles.title}>¡Bienvenido!</Text>
        <Text style={styles.subtitle}>Cuida tu jardín de forma automática y eficiente</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <Text style={styles.textCenter}>¿No tienes cuenta?</Text>

        <TouchableOpacity style={styles.buttonOutline} onPress={() => navigation.navigate('RegisterScreen')}>
          <Text style={styles.buttonTextOutline}>Registrarse</Text>
        </TouchableOpacity>

        <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>o</Text>
            <View style={styles.separatorLine} />
          </View>

        <TouchableOpacity style={styles.buttonLink}>
          <Text style={styles.linkText}>Continuar sin cuenta</Text>
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
    paddingTop: '30%' 
  },
  logo: { 
    width: 220, 
    height: 220, 
    marginBottom: 20 
  },
  title: { 
    fontSize: 36, 
    fontWeight: 'bold', 
    color: '#02433B' 
  },
  subtitle: { 
    fontSize: 15, 
    color: '#79C8C5', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  button: {
    backgroundColor: '#14AE5C',
    paddingVertical: 10,
    paddingHorizontal: 125,
    borderRadius: 20,
    marginVertical: 1,
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 15, 
    fontWeight: 'bold' 
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
  buttonLink: { 
    marginTop: 2 
  },
  linkText: { 
    color: '#14AE5C', 
    fontSize: 14, 
    textDecorationLine: 'underline' 
  },
  textCenter: {
    color: '#14AE5C', 
    fontSize: 15, 
    marginVertical: 10, 
    textAlign: 'center' 
  },
  separatorContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 15,
  },
  separatorLine: {
    flex: 1, 
    height: 1, 
    backgroundColor: '#14AE5C', 
    marginHorizontal: 5,
  },
  separatorText: {
    color: '#14AE5C', 
    fontSize: 15,
  },
});