import React, { useRef, useEffect } from "react";
import { View, Dimensions } from "react-native";
import { echarts, SVGRenderer } from "@wuba/react-native-echarts";

echarts.use([SVGRenderer]);

const E_WIDTH = Dimensions.get("window").width;
const E_HEIGHT = 400;

const EChartComponent = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const option = {
      xAxis: { type: "category", data: ["A", "B", "C"] },
      yAxis: { type: "value" },
      series: [{ data: [820, 932, 901], type: "line" }],
    };

    const chart = echarts.init(chartRef.current, "light", {
      renderer: "svg",
      width: E_WIDTH,
      height: E_HEIGHT,
    });
    chart.setOption(option);

    return () => chart.dispose();
  }, []);

  return <View ref={chartRef} style={{ width: E_WIDTH, height: E_HEIGHT }} />;
};

export default EChartComponent;
