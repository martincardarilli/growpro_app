import React, { useRef, useEffect } from "react";
import { SvgChart } from "@wuba/react-native-echarts"; // Import SvgChart
import * as echarts from "echarts/core"; // Core ECharts
import { SVGRenderer } from "echarts/renderers"; // SVG Renderer
import { LineChart } from "echarts/charts"; // Line Chart
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  DataZoomComponent,
} from "echarts/components"; // Import additional components
import { Dimensions } from "react-native"; // Import Dimensions to handle screen width

// Register the required components
echarts.use([
  SVGRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  DataZoomComponent,
]);

// Set dynamic width based on the screen size
const screenWidth = Dimensions.get("window").width;
const E_HEIGHT = 400;

const option = {
  title: {
    text: "Line Chart Example with Scroll",
  },
  tooltip: {
    trigger: "axis",
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
    name: "Temperature (°C)",
    min: 10,
    max: 40,
  },
  series: [
    {
      name: "Máximo",
      data: [
        18, 17, 15, 20, 28, 33, 30, 24, 20, 18, 17, 15, 20, 28, 33, 30, 24, 20,
        18, 17, 15, 20, 28, 33, 30, 24, 20,
      ],
      type: "line",
      smooth: true,
      lineStyle: {
        color: "red",
      },
    },
    {
      name: "Mínimo",
      data: [
        12, 12, 12, 14, 18, 22, 20, 16, 13, 12, 12, 12, 14, 18, 22, 20, 16, 13,
        12, 12, 12, 14, 18, 22, 20, 16, 13,
      ],
      type: "line",
      smooth: true,
      lineStyle: {
        color: "blue",
      },
    },
    {
      name: "Promedio",
      data: [
        15, 14.5, 13.5, 17, 23, 27.5, 25, 20, 16.5, 15, 14.5, 13.5, 17, 23,
        27.5, 25, 20, 16.5, 15, 14.5, 13.5, 17, 23, 27.5, 25, 20, 16.5,
      ],
      type: "line",
      smooth: true,
      lineStyle: {
        color: "green",
      },
    },
  ],
  legend: {
    data: ["Máximo", "Mínimo", "Promedio"],
  },
  dataZoom: [
    {
      type: "slider",
      start: 66, // Show the last 33% of data (24 hours)
      end: 100,
      zoomLock: false,
    },
  ],
};

const Chart2 = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    let chart;
    if (chartRef.current) {
      chart = echarts.init(chartRef.current, "light", {
        renderer: "svg", // Ensure SVG rendering
        width: screenWidth, // Use screen width
        height: E_HEIGHT,
      });
      chart.setOption(option);
    }
    return () => chart?.dispose();
  }, []);

  return (
    <SvgChart ref={chartRef} style={{ width: screenWidth, height: E_HEIGHT }} />
  );
};

export default Chart2;
