import React, { useRef, useEffect } from "react";
import { SvgChart } from "@wuba/react-native-echarts"; // Import SvgChart
import * as echarts from "echarts/core"; // Core ECharts
import { SVGRenderer } from "echarts/renderers"; // Import the SVG renderer
import { LineChart } from "echarts/charts"; // Import the LineChart instead of BarChart
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
} from "echarts/components"; // Import additional components

// Register the required components
echarts.use([
  SVGRenderer,
  LineChart, // Changed to LineChart to match your temperature data
  GridComponent,
  TooltipComponent,
  TitleComponent,
]);

const option = {
  title: {
    text: "Temperature Over Time",
  },
  tooltip: {
    trigger: "axis",
    formatter: "{b0}<br />Max: {c0}°C<br />Min: {c1}°C<br />Avg: {c2}°C",
  },
  xAxis: {
    type: "category",
    data: [
      "12 AM",
      "3 AM",
      "6 AM",
      "9 AM",
      "12 PM",
      "3 PM",
      "6 PM",
      "9 PM",
      "12 AM",
      "12 AM",
      "3 AM",
      "6 AM",
      "9 AM",
      "12 PM",
      "3 PM",
      "6 PM",
      "9 PM",
      "12 AM",
    ],
  },
  yAxis: {
    type: "value",
    min: 10,
    max: 40,
    name: "Temperature (°C)",
  },
  series: [
    {
      name: "Max",
      data: [
        18, 17, 15, 20, 28, 33, 30, 24, 20, 18, 17, 15, 20, 28, 33, 30, 24, 20,
      ],
      type: "line",
      smooth: true,
      lineStyle: { color: "red" },
    },
    {
      name: "Min",
      data: [
        12, 12, 12, 14, 18, 22, 20, 16, 13, 12, 12, 12, 14, 18, 22, 20, 16, 13,
      ],
      type: "line",
      smooth: true,
      lineStyle: { color: "blue" },
    },
    {
      name: "Avg",
      data: [
        15, 14.5, 13.5, 17, 23, 27.5, 25, 20, 16.5, 15, 14.5, 13.5, 17, 23,
        27.5, 25, 20, 16.5,
      ],
      type: "line",
      smooth: true,
      lineStyle: { color: "green" },
    },
  ],
  dataZoom: [
    {
      type: "slider",
      start: 66,
      end: 100,
    },
  ],
};

const Chart2 = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    let chart;
    if (chartRef.current) {
      chart = echarts.init(chartRef.current, "light", {
        renderer: "svg", // Use SVG renderer for Expo compatibility
        width: 300,
        height: 300,
      });
      chart.setOption(option); // Set chart options
    }
    return () => chart?.dispose(); // Clean up chart on unmount
  }, []);

  return <SvgChart ref={chartRef} />;
};

export default Chart2;
