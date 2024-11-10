import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

// Importa el JSON
import hexagramas from './assets/hexagramas.json';

// Función para buscar hexagramas por el campo 'lineas'
function buscarHexagrama(lineasBuscadas) {
  console.log('Buscando hexagrama para las líneas:', lineasBuscadas); // Log para depuración

  // Iteramos sobre los hexagramas y comparamos el array de 'lineas' con el resultado.
  const found = hexagramas.find((hexagrama) => {
    const lineasHexagrama = JSON.parse(hexagrama.lineas); // Convertir la cadena a array
    return JSON.stringify(lineasHexagrama) === JSON.stringify(lineasBuscadas);
  });
  
  if (found) {
    console.log('Hexagrama encontrado:', found); // Log cuando se encuentra un hexagrama
  } else {
    console.log('No se encontró hexagrama para las líneas:', lineasBuscadas); // Log si no se encuentra el hexagrama
  }

  return found;
}


// Función principal para generar una tirada de hexagramas
function generarTirada() {
  const posibilidades = [1, 2, 3, 4];
  const weights = [3, 3, 1, 1];
  const tirada = [];

  for (let i = 0; i < 6; i++) {
    const randomIndex = getRandomIndex(weights);
    tirada.push(posibilidades[randomIndex]);
  }

  // Determinar si es mutable
  const mutable = tirada.includes(3) || tirada.includes(4);

  return { tirada, mutable };
}

// Función de ayuda para seleccionar índice basado en pesos
function getRandomIndex(weights) {
  const sum = weights.reduce((a, b) => a + b);
  let rand = Math.random() * sum;
  for (let i = 0; i < weights.length; i++) {
    if (rand < weights[i]) {
      return i;
    }
    rand -= weights[i];
  }
}

// Función para obtener el hexagrama inicial H1
function obtenerH1(tirada) {
  const h1 = tirada.map(value => {
    if (value === 3) return 1;
    if (value === 4) return 2;
    return value;
  });

  console.log('H1:', h1); // Log de las líneas para H1
  const hexagramaH1 = buscarHexagrama(h1);
  console.log('Hexagrama H1:', hexagramaH1); // Log para ver qué se encontró

  return hexagramaH1; // Retorna la información del hexagrama h1
}

// Función para obtener el hexagrama mutado H2
function obtenerH2(tirada, mutable) {
  if (!mutable) {
    console.log('H2 es igual a H1 porque no es mutable');
    return obtenerH1(tirada); // Si no es mutable, h2 = h1
  }

  const h2 = tirada.map(value => {
    if (value === 3) return 2;
    if (value === 4) return 1;
    return value;
  });

  console.log('H2:', h2); // Log de las líneas para H2
  const hexagramaH2 = buscarHexagrama(h2);
  console.log('Hexagrama H2:', hexagramaH2); // Log para ver qué se encontró

  return hexagramaH2; // Retorna la información del hexagrama h2
}

// Función para obtener las líneas mutables
function obtenerLineasMutables(tirada) {
  const mutables = [];

  tirada.forEach((value, index) => {
    if (value === 3 || value === 4) {
      mutables.push(index + 1); // +1 para que comience desde 1
    }
  });

  return mutables;
}

export default function App() {
  const [tirada, setTirada] = useState(null);
  const [hexagramaH1, setHexagramaH1] = useState(null);
  const [hexagramaH2, setHexagramaH2] = useState(null);
  const [lineasMutables, setLineasMutables] = useState([]);

  const realizarTirada = () => {
    const { tirada, mutable } = generarTirada();
    console.log('Tirada generada:', tirada); // Log para ver la tirada generada
    setTirada(tirada);
    const h1 = obtenerH1(tirada);
    setHexagramaH1(h1);
    const h2 = obtenerH2(tirada, mutable);
    setHexagramaH2(h2);
    setLineasMutables(obtenerLineasMutables(tirada));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>I-CHING LIBRE</Text>
      <Text style={styles.version}>v 0.0</Text>

      <Button title="Realizar tirada" onPress={realizarTirada} />

      {tirada && (
        <View style={styles.result}>
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
});

