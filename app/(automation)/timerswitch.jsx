import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";

const SwitchMatrix = () => {
  // Inicializar una matriz 25x13 (una fila y una columna extra) con valores falsos
  const [schedule, setSchedule] = useState(
    Array.from({ length: 24 }, () => Array(12).fill(false))
  );

  // Función para alternar el estado de una celda
  const toggleCell = (hour, interval) => {
    const newSchedule = [...schedule];
    newSchedule[hour][interval] = !newSchedule[hour][interval];
    setSchedule(newSchedule);
  };

  // Función para alternar toda una fila
  // Función para alternar toda una fila
  const toggleRow = (interval) => {
    const newSchedule = [...schedule];
    newSchedule.forEach((row) => {
      row[interval] = !row[interval];
    });
    setSchedule(newSchedule);
  };

  // Función para alternar toda una columna
  const toggleColumn = (interval) => {
    const newSchedule = [...schedule];
    newSchedule.forEach((row) => {
      row[interval] = !row[interval];
    });
    setSchedule(newSchedule);
  };

  // Crear etiquetas para los intervalos de 5 minutos
  const getIntervalLabel = (index) => {
    return `${(index + 1) * 5}`;
  };

  return (
    <ScrollView horizontal>
      <ScrollView style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.hourLabel}></Text>
          {/* Botones de las columnas */}
          {Array.from({ length: 12 }).map((_, interval) => (
            <Pressable
              key={interval}
              onPress={() => toggleColumn(interval)}
              style={styles.toggleButton}
            >
              <Text style={styles.cellText}>C{interval + 1}</Text>
            </Pressable>
          ))}
        </View>
        {schedule.map((row, hour) => (
          <View key={hour} style={styles.row}>
            {/* Botón de la fila */}
            <Pressable onPress={() => toggleRow(hour)}>
              <Text style={styles.hourLabel}>{`${hour}:00`}</Text>
            </Pressable>
            <View style={styles.intervalRow}>
              {row.map((isActive, interval) => (
                <Pressable
                  key={interval}
                  onPress={() => toggleCell(hour, interval)}
                  style={[
                    styles.cell,
                    { backgroundColor: isActive ? "green" : "red" },
                  ]}
                >
                  <Text style={styles.cellText}>
                    {getIntervalLabel(interval)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    padding: 5,
    backgroundColor: "#f0f0f0",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  hourLabel: {
    width: 40,
    textAlign: "center",
  },
  intervalRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: 23,
    height: 23,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
  },
  cellText: {
    color: "#fff",
    fontSize: 10,
  },
  toggleButton: {
    width: 23,
    height: 23,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "blue",
    margin: 2,
  },
});

export default SwitchMatrix;
