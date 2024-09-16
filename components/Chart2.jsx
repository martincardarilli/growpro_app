import React, { useRef, useEffect } from "react";
import { SvgChart } from "@wuba/react-native-echarts";
import * as echarts from "echarts/core";

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
      type: "bar",
    },
  ],
};

export default function Chart2() {
  const chartRef = useRef(null);

  useEffect(() => {
    let chart;
    if (chartRef.current) {
      chart = echarts.init(chartRef.current, "light", {
        renderer: "svg",
        width: 300,
        height: 300,
      });
      chart.setOption(option);
    }
    return () => chart?.dispose();
  }, []);

  return <SvgChart ref={chartRef} />;
}
