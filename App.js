import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import hexagramas from './assets/hexagramas.json';


const buscarHexagrama = (lineasBuscadas) => {
  return hexagramas.find((hexagrama) => {
    const lineasHexagrama = JSON.parse(hexagrama.lineas);
    return JSON.stringify(lineasHexagrama) === JSON.stringify(lineasBuscadas);
  });
};

const generarTirada = () => {
  const posibilidades = [1, 2, 3, 4];
  const weights = [3, 3, 1, 1];
  const tirada = Array.from({ length: 6 }, () => {
    const randomIndex = getRandomIndex(weights);
    return posibilidades[randomIndex];
  });

  const mutable = tirada.includes(3) || tirada.includes(4);
  return { tirada, mutable };
};

const getRandomIndex = (weights) => {
  const sum = weights.reduce((a, b) => a + b);
  let rand = Math.random() * sum;
  return weights.findIndex((weight) => (rand -= weight) < 0);
};

const obtenerH1 = (tirada) => {
  const h1 = tirada.map(value => (value === 3 ? 1 : value === 4 ? 2 : value));
  return buscarHexagrama(h1);
};

const obtenerH2 = (tirada, mutable) => {
  const h2 = mutable 
    ? tirada.map(value => (value === 3 ? 2 : value === 4 ? 1 : value)) 
    : tirada;
  return buscarHexagrama(h2);
};

const obtenerLineasMutables = (tirada) => {
  return tirada.reduce((mutables, value, index) => {
    if (value === 3 || value === 4) {
      mutables.push(index + 1);
    }
    return mutables;
  }, []);
};

export default function App() {
  const [tirada, setTirada] = useState(null);
  const [hexagramaH1, setHexagramaH1] = useState(null);
  const [hexagramaH2, setHexagramaH2] = useState(null);
  const [lineasMutables, setLineasMutables] = useState([]);

  const realizarTirada = () => {
    const { tirada, mutable } = generarTirada();
    setTirada(tirada);
    setHexagramaH1(obtenerH1(tirada));
    setHexagramaH2(obtenerH2(tirada, mutable));
    setLineasMutables(obtenerLineasMutables(tirada));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>I-CHING LIBRE</Text>
      <Text style={styles.version}>v 0.0</Text>
      <TouchableOpacity onPress={realizarTirada} style={styles.button}>
  <Text style={styles.buttonText}>Realizar tirada</Text>
</TouchableOpacity>

      {tirada && (
  <View key={tirada.join(', ')} style={styles.result}>
    <Text>Tirada: {tirada.join(', ')}</Text>
    <Text>Hexagrama H1: {hexagramaH1 ? hexagramaH1.nombre : "No encontrado"}</Text>
    <Text>Hexagrama H2: {hexagramaH2 ? hexagramaH2.nombre : "No encontrado"}</Text>
    <Text>Líneas Mutables: {lineasMutables.join(', ')}</Text>
  </View>
)}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  version: {
    fontSize: 16,
    marginBottom: 20,
  },
  result: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
  padding: 10,
  backgroundColor: '#007BFF',
  borderRadius: 5,
  alignItems: 'center',
},

});

