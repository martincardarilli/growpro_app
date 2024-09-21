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
          borderColor: "green",
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
        thickness={5}
        textFontSize={15}
        textShiftY={-8}
        color={"blue"} // Comienza con un color naranja
        curved
        maxValue={40} // Asegura que el gráfico tenga espacio para los valores más altos
        lineGradient
        highlightedRange={{
          from: 5,
          to: 20,
          color: "blue",
        }}
        pointerConfig={{
          pointerStripHeight: 160,
          pointerStripColor: "lightgray",
          pointerStripWidth: 2,
          pointerColor: "lightgray",
          radius: 6,
          pointerLabelWidth: 100,
          pointerLabelHeight: 90,
          activatePointersOnLongPress: true,
          persistPointer: true,
          autoAdjustPointerLabelPosition: false,
          pointerLabelComponent: (items) => {
            return (
              <View
                style={{
                  height: 90,
                  width: 100,
                  justifyContent: "center",
                  marginTop: -30,
                  marginLeft: -40,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 14,
                    marginBottom: 6,
                    textAlign: "center",
                  }}
                >
                  {items[0].date}
                </Text>

                <View
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    borderRadius: 16,
                    backgroundColor: "lightgray",
                  }}
                >
                  <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                    {"$" + items[0].value + ".0"}
                  </Text>
                </View>
              </View>
            );
          },
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
    backgroundColor: "white",
  },
});

export default SimpleLineChart;
