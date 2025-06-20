import React, { useState, useEffect } from 'react';
import {View,   Text,   StyleSheet,   TouchableOpacity,   Image,   ScrollView,   Switch,   Modal,   Alert, } from 'react-native';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { Ionicons } from '@expo/vector-icons';
import {query, orderBy,limit ,doc,getDocs, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { getID } from '../../pseudobackend/auth/getIDauth';
import { obtenerPlantasDeAmbiente } from '../../pseudobackend/auth/getPlantas';



const obtenerFechaActual = () => {
  const fecha = new Date();
  return `${fecha.toLocaleDateString()} a las ${fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

const RiegoScreen = () => {
  const [riegosManuales, setRiegosManuales] = useState([]);
  const [estadoAuto, setEstadoAuto] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [riegoSeleccionado, setRiegoSeleccionado] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState(false);
  const [modalPlantasVisible, setModalPlantasVisible] = useState(false);
  const [plantasDelAmbiente, setPlantasDelAmbiente] = useState([]);
  const [ambienteSeleccionado, setAmbienteSeleccionado] = useState(null);
  const [infoRiegoAuto, setInfoRiegoAuto] = useState({}); // { ambienteId: { estado, fecha } }
  const [plantasSeleccionadas, setPlantasSeleccionadas] = useState([]);
  const [estadoRiegoPlantas, setEstadoRiegoPlantas] = useState({});
  
  const toggleSeleccionPlanta = (id) => {
  setPlantasSeleccionadas((prev) =>
    prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
  );
};
useEffect(() => {
  const intervalo = setInterval(async () => {
    try {
      const idUsuario = await getID();
      const ambientesRef = collection(db, `usuarios/${idUsuario}/ambientes`);
      const ambientesSnapshot = await getDocs(ambientesRef);

      for (const ambienteDoc of ambientesSnapshot.docs) {
        const ambienteId = ambienteDoc.id;
        const plantasRef = collection(db, `usuarios/${idUsuario}/ambientes/${ambienteId}/plantas`);
        const plantasSnapshot = await getDocs(plantasRef);

        for (const plantaDoc of plantasSnapshot.docs) {
          const plantaData = plantaDoc.data();
          const humedadActual = plantaData.humedad_actual ?? 0;
          const nuevaHumedad = Math.max(0, humedadActual - 40);

          await updateDoc(doc(db, `usuarios/${idUsuario}/ambientes/${ambienteId}/plantas/${plantaDoc.id}`), {
            humedad_actual: nuevaHumedad,
          });
        }
      }

      console.log("✔ Humedades actualizadas cada 2 minutos.");
    } catch (error) {
      console.error("❌ Error al actualizar humedades:", error.message);
    }
  }, 120000); // 2 minutos

  return () => clearInterval(intervalo); // limpieza
}, []);

useEffect(() => {
  const intervaloRiegoAuto = setInterval(async () => {
    try {
      const idUsuario = await getID();

      for (const ambienteId in estadoAuto) {
        if (!estadoAuto[ambienteId]) continue; // Solo si el riego automático está activo

        const plantasRef = collection(db, `usuarios/${idUsuario}/ambientes/${ambienteId}/plantas`);
        const snapshot = await getDocs(plantasRef);

        let humedadBaja = false;

        for (const docPlanta of snapshot.docs) {
          const data = docPlanta.data();
          if ((data.humedad_actual ?? 0) < 40) {
            humedadBaja = true;
            break;
          }
        }

        if (humedadBaja) {
          iniciarRiegoAutomatico(ambienteId, true);
        } else {
          setInfoRiegoAuto((prev) => ({
            ...prev,
            [ambienteId]: {
              estado: 'esperando',
              fecha: calcularProximoRiego(),
            }
          }));
        }
      }

    } catch (error) {
      console.error("❌ Error en el riego automático:", error.message);
    }
  }, 120000); // cada 2 minutos

  return () => clearInterval(intervaloRiegoAuto);
}, [estadoAuto]);

const regarPlantasSeleccionadas = async () => {
  if (plantasSeleccionadas.length === 0) {
    Alert.alert('Selecciona al menos una planta');
    return;
  }

  try {
    const idUsuario = await getID();
    const fechaHora = new Date().toISOString();

    for (const plantaId of plantasSeleccionadas) {
      const planta = plantasDelAmbiente.find(p => p.id === plantaId);
      if (!planta) continue;

      // 1. Registrar evento de riego
      const riegoRef = collection(
        db,
        `usuarios/${idUsuario}/ambientes/${ambienteSeleccionado}/plantas/${plantaId}/riego`
      );
      await addDoc(riegoRef, {
        metodo: 'Manual',
        fecha_hora: fechaHora,
        duracion: '4 minutos',
      });

      // 2. Actualizar humedad
      await updateDoc(
        doc(db, `usuarios/${idUsuario}/ambientes/${ambienteSeleccionado}/plantas/${plantaId}`),
        { humedad_actual: 80 }
      );
    }

    Alert.alert('Éxito', 'Las plantas seleccionadas fueron regadas.');
    setPlantasSeleccionadas([]); // Limpiar selección

  } catch (error) {
    console.error('❌ Error al regar plantas seleccionadas:', error.message);
    Alert.alert('Error', 'No se pudo completar el riego.');
  }
};



const toggleRiegoIndividual = (idPlanta) => {
  const estadoActual = estadoRiegoPlantas[idPlanta];
  if (estadoActual === 'regando') {
    setEstadoRiegoPlantas((prev) => ({ ...prev, [idPlanta]: 'completado' }));
  } else {
    setEstadoRiegoPlantas((prev) => ({ ...prev, [idPlanta]: 'regando' }));
    setTimeout(() => {
      setEstadoRiegoPlantas((prev) => ({ ...prev, [idPlanta]: 'completado' }));
    }, 3000);
  }
};
  // Cargar ambientes desde Firebase
  useEffect(() => {
    const cargarAmbientesConPlantas = async () => {
  try {
    const idUsuario = await getID();
    const ambientesRef = collection(db, `usuarios/${idUsuario}/ambientes`);
    const ambientesSnapshot = await getDocs(ambientesRef);

    const datosAmbientes = [];

    for (const docAmbiente of ambientesSnapshot.docs) {
      const ambienteId = docAmbiente.id;

      const plantasRef = collection(db, `usuarios/${idUsuario}/ambientes/${ambienteId}/plantas`);
      const plantasSnapshot = await getDocs(plantasRef);

      const riegoRef = collection(db, `usuarios/${idUsuario}/ambientes/${ambienteId}/riego`);
      const ultimoRiegoQuery = query(riegoRef, orderBy('fecha_hora', 'desc'), limit(1));
      const ultimoRiegoSnap = await getDocs(ultimoRiegoQuery);

      let estado = 'inactivo';
      let ultimoRiego = null;

      if (!ultimoRiegoSnap.empty) {
        const data = ultimoRiegoSnap.docs[0].data();
        const fechaRiego = new Date(data.fecha_hora);
        ultimoRiego = fechaRiego.toLocaleString();

        const ahora = new Date();
        const diffMs = ahora - fechaRiego;

        if (diffMs < 2 * 60 * 1000) {
          estado = 'completado';
        }
      }

      datosAmbientes.push({
        id: ambienteId,
        ambiente: ambienteId,
        plantas: plantasSnapshot.size,
        imagen: require('../../assets/images/foto.png'),
        estado,
        ultimoRiego,
      });
    }

    setRiegosManuales(datosAmbientes);
  } catch (error) {
    console.error('Error al cargar ambientes:', error.message);
  }
};

      cargarAmbientesConPlantas();
    }, []);

const registrarRiegoEnFirebase = async (ambienteId, metodo = 'Manual') => {
  try {
    const idUsuario = await getID();
    const plantasRef = collection(db, `usuarios/${idUsuario}/ambientes/${ambienteId}/plantas`);
    const snapshot = await getDocs(plantasRef);

    const fechaHora = new Date().toISOString();
    const plantaIds = [];

    for (const docPlanta of snapshot.docs) {
      const plantaId = docPlanta.id;
      plantaIds.push(plantaId);

      // Registrar evento de riego
      const riegoRef = collection(
        db,
        `usuarios/${idUsuario}/ambientes/${ambienteId}/plantas/${plantaId}/riego`
      );
      await addDoc(riegoRef, {
        metodo,
        fecha_hora: fechaHora,
        duracion: '4 minutos',
      });

      // Actualizar humedad inicial a 80%
      await updateDoc(
        doc(db, `usuarios/${idUsuario}/ambientes/${ambienteId}/plantas/${plantaId}`),
        { humedad_actual: 100 }
      );
    }

    console.log(`✅ Riego registrado y humedad actualizada a 80% para ${ambienteId}`);

    // 🔁 Simulación: después de 2 minutos, baja la humedad a 40%
    setTimeout(async () => {
      for (const plantaId of plantaIds) {
        await updateDoc(
          doc(db, `usuarios/${idUsuario}/ambientes/${ambienteId}/plantas/${plantaId}`),
          { humedad_actual: 40 }
        );
        console.log(`🌡 Humedad de ${plantaId} reducida a 40% después de 2 minutos`);
      }
    }, 120000); // 2 minutos

  } catch (error) {
    console.error('❌ Error al registrar riego:', error.message);
  }
};



  const cargarAmbientesConPlantas = async () => {
  try {
    const idUsuario = await getID();
    const ambientesRef = collection(db, `usuarios/${idUsuario}/ambientes`);
    const ambientesSnapshot = await getDocs(ambientesRef);

    const datosAmbientes = [];

    for (const docAmbiente of ambientesSnapshot.docs) {
      const ambienteId = docAmbiente.id;

      const plantasRef = collection(db, `usuarios/${idUsuario}/ambientes/${ambienteId}/plantas`);
      const plantasSnapshot = await getDocs(plantasRef);

      // 🔍 Cargar último riego
      const riegoRef = collection(db, `usuarios/${idUsuario}/ambientes/${ambienteId}/riego`);
      const ultimoRiegoQuery = query(riegoRef, orderBy('fecha_hora', 'desc'), limit(1));
      const ultimoRiegoSnap = await getDocs(ultimoRiegoQuery);

      let estado = 'inactivo';
      let ultimoRiego = null;

      if (!ultimoRiegoSnap.empty) {
        const data = ultimoRiegoSnap.docs[0].data();
        const fechaRiego = new Date(data.fecha_hora);
        ultimoRiego = fechaRiego.toLocaleString();

        const ahora = new Date();
        const diffMs = ahora - fechaRiego;

        if (diffMs < 2 * 60 * 1000) {
          estado = 'completado'; // Aún no pasaron los 2 minutos
        }
      }

      datosAmbientes.push({
        id: ambienteId,
        ambiente: ambienteId,
        plantas: plantasSnapshot.size,
        imagen: require('../../assets/images/foto.png'),
        estado,
        ultimoRiego,
      });
    }

    setRiegosManuales(datosAmbientes);
  } catch (error) {
    console.error('Error al cargar ambientes:', error.message);
  }
};

    const toggleSwitch = (item) => {
      setRiegoSeleccionado(item);
      setNuevoEstado(!estadoAuto[item.id]);
      setModalVisible(true);
    };

    const calcularProximoRiego = () => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 1); // mañana
    return `${fecha.toLocaleDateString()} a las ${fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    const confirmarCambio = () => {
    setEstadoAuto((prev) => ({ ...prev, [riegoSeleccionado.id]: nuevoEstado }));
    setModalVisible(false);

    // Simula lectura de humedad
    const humedad = Math.floor(Math.random() * 100); // valor entre 0 y 100
    const humedadMinima = 40; // puedes calcularlo según planta luego

    if (nuevoEstado) {
      if (humedad < humedadMinima) {
        // Inicia riego automático
        iniciarRiegoAutomatico(riegoSeleccionado.id, true);
      } else {
        // No es necesario regar, mostrar estimación
        setInfoRiegoAuto((prev) => ({
          ...prev,
          [riegoSeleccionado.id]: {
            estado: 'esperando',
            fecha: calcularProximoRiego(),
          }
        }));
      }
    } else {
      // Desactiva
      setInfoRiegoAuto((prev) => {
        const copia = { ...prev };
        delete copia[riegoSeleccionado.id];
        return copia;
      });
    }
  };


  const iniciarRiegoAutomatico = (id, esAutomatico = false) => {
  setRiegosManuales((prev) =>
    prev.map((r) =>
      r.id === id ? { ...r, estado: 'regando' } : r
    )
  );

  if (esAutomatico) {
    setInfoRiegoAuto((prev) => ({
      ...prev,
      [id]: { estado: 'regando' }
    }));
  }

    setTimeout(async () => {
    const fecha = obtenerFechaActual();
    const idUsuario = await getID();

    // Actualizar UI
    setRiegosManuales((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, estado: 'completado', ultimoRiego: fecha } : r
      )
    );

    if (esAutomatico) {
      setInfoRiegoAuto((prev) => ({
        ...prev,
        [id]: { estado: 'completado', fecha }
      }));
    }

    // Registrar riego automático en Firebase
    const plantasRef = collection(db, `usuarios/${idUsuario}/ambientes/${id}/plantas`);
    const plantasSnap = await getDocs(plantasRef);
    const fechaISO = new Date().toISOString();

    for (const docPlanta of plantasSnap.docs) {
      const plantaId = docPlanta.id;

      // Agregar evento de riego
      const riegoRef = collection(db, `usuarios/${idUsuario}/ambientes/${id}/plantas/${plantaId}/riego`);
      await addDoc(riegoRef, {
        metodo: 'Automático',
        fecha_hora: fechaISO,
        duracion: '4 minutos'
      });

      // Actualizar humedad 
      await updateDoc(
        doc(db, `usuarios/${idUsuario}/ambientes/${id}/plantas/${plantaId}`),
        { humedad_actual: 100 }
      );
    }

    console.log(`🌧 Riego automático completado y humedad actualizada en ambiente ${id}`);
  }, 3000);

};


  const iniciarRiegoManualAmbiente = async (id) => {
  setRiegosManuales((prev) =>
    prev.map((r) => (r.id === id ? { ...r, estado: 'regando' } : r))
  );

  setTimeout(async () => {
    const fecha = obtenerFechaActual();

    setRiegosManuales((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, estado: 'completado', ultimoRiego: fecha } : r
      )
    );

    await registrarRiegoEnFirebase(id, 'Manual');
    setTimeout(() => {
      setRiegosManuales((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, estado: 'inactivo' } : r
        )
      );
    }, 120000); // 2 minutos en milisegundos
  }, 3000);
};


  const detenerRiego = (id) => {
    setRiegosManuales((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, estado: 'completado', ultimoRiego: obtenerFechaActual() } : r
      )
    );
  };

  const abrirModalPlantas = async (ambiente) => {
  try {
    const plantas = await obtenerPlantasDeAmbiente(ambiente);
    setAmbienteSeleccionado(ambiente);
    setPlantasDelAmbiente(plantas);
    setModalPlantasVisible(true);
  } catch (error) {
    console.error('Error al cargar plantas del ambiente:', error.message);
  }
};
  const cerrarModalPlantas = () => setModalPlantasVisible(false);
  

  const renderRiegoManual = ({ item }) => (
    <View key={item.id} style={styles.card}>
      <Image source={item.imagen} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.ambiente}>{item.ambiente}</Text>
        <Text style={styles.subtexto}>{item.plantas} Planta{item.plantas > 1 ? 's' : ''}</Text>

        {item.estado === 'inactivo' && (
          <>
            <TouchableOpacity
              style={styles.botonCeleste}
		//borrame
	    onPress={() => {
		console.log('ID de la planta:', item.id);
		iniciarRiegoManualAmbiente(item.id)
		}
	    }
            >
              <Ionicons name="water" size={16} color="white" style={styles.icono} />
              <Text style={styles.botonTexto}>Regar todo el ambiente</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.botonTransparente}
              onPress={() => abrirModalPlantas(item.ambiente)}
            >
              <Ionicons name="leaf-outline" size={16} color="#00BFA6" style={styles.icono} />
              <Text style={styles.botonTextoCeleste}>Seleccionar planta</Text>
            </TouchableOpacity>
          </>
        )}

        {item.estado === 'regando' && (
          <>
            <Text style={styles.subtexto}>­ Riego en curso...</Text>
            <TouchableOpacity
              style={styles.botonCeleste}
              onPress={() => detenerRiego(item.id)}
            >
              <Text style={styles.botonTexto}>Detener riego</Text>
            </TouchableOpacity>
          </>
        )}

        {item.estado === 'completado' && (
          <>
            <Text style={styles.subtexto}>Último riego: {item.ultimoRiego}</Text>
            <TouchableOpacity
              style={styles.botonCeleste}
              onPress={() => iniciarRiegoManualAmbiente(item.id)}
            >
              <Ionicons name="refresh" size={16} color="white" style={styles.icono} />
              <Text style={styles.botonTexto}>Repetir riego</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Control de Riego" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
        <Text style={styles.sectionTitle}>Riego Manual</Text>
        {riegosManuales.map((item) => renderRiegoManual({ item }))}

        <Text style={styles.sectionTitle}>Riego automático</Text>
        {riegosManuales.map((item) => (
          <View key={`auto-${item.id}`} style={styles.card}>
            <Image source={item.imagen} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.ambiente}>{item.ambiente}</Text>
              <Text style={styles.subtexto}>{item.plantas} Planta</Text>
              {infoRiegoAuto[item.id]?.estado === 'regando' && (
  <Text style={styles.subtexto}>🌧 Riego en curso...</Text>
)}
{infoRiegoAuto[item.id]?.estado === 'completado' && (
  <Text style={styles.subtexto}>💧 Último riego: {infoRiegoAuto[item.id].fecha}</Text>
)}
{infoRiegoAuto[item.id]?.estado === 'esperando' && (
  <Text style={styles.subtexto}>⏱ Próximo riego: {infoRiegoAuto[item.id].fecha}</Text>
)}

            </View>
            <Switch
              value={estadoAuto[item.id] || false}
              onValueChange={() => toggleSwitch(item)}
              thumbColor={estadoAuto[item.id] ? '#00BFA6' : '#ccc'}
              trackColor={{ false: '#ccc', true: '#b2dfdb' }}
            />
          </View>
        ))}
      </ScrollView>

      {/* Modal Cambio Riego */}
      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={20} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{riegoSeleccionado?.ambiente}</Text>
            <Text style={styles.modalText}>{riegoSeleccionado?.plantas} Planta</Text>
            <Text style={styles.modalSubText}>
              {nuevoEstado ? 'Riego Automatico' : 'Riego Manual'}
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={confirmarCambio}
            >
              <Text style={styles.modalButtonText}>
                Cambiar a {nuevoEstado ? 'Riego Automatico' : 'Riego Manual'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
        
        <Modal transparent visible={modalPlantasVisible} animationType="slide">
  <View style={styles.modalContainer}>
    <View style={[styles.modalContent, { alignItems: 'stretch' }]}>
      <TouchableOpacity style={styles.modalClose} onPress={cerrarModalPlantas}>
        <Ionicons name="close" size={20} color="#333" />
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { alignSelf: 'center' }]}>Riego Manual</Text>
      <Text style={[styles.ambiente, { alignSelf: 'center' }]}>{ambienteSeleccionado}</Text>
      <Text style={[styles.subtexto, { alignSelf: 'center' }]}>
        Selecciona plantas para regar
      </Text>

<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 12 }}
>
  {plantasDelAmbiente.map((planta) => (
    <TouchableOpacity
      key={planta.id}
      onPress={() => toggleSeleccionPlanta(planta.id)}
      style={{
        width: 160,
        marginHorizontal: 8,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: plantasSeleccionadas.includes(planta.id) ? '#00BFA6' : '#eee',
        backgroundColor: '#fff',
        padding: 10,
      }}
    >
      <Image
        source={{ uri: planta.foto_url || 'https://via.placeholder.com/150' }}
        style={{
          width: '100%',
          height: 100,
          borderRadius: 8,
          marginBottom: 8,
          resizeMode: 'cover',
        }}
      />
      <Text style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}>
        {planta.nombre}
      </Text>
      <Text style={{ fontSize: 12, color: '#777', marginBottom: 8 }}>
        Último riego: {planta.ultimo_riego || 'N/A'}
      </Text>
      <TouchableOpacity
        style={styles.botonCeleste}
        onPress={() => toggleRiegoIndividual(planta.id)}
      >
        <Text style={styles.botonTexto}>
          {estadoRiegoPlantas[planta.id] === 'regando'
            ? 'Detener riego'
            : 'Repetir riego'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  ))}
</ScrollView>


  <TouchableOpacity
  style={[styles.botonCeleste, { marginTop: 8, alignSelf: 'center' }]}
  onPress={() => {
    cerrarModalPlantas();
    iniciarRiegoManualAmbiente(ambienteSeleccionado);
  }}
>
  <Ionicons name="water" size={16} color="white" style={styles.icono} />
  <Text style={styles.botonTexto}>Regar todo el ambiente</Text>
</TouchableOpacity>
      <TouchableOpacity
  style={[styles.botonTransparente, { alignSelf: 'center' }]}
  onPress={regarPlantasSeleccionadas}
>
  <Ionicons name="leaf-outline" size={16} color="#00BFA6" style={styles.icono} />
  <Text style={styles.botonTextoCeleste}>Regar plantas seleccionadas</Text>
</TouchableOpacity>

    </View>
  </View>
</Modal>



      <Menu />
    </View>
  );
};


export default RiegoScreen;


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#004D40',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    borderWidth: 1,
    borderColor: '#eee',
  },
  image: { width: 50, height: 50, marginRight: 12 },
  infoContainer: { flex: 1 },
  ambiente: { fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  subtexto: { fontSize: 12, color: '#555' },
  botonCeleste: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#80DEEA',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  botonTexto: { color: '#fff', fontWeight: 'bold' },
  botonTransparente: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00BFA6',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  botonTextoCeleste: { color: '#00BFA6', fontWeight: 'bold' },
  icono: { marginRight: 6 },

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    marginBottom: 10,
  },
  modalClose: { position: 'absolute', top: 10, right: 10 },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004D40',
  },
  modalText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  modalSubText: {
    fontSize: 14,
    color: '#aaa',
    marginVertical: 10,
  },
  modalButton: {
    backgroundColor: '#00C853',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  plantaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    width: '100%',
  },
});

