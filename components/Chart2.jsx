import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const SimpleLineChart = () => {
  const customDataPoint = () => {
    return (
      <View
        style={{
          width: 20,
          height: 20,
          backgroundColor: "white",
          borderWidth: 4,
          borderRadius: 10,
          borderColor: "#07BAD1",
        }}
      />
    );
  };
  const customLabel = (val) => {
    return (
      <View style={{ width: 70, marginLeft: 7 }}>
        <Text style={{ color: "white", fontWeight: "bold" }}>{val}</Text>
      </View>
    );
  };
  const data = [
    { value: 5, dataPointText: "1" },
    {
      value: 24,
      labelComponent: () => customLabel("24 Nov"),
      customDataPoint: customDataPoint,
      showStrip: true,
      stripHeight: 190,
      stripColor: "black",
      dataPointLabelComponent: () => {
        return (
          <View
            style={{
              backgroundColor: "black",
              paddingHorizontal: 8,
              paddingVertical: 5,
              borderRadius: 4,
            }}
          >
            <Text style={{ color: "white" }}>410</Text>
          </View>
        );
      },
      dataPointLabelShiftY: -70,
      dataPointLabelShiftX: -4,
    },
    { value: 15, dataPointText: "3" },
    { value: 35, dataPointText: "4" },
    { value: 10, dataPointText: "5" },
    { value: 25, dataPointText: "6" },
    { value: 30, dataPointText: "30" },
    { value: 18, dataPointText: "8" },
    { value: 32, dataPointText: "9" },
    { value: 20, dataPointText: "10" },
    { value: 5, dataPointText: "11" },
    { value: 37, dataPointText: "12" },
  ];

  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        thickness={2}
        color={"#FF9800"} // Comienza con un color naranja
        gradientColor={"#4CAF50"} // Transiciona al color verde
        curved
        hideRules
        adjustToWidth
        maxValue={40} // Asegura que el gráfico tenga espacio para los valores más altos
        lineGradient
        highlightedRange={{
          from: 5,
          to: 18,
          color: "green",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});

export default SimpleLineChart;
