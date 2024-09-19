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
  ],
  datasets: [
    {
      data: [15, 14.5, 13.5, 17, 23, 27.5, 25, 20, 18, 22, 30],
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
      strokeWidth: 2,
    },
    {
      data: [12, 12, 12, 14, 18, 22, 20, 16, 19, 25, 29],
      color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
      strokeWidth: 2,
    },
    {
      data: [18, 17, 15, 20, 28, 33, 30, 24, 21, 29, 35],
      color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
      strokeWidth: 2,
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
};

export default function Chart() {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 18, textAlign: "center", marginVertical: 10 }}>
        Line Chart Example
      </Text>
      <ScrollView horizontal={true}>
        <View style={{ width: screenWidth * 2 }}>
          <LineChart
            data={data}
            width={screenWidth * 1.8}
            height={300}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            yAxisColor="#0BA5A4"
            showVerticalLines
            verticalLinesColor="black"
            initialSpacing={0}
            spacing={30}
            textColor1="yellow"
            textShiftY={-8}
            textShiftX={-10}
            textFontSize={13}
            thickness={5}
            hideRules
            hideYAxisText
            xAxisColor="#0BA5A4"
            color="#0BA5A4"
          />
        </View>
      </ScrollView>
    </View>
  );
}
