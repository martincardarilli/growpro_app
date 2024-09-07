import React from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions, View, Text, ScrollView } from "react-native";

const screenWidth = Dimensions.get("window").width;

const data = {
  labels: [
    "12 AM",
    "3 AM",
    "6 AM",
    "9 AM",
    "12 PM",
    "3 PM",
    "6 PM",
    "9 PM",
    "12 AM",
    "3 AM",
    "6 AM",
  ], // Datos extra para mostrar el scroll
  datasets: [
    {
      data: [15, 14.5, 13.5, 17, 23, 27.5, 25, 20, 18, 22, 30],
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Color opcional
      strokeWidth: 2, // Grosor de la línea
    },
    {
      data: [12, 12, 12, 14, 18, 22, 20, 16, 19, 25, 29],
      color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // Color opcional
      strokeWidth: 2, // Grosor de la línea
    },
    {
      data: [18, 17, 15, 20, 28, 33, 30, 24, 21, 29, 35],
      color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Color opcional
      strokeWidth: 2, // Grosor de la línea
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // Grosor de la línea
  barPercentage: 0.5,
};

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 18, textAlign: "center", marginVertical: 10 }}>
        Line Chart Example
      </Text>

      {/* Habilitamos el ScrollView horizontal */}
      <ScrollView horizontal={true}>
        <View style={{ width: screenWidth * 2 }}>
          {/* Duplicamos el ancho para permitir el scroll horizontal */}
          <LineChart
            data={data}
            width={screenWidth * 1.8} // Ajustamos el ancho del gráfico para que sea desplazable
            height={300} // Altura del gráfico
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
