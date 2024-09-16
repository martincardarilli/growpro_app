import React, { useRef, useEffect } from "react";
import { SvgChart } from "@wuba/react-native-echarts"; // Import SvgChart
import * as echarts from "echarts/core"; // Core ECharts
import { SVGRenderer } from "echarts/renderers"; // Import the SVG renderer
import { BarChart } from "echarts/charts"; // Import the chart type (BarChart, LineChart, etc.)
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
} from "echarts/components"; // Import additional components

// Register the required components
echarts.use([
  SVGRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
]);

const option = {
  title: {
    text: "ECharts Example",
  },
  tooltip: {
    trigger: "axis",
  },
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: "bar", // Define the chart type
    },
  ],
};

const Chart2 = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    let chart;
    if (chartRef.current) {
      // Initialize the chart using the renderer
      chart = echarts.init(chartRef.current, "light", {
        renderer: "svg", // Use SVG renderer
        width: 300,
        height: 300,
      });
      chart.setOption(option); // Set the chart options
    }
    return () => chart?.dispose(); // Clean up the chart instance
  }, []);

  return <SvgChart ref={chartRef} />;
};

export default Chart2;
