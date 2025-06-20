import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { getID } from '../../pseudobackend/auth/getIDauth';

const AmbientesScreen = () => {
  const [ambientes, setAmbientes] = useState([]);
  const [estadoGeneral, setEstadoGeneral] = useState('cargando');
  const [ultimoRiego, setUltimoRiego] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const idUsuario = await getID();
        const ambientesRef = collection(db, `usuarios/${idUsuario}/ambientes`);
        const snapshotAmbientes = await getDocs(ambientesRef);

        const datosAmbientes = [];
        let plantasNecesitanRiego = 0;
        let totalPlantas = 0;

        for (const ambienteDoc of snapshotAmbientes.docs) {
          const ambienteId = ambienteDoc.id;
          const nombre = ambienteDoc.data().nombre || ambienteId;

          const plantasRef = collection(db, `usuarios/${idUsuario}/ambientes/${ambienteId}/plantas`);
          const snapshotPlantas = await getDocs(plantasRef);

          const numPlantas = snapshotPlantas.size;
          totalPlantas += numPlantas;

          let necesitaRiego = false;

          snapshotPlantas.forEach((planta) => {
            const data = planta.data();
            const humedad = data.humedad_actual ?? 100;
            if (humedad < 40) {
              plantasNecesitanRiego++;
              necesitaRiego = true;
            }
          });

          // Consulta del último riego de este ambiente
          const riegoAutoRef = collection(db, `usuarios/${idUsuario}/ambientes/${ambienteId}/riego`);
          const ultimoRiegoSnap = await getDocs(query(riegoAutoRef, orderBy('fecha_hora', 'desc'), limit(1)));

          // Registrar último riego global si es más reciente
          if (!ultimoRiegoSnap.empty) {
            const data = ultimoRiegoSnap.docs[0].data();
            const fecha = new Date(data.fecha_hora);

            if (!ultimoRiego || fecha > new Date(ultimoRiego.fecha_hora)) {
              setUltimoRiego({
                tipo: data.metodo,
                duracion: data.duracion ?? '4 minutos',
                hora: fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                fecha: fecha.toLocaleDateString(),
                fecha_hora: data.fecha_hora,
              });
            }
          }

          datosAmbientes.push({
            id: ambienteId,
            nombre,
            plantas: numPlantas,
            estado: necesitaRiego ? 'Inactivo' : 'Activo',
            imagen: require('../../assets/images/foto.png'),
          });
        }

        // Estado general del jardín
        if (totalPlantas === 0) {
          setEstadoGeneral('sin-plantas');
        } else if (plantasNecesitanRiego > 0) {
          setEstadoGeneral('requiere-riego');
        } else {
          setEstadoGeneral('saludables');
        }

        setAmbientes(datosAmbientes);
      } catch (error) {
        console.error('❌ Error al cargar datos de inicio:', error.message);
      }
    };

    cargarDatos();
  }, []);

  const renderEstadoPlantas = () => {
    switch (estadoGeneral) {
      case 'sin-plantas':
        return <Text style={styles.infoText}>🌱 Aún no tienes plantas</Text>;
      case 'saludables':
        return <Text style={styles.infoText}>🌿 Todas las plantas están saludables</Text>;
      case 'requiere-riego':
        return <Text style={styles.infoText}>⚠️ Una o más plantas necesitan riego</Text>;
      default:
        return <Text style={styles.infoText}>Cargando estado del jardín...</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Resumen del Estado del Jardín</Text>

        {/* Panel Estado de Plantas */}
        <View style={styles.cardVerde}>
          <Text style={styles.cardTitle}>Panel del Estado de Plantas</Text>
          <Text style={styles.cardSubtitle}>Controla el estado de tus plantas</Text>
          {renderEstadoPlantas()}
        </View>

        {/* Sistema de Riego */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sistema de Riego</Text>
          <Text style={styles.cardSubtitle}>Controla el riego de tus plantas</Text>
          {ambientes.length === 0 ? (
            <Text style={styles.infoText}>🌱 Aún no tienes plantas</Text>
          ) : (
            ambientes.map((ambiente) => (
              <View key={ambiente.id} style={styles.ambienteRow}>
                <Image source={ambiente.imagen} style={styles.ambienteIcono} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.ambienteNombre}>{ambiente.nombre}</Text>
                  <Text style={styles.ambienteTexto}>{ambiente.plantas} planta(s)</Text>
                </View>
                <Text
                  style={[
                    styles.estadoTexto,
                    {
                      color: ambiente.estado === 'Activo' ? '#00BFA6' : '#aaa',
                    },
                  ]}
                >
                  {ambiente.estado}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Último Riego */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Último Riego</Text>
          <Text style={styles.cardSubtitle}>Controla el riego de tus plantas</Text>
          {ultimoRiego ? (
            <Text style={styles.infoText}>
              💧 Riego {ultimoRiego.tipo.toLowerCase()} realizado el {ultimoRiego.fecha} a las {ultimoRiego.hora}.{'\n'}
              Duración: {ultimoRiego.duracion}.
            </Text>
          ) : (
            <Text style={styles.infoText}>🌧 No se realizó ningún riego aún</Text>
          )}
        </View>
      </ScrollView>
      <Menu />
    </View>
  );
};

export default AmbientesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, paddingBottom: 120 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004D40',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#E0F7FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardVerde: {
    backgroundColor: '#C8E6C9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: '#555', marginBottom: 8 },
  infoText: { fontSize: 14, color: '#333' },
  ambienteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ambienteIcono: { width: 40, height: 40, marginRight: 12, borderRadius: 8 },
  ambienteNombre: { fontWeight: 'bold', fontSize: 14 },
  ambienteTexto: { fontSize: 12, color: '#666' },
  estadoTexto: { fontSize: 14, fontWeight: 'bold' },
});
