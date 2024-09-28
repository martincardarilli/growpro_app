import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Switch, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { LinearGradient, Stop } from "react-native-svg";
import Slider from "@react-native-community/slider"; // Si tu proyecto usa una versión más reciente de React Native

const ChartHistory = () => {
  const customDataPoint = () => {
    return (
      <View
        style={{
          width: 20,
          height: 20,
          backgroundColor: "white",
          borderWidth: 4,
          borderRadius: 10,
          borderColor: "green",
        }}
      />
    );
  };
  const customLabel = (val) => {
    return (
      <View style={{ width: 70, marginLeft: 7 }}>
        <Text style={{ color: "white", fontWeight: "bold" }}>{val}</Text>
      </View>
    );
  };

  let dataMax = [
    { value: 5, dataPointText: "1" },
    {
      value: 24,
      labelComponent: () => customLabel("24 Nov"),
      customDataPoint: customDataPoint,
      showStrip: true,
      stripHeight: 190,
      stripColor: "",
      dataPointLabelComponent: () => {
        return (
          <View
            style={{
              backgroundColor: "black",
              paddingHorizontal: 8,
              paddingVertical: 5,
              borderRadius: 4,
            }}
          >
            <Text style={{ color: "white" }}>410</Text>
          </View>
        );
      },
      dataPointLabelShiftY: -70,
    },
    { value: 20, dataPointText: "", label: "03:00" },
    { value: 20, dataPointText: "4" },
    { value: 20, dataPointText: "5" },
    { value: 20, dataPointText: "6" },
    { value: 20, dataPointText: "30" },
    { value: 20, dataPointText: "8" },
    { value: 20, dataPointText: "9" },
    { value: 20, dataPointText: "10" },
    { value: 20, dataPointText: "11" },
    { value: 20, dataPointText: "12" },
  ];

  const dataProm = [
    { value: 5, dataPointText: "1" },
    {
      value: 24,
      labelComponent: () => customLabel("24 Nov"),
      customDataPoint: customDataPoint,
      showStrip: true,
      stripHeight: 190,
      stripColor: "black",
      dataPointLabelComponent: () => {
        return (
          <View
            style={{
              backgroundColor: "black",
              paddingHorizontal: 8,
              paddingVertical: 5,
              borderRadius: 4,
            }}
          >
            <Text style={{ color: "white" }}>410</Text>
          </View>
        );
      },
      dataPointLabelShiftY: -70,
    },
    { value: 15, dataPointText: "15" },
    { value: 35, dataPointText: "14" },
    { value: 10, dataPointText: "18" },
    { value: 25, dataPointText: "16" },
    { value: 30, dataPointText: "135" },
    { value: 18, dataPointText: "18" },
    { value: 32, dataPointText: "19" },
    { value: 20, dataPointText: "110" },
    { value: 5, dataPointText: "111" },
    { value: 37, dataPointText: "112" },
  ];

  const dataMin = [
    { value: 5, dataPointText: "1" },
    {
      value: 24,
      labelComponent: () => customLabel("24 Nov"),
      customDataPoint: customDataPoint,
      showStrip: true,
      stripHeight: 190,
      stripColor: "black",
      dataPointLabelComponent: () => {
        return (
          <View
            style={{
              backgroundColor: "black",
              paddingHorizontal: 8,
              paddingVertical: 5,
              borderRadius: 4,
            }}
          >
            <Text style={{ color: "white" }}>410</Text>
          </View>
        );
      },
      dataPointLabelShiftY: -70,
    },
    { value: 10, dataPointText: "" },
    { value: 35, dataPointText: "4" },
    { value: 10, dataPointText: "5" },
    { value: 25, dataPointText: "6" },
    { value: 30, dataPointText: "30" },
    { value: 18, dataPointText: "8" },
    { value: 32, dataPointText: "9" },
    { value: 20, dataPointText: "10" },
    { value: 5, dataPointText: "9" },
    { value: 37, dataPointText: "12" },
  ];

  const dataHumedadActual = [
    { value: 5, dataPointText: "1" },
    { value: 10, dataPointText: "" },
    { value: 35, dataPointText: "4" },
    { value: 10, dataPointText: "5" },
    { value: 25, dataPointText: "6" },
    { value: 30, dataPointText: "30" },
    { value: 18, dataPointText: "8" },
    { value: 32, dataPointText: "9" },
    { value: 20, dataPointText: "10" },
    { value: 5, dataPointText: "9" },
    { value: 37, dataPointText: "12" },
  ];

  const [dataTemperaturaActual, setDataTemperaturaActual] = useState([
    { value: 5, dataPointText: "1" },
    { value: 10, dataPointText: "" },
    { value: 35, dataPointText: "4" },
    { value: 10, dataPointText: "5" },
    { value: 25, dataPointText: "6" },
    { value: 30, dataPointText: "30" },
    { value: 18, dataPointText: "8" },
    { value: 32, dataPointText: "9" },
    { value: 20, dataPointText: "10" },
    { value: 5, dataPointText: "9" },
    { value: 37, dataPointText: "12" },
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
      <View style={styles.container} className=" rounded-lg mt-5">
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            {/* Agrega un Slider para controlar el spacing */}
            <Text>Zoom: {spacing}%</Text>
            <Slider
              style={{ width: 200, height: 40 }}
              minimumValue={10}
              maximumValue={100}
              step={1}
              value={spacing}
              onValueChange={(value) => setSpacing(value)} // Cambia el valor de spacing cuando se mueve el slider
              minimumTrackTintColor="#1EB1FC"
              maximumTrackTintColor="#8E8E93"
            />
          </View>
          {/* Switch para activar o desactivar el autoScroll */}
          <View style={styles.checkboxContainer}>
            <Text>Auto Scroll:</Text>
            <Switch
              value={autoScroll}
              onValueChange={(value) => setAutoScroll(value)} // Cambia el valor de autoScroll
            />
          </View>
        </View>
        <LineChart
          // Datos
          data={dataMax}
          data2={dataProm}
          data3={dataMin}
          // Style
          height={200}
          showVerticalLines
          verticalLinesStrokeDashArray={5}
          verticalLinesSpacing={spacing > 90 ? spacing * 0.25 : spacing}
          noOfVerticalLines={spacing > 90 ? dataMax.length * 4 : dataMax.length}
          verticalLinesShift={-spacing + 17}
          curved
          color={"#238B45"}
          dataPointsColor={"#005A32"}
          //#005A32
          // Linea
          thickness={5}
          // Puntos
          textShiftY={-8}
          textFontSize={15}
          // Eje X
          spacing={spacing}
          // Eje Y
          noOfSections={8}
          maxValue={40} // Asegura que el gráfico tenga espacio para los valores más altos
          // Color abajo de la linea
          /* startFillColor={"rgb(84,219,234)"}
        endFillColor={"rgb(84,219,234)"}
        startOpacity={1}
        endOpacity={0}
        areaChart */
          // Gradiente en la linea
          /* lineGradient
        lineGradientId="ggrd" // same as the id passed in <LinearGradient> below
        lineGradientComponent={() => {
          return (
            <LinearGradient id="ggrd" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={"blue"} />
              <Stop offset="0.5" stopColor={"orange"} />
              <Stop offset="1" stopColor={"green"} />
            </LinearGradient>
          );
        }} */
          highlightedRange={{
            from: 20,
            to: 30,
            color: "green",
            thickness: 5,
          }}
          highlightedRange2={{
            from: 30,
            to: 40,
            color: "red",
            thickness: 5,
          }}
          // Focus Puntero
          focusEnabled
          showStripOnFocus
          showTextOnFocus
          // Para scrollear hasta la derecha on Load - Ver: https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts/blob/master/docs/LineChart/LineChartProps.md
          //scrollToIndex
          //showScrollIndicator
          //scrollToEnd SOLO TRUE LA PRIMERA VEZ QUE SE RENDERIZA
          scrollToEnd={autoScroll}
          // Puntero on scroll horizontal
          pointerConfig={{
            pointerStripHeight: 160,
            pointerStripColor: "lightgray",
            pointerStripWidth: 2,
            pointerColor: "lightgray",
            radius: 6,
            pointerLabelWidth: 100,
            pointerLabelHeight: 90,
            activatePointersOnLongPress: true,
            persistPointer: true,
            autoAdjustPointerLabelPosition: false,
            pointerLabelComponent: (items) => {
              return (
                <View
                  style={{
                    height: 90,
                    width: 100,
                    justifyContent: "center",
                    marginTop: -30,
                    marginLeft: -40,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 14,
                      marginBottom: 6,
                      textAlign: "center",
                    }}
                  >
                    {items[0].date}
                  </Text>

                  <View
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 6,
                      borderRadius: 16,
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        fontSize: 10,
                      }}
                    >
                      {"MAX " + items[0].value + " °C"}
                    </Text>
                    <Text
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        fontSize: 21,
                      }}
                    >
                      {"" + items[1].value + " °C"}
                    </Text>
                    <Text
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        fontSize: 10,
                      }}
                    >
                      {"MIN " + items[2].value + " °C"}
                    </Text>
                  </View>
                </View>
              );
            },
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginTop: 10,
  },
});

export default ChartHistory;
