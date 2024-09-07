import React from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions, View, Text } from "react-native";

const screenWidth = Dimensions.get("window").width;

const data = {
  labels: ["12 AM", "3 AM", "6 AM", "9 AM", "12 PM", "3 PM", "6 PM", "9 PM"],
  datasets: [
    {
      data: [15, 14.5, 13.5, 17, 23, 27.5, 25, 20],
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
      strokeWidth: 2, // optional
    },
    {
      data: [12, 12, 12, 14, 18, 22, 20, 16],
      color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // optional
      strokeWidth: 2, // optional
    },
    {
      data: [18, 17, 15, 20, 28, 33, 30, 24],
      color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // optional
      strokeWidth: 2, // optional
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};

export default function App() {
  return (
    <View>
      <Text>Line Chart Example</Text>
      <LineChart
        data={data}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
}
