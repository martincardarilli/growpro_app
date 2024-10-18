import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router"; // Importa router de expo-router

const MainMenu = () => {
  return (
    <View style={styles.container} className="bg-primary h-full">
      <TouchableOpacity
        style={styles.box}
        className="bg-gray-800"
        onPress={() => router.push("/fotoperiodo")} // Usa router.push para navegación
      >
        <Text style={styles.boxText}>Fotoperiodo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.box}
        className="bg-gray-800"
        onPress={() => router.push("/intervalo")}
      >
        <Text style={styles.boxText}>Intervalo</Text>
      </TouchableOpacity> 

      <TouchableOpacity
        style={styles.box}
        className="bg-gray-800"
        onPress={() => router.push("/timerswitch")}
      >
        <Text style={styles.boxText}>Timer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.box}
        className="bg-gray-800"
        onPress={() => router.push("/causaefecto")}
      >
        <Text style={styles.boxText}>Causa/Efecto</Text>
      </TouchableOpacity>

          

      <TouchableOpacity
        disabled={true}
        style={styles.box}
        className="bg-gray-800 opacity-20"
        onPress={() => router.push("/PID")}
      >
        <Text style={styles.boxText}>PID</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 150,
  },
  box: {
    width: "40%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 10,
  },
  boxText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default MainMenu;
