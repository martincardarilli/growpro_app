import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import ChartHistory from "./ChartHistory";

const SimpleLineChart = () => {
  const [IP, setIP] = useState("http://192.168.100.76");
  const [currentTemperature, setCurrentTemperature] = useState("");
  const [currentHumidity, setCurrentHumidity] = useState("");
  const [currentDPV, setCurrentDPV] = useState(0); // Estado para el DPV

  const [dataHumedadActual, setDataHumedadActual] = useState([{ value: 50 }]);
  const [dataTemperaturaActual, setDataTemperaturaActual] = useState([
    { value: 20 },
  ]);
  const [dataDPVActual, setDataDPVActual] = useState([{ value: 0 }]); // Estado para los datos de DPV

  const screenWidth = Dimensions.get("window").width;

  // Función para calcular el DPV
  const calculateDPV = (temp, hum) => {
    const es = 0.6108 * Math.exp((17.27 * temp) / (temp + 237.3)); // presión de vapor de saturación
    const ea = (hum / 100.0) * es; // presión de vapor real
    return es - ea; // DPV
  };

  const readTemperature = () => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const newValue = this.responseText;
        setCurrentTemperature(newValue);

        setDataTemperaturaActual((prevData) => [
          ...prevData,
          { value: parseInt(newValue) },
        ]);

        updateDPV(parseInt(newValue), currentHumidity);
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

        setDataHumedadActual((prevData) => [
          ...prevData,
          { value: parseInt(newValue) },
        ]);

        updateDPV(currentTemperature, parseInt(newValue));
      }
    };
    xhttp.open("GET", `${IP}/humidity`, true);
    xhttp.send();
  };

  const updateDPV = (temp, hum) => {
    if (temp && hum) {
      const dpvValue = calculateDPV(temp, hum);
      setCurrentDPV(dpvValue);
      setDataDPVActual((prevData) => [...prevData, { value: dpvValue }]);
    }
  };

  useEffect(() => {
    const temperatureIntervalId = setInterval(readTemperature, 5000);
    const humidityIntervalId = setInterval(readHumidity, 5000);

    return () => {
      clearInterval(temperatureIntervalId);
      clearInterval(humidityIntervalId);
    };
  }, []);

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

      {/* Gráfico de DPV */}
      <View
        style={{
          width: screenWidth * 0.9,
          backgroundColor: "white",
          marginVertical: 10,
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
          DPV: {currentDPV.toFixed(2)} kPa
        </Text>
        <LineChart
          data={dataDPVActual}
          width={screenWidth * 0.9}
          height={100}
          noOfSections={4}
          scrollToEnd={true}
          spacing={50}
          xAxisColor="lightgray"
          yAxisColor="lightgray"
          curved
          maxValue={3}
          minValue={0}
          hideXAxisText
          textShiftY={-8}
          textFontSize={12}
          textColor="black"
          color="red"
          dataPointsColor={"red"}
          yAxisTextStyle={{ color: "gray", fontSize: 10 }}
        />
      </View>

      <ChartHistory />
    </View>
  );
};

export default SimpleLineChart;
