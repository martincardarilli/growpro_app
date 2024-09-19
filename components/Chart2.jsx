import React from "react";
import { View, StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const LineChartExample = () => {
  const data = [
    { value: 50, label: "Jan" },
    { value: 80, label: "Feb" },
    { value: 40, label: "Mar" },
    { value: 95, label: "Apr" },
    { value: 85, label: "May" },
    { value: 70, label: "Jun" },
  ];

  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        thickness={2}
        color="#6a5acd"
        curved
        hideRules
        showVerticalLines
        adjustToWidth
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

export default LineChartExample;
