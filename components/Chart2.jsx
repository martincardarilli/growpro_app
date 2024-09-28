import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Switch, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { LinearGradient, Stop } from "react-native-svg";
import Slider from "@react-native-community/slider"; // Si tu proyecto usa una versión más reciente de React Native

import ChartHistory from "./ChartHistory";

const SimpleLineChart = () => {
  const [IP, setIP] = useState("http://192.168.100.73");

  const [currentTemperature, setCurrentTemperature] = useState("");

  const [currentHumidity, setCurrentHumidity] = useState("");

  const customDataPointTemperature = () => {
    return (
      <View
        style={{
          width: 8,
          height: 8,
          backgroundColor: "#238B45",
          borderWidth: 4,
          borderRadius: 10,
          borderColor: "#238B45",
        }}
      />
    );
  };

  const customDataPointHumidity = () => {
    return (
      <View
        style={{
          width: 8,
          height: 8,
          backgroundColor: "#0077b6",
          borderWidth: 4,
          borderRadius: 10,
          borderColor: "#0077b6",
        }}
      />
    );
  };

  const customLabel = (val) => {
    return (
      <View style={{ width: 70, marginLeft: 7 }}>
        <Text style={{ color: "lightgray", fontWeight: "bold" }}>{val}</Text>
      </View>
    );
  };

  // Función para leer la temperatura actual
  const readTemperature = () => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const newValue = this.responseText;

        setCurrentTemperature(newValue);

        setDataTemperaturaActual((prevData) => {
          const updatedData = prevData.map((item, index) => {
            // Elimina el formato especial de los valores anteriores
            return {
              ...item,
              showStrip: false,
              dataPointLabelComponent: null,
            };
          });

          // Agrega el nuevo valor con el formato personalizado
          return [
            ...updatedData,
            {
              value: parseInt(newValue),
              dataPointText: newValue,
              //labelComponent: () => customLabel(`${new Date().getDate()} Nov`),
              // customDataPoint: customDataPointTemperature,
              showStrip: true,
              stripHeight: 190,
              stripColor: "lightgray", // Puedes definir un color aquí
            },
          ];
        });

        console.log("Temperature updated: " + this.responseText);
      }
    };
    xhttp.open("GET", `${IP}/temperature`, true);
    xhttp.send();
  };

  const readHumidity = () => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const newValue = this.responseText;

        setCurrentHumidity(newValue);

        setDataHumedadActual((prevData) => {
          const updatedData = prevData.map((item, index) => {
            // Elimina el formato especial de los valores anteriores
            return {
              ...item,
              showStrip: false,
              dataPointLabelComponent: null,
            };
          });

          // Agrega el nuevo valor con el formato personalizado
          return [
            ...updatedData,
            {
              value: parseInt(newValue),
              dataPointText: newValue,
              //labelComponent: () => customLabel(`${new Date().getDate()} Nov`),
              // customDataPoint: customDataPointHumidity,
              showStrip: true,
              stripHeight: 190,
              stripColor: "lightgray", // Puedes definir un color aquí
            },
          ];
        });

        console.log("Humedad updated: " + this.responseText);
      }
    };
    xhttp.open("GET", `${IP}/humidity`, true);
    xhttp.send();
  };

  useEffect(() => {
    const temperatureIntervalId = setInterval(readTemperature, 5000);
    const humidityIntervalId = setInterval(readHumidity, 5000);

    return () => {
      clearInterval(temperatureIntervalId);
      clearInterval(humidityIntervalId);
    };
  }, []);

  const [dataHumedadActual, setDataHumedadActual] = useState([
    { value: 50, dataPointText: "" },
  ]);

  const [dataTemperaturaActual, setDataTemperaturaActual] = useState([
    { value: 20, dataPointText: "" },
  ]);

  const [spacing, setSpacing] = useState(30); // Estado para controlar el valor de spacing
  const [autoScroll, setAutoScroll] = useState(true); // Estado para controlar el autoScroll

  // Función para generar un número aleatorio entre min y max
  const generateRandomValue = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Simula la llegada de nuevos datos aleatorios cada 2 segundos
  /*useEffect(() => {
    const interval = setInterval(() => {
      const newValue = generateRandomValue(5, 40); // Valores entre 5 y 40
      setDataTemperaturaActual((prevData) => [
        ...prevData,
        { value: newValue, dataPointText: `${prevData.length + 1}` },
      ]);
    }, 5000); // Cambia a un valor más pequeño si quieres más rapidez

    // Limpia el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);*/

  const screenWidth = Dimensions.get("window").width;

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            width: screenWidth * 0.45,
            backgroundColor: "white",
            marginRight: 10,
            paddingTop: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
          className=" rounded-lg"
        >
          <Text
            className="text-3xl font-psemibold mb-2"
            style={{
              position: "absolute",
              color: "black",
              zIndex: 2,
            }}
          >
            {currentHumidity} %
          </Text>
          <LineChart
            style={{
              paddingBottom: -20,
            }}
            data={dataHumedadActual}
            width={120}
            height={80}
            noOfSections={4}
            maxValue={100}
            scrollToEnd={true}
            spacing={50}
            xAxisColor="lightgray"
            yAxisColor="lightgray"
            curved
            //hideDataPoints
            //hideYAxisText
            hideXAxisText
            textShiftY={-8}
            textFontSize={12}
            textColor="black"
            color="#0077b6"
            dataPointsColor={"#0077b6"}
            yAxisTextStyle={{ color: "gray", fontSize: 10 }}
          />
        </View>
        <View
          style={{
            width: screenWidth * 0.45,
            backgroundColor: "white",
            marginRight: 10,
            paddingTop: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
          className=" rounded-lg"
        >
          <Text
            className="text-3xl font-psemibold mb-2"
            style={{
              position: "absolute",
              color: "black",
              zIndex: 2,
            }}
          >
            {currentTemperature} °C
          </Text>
          <LineChart
            style={{
              paddingBottom: -20,
            }}
            data={dataTemperaturaActual}
            width={150}
            height={80}
            noOfSections={4}
            scrollToEnd={true}
            spacing={50}
            xAxisColor="lightgray"
            yAxisColor="lightgray"
            curved
            maxValue={40}
            //hideDataPoints
            //hideYAxisText
            hideXAxisText
            textShiftY={-8}
            textFontSize={12}
            textColor="black"
            color="green"
            dataPointsColor={"green"}
            yAxisTextStyle={{ color: "gray", fontSize: 10 }}
          />
        </View>
      </View>

      <ChartHistory />
    </View>
  );
};

export default SimpleLineChart;
