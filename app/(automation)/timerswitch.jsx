import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import { CustomButton } from '../../components'; // Assuming this path is correct
import { postAutomatizacion } from '../../lib/appwrite'; // Assuming this path is correct
import { useGlobalContext } from '../../context/GlobalProvider';
import { router } from 'expo-router';

// SwitchMatrix Component
const SwitchMatrix = () => {
  const { user } = useGlobalContext();
  const [schedule, setSchedule] = useState(Array.from({ length: 24 }, () => Array(12).fill(false)));
  const [uploading, setUploading] = useState(false);

  // Función para alternar el estado de una celda
  const toggleCell = (hour, interval) => {
    const newSchedule = [...schedule];
    newSchedule[hour][interval] = !newSchedule[hour][interval];
    setSchedule(newSchedule);
  };

  // Función para alternar toda una fila (una hora completa)
  const toggleRow = (hour) => {
    const newSchedule = [...schedule];
    const rowActive = newSchedule[hour].every((cell) => cell); // Verifica si toda la fila está activa
    newSchedule[hour] = newSchedule[hour].map(() => !rowActive); // Cambia el estado de toda la fila
    setSchedule(newSchedule);
  };

  // Función para alternar toda una columna (un intervalo de 5 minutos)
  const toggleColumn = (interval) => {
    const newSchedule = [...schedule];
    const columnActive = newSchedule.every((row) => row[interval]); // Verifica si toda la columna está activa
    newSchedule.forEach((row) => {
      row[interval] = !columnActive; // Cambia el estado de cada celda en la columna
    });
    setSchedule(newSchedule);
  };

  // Crear etiquetas para los intervalos de 5 minutos
  const getIntervalLabel = (index) => {
    return `${(index + 1) * 5}`; // Intervalos de 5 minutos
  };

  // Función para formatear la matriz de schedule para enviar como cadena
  const formatScheduleForSubmission = () => {
    return schedule
      .flat()
      .map((active) => (active ? '1' : '0'))
      .join(''); // Convierte cada valor booleano en "1" o "0" y lo une en una cadena
  };

  // Función para manejar el envío del formulario
  const submit = async () => {
    setUploading(true);
    try {
      const formattedSchedule = formatScheduleForSubmission();
      await postAutomatizacion({
        titulo: 'Timer Automation', // O cualquier otro título
        descripcion: 'This is a timer-based automation',
        config: {
          tipo: 'timer',
          matriz: formattedSchedule,
        },
        userId: user.$id,
      });

      Alert.alert('Success', 'Automatization created successfully');
      router.push('/automatizaciones');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container} className="px-4 pt-6 bg-primary h-full">
      <View>
        <Text style={styles.title}>Select Time Intervals</Text>
        <View>
          {/* Encabezado con los botones de columnas */}
          <View style={styles.row}>
            <Text style={styles.hourLabel}></Text>
            {Array.from({ length: 12 }).map((_, interval) => (
              <Pressable key={interval} onPressIn={() => toggleColumn(interval)} style={styles.toggleButton}>
                <Text style={styles.cellText}>C{interval + 1}</Text>
              </Pressable>
            ))}
          </View>

          {/* Celdas de la matriz para cada hora */}
          {schedule.map((row, hour) => (
            <View key={hour} style={styles.row}>
              <Pressable
                onPressIn={() => toggleRow(hour)} // Cambiado a onPressIn
                style={styles.hourButton}
              >
                <Text style={styles.hourLabel}>{`${hour}:00`}</Text>
              </Pressable>
              <View style={styles.intervalRow}>
                {row.map((isActive, interval) => (
                  <Pressable
                    key={interval}
                    onPressIn={() => toggleCell(hour, interval)} // Cambiado a onPressIn
                    style={[styles.cell, { backgroundColor: isActive ? 'green' : 'red' }]}
                  >
                    <Text style={styles.cellText}>{getIntervalLabel(interval)}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Botón para enviar la automatización */}
        <CustomButton title="Submit" handlePress={submit} containerStyles="mt-7" isLoading={uploading} />
      </View>
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hourLabel: {
    width: 45,
    textAlign: 'center',
    color: '#fff',
  },
  hourButton: {
    width: 45,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  intervalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    color: '#fff',
    fontSize: 12,
  },
  toggleButton: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    margin: 2,
  },
});

export default SwitchMatrix;
