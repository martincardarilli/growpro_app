import {
  Text,
  Switch,
  View,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

const Grow = () => {
  const [isEnabled1, setIsEnabled1] = useState(false);
  const [isEnabled2, setIsEnabled2] = useState(false);
  const [IP, setIP] = useState("http://192.168.0.110");
  const [currentTime, setCurrentTime] = useState("");
  const [currentTemperature, setCurrentTemperature] = useState("");

  // Estados para los nombres de los fotoperiodos
  const [nombreFotoperiodo1, setNombreFotoperiodo1] = useState("Fotoperiodo 1");
  const [nombreFotoperiodo2, setNombreFotoperiodo2] = useState("Fotoperiodo 2");

  // Estados para los horarios de los fotoperiodos
  const [horaEncendido1, setHoraEncendido1] = useState("");
  const [horaApagado1, setHoraApagado1] = useState("");
  const [horaEncendido2, setHoraEncendido2] = useState("");
  const [horaApagado2, setHoraApagado2] = useState("");
  const [loading, setLoading] = useState(true);

  // Funciones para manejar los toggles
  const toggleSwitch1 = () => {
    setIsEnabled1((previousState) => !previousState);
    setWind(0, !isEnabled1);
  };

  const toggleSwitch2 = () => {
    setIsEnabled2((previousState) => !previousState);
    setWind(1, !isEnabled2);
  };

  // Función para enviar el estado del viento al servidor
  const setWind = (index, boolean) => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log(`Wind for Fotoperiodo ${index} updated: ` + boolean);
      }
    };
    if (boolean == true) {
      xhttp.open("GET", `${IP}/prenderFotoperiodo${index + 1}`, true);
    } else {
      xhttp.open("GET", `${IP}/apagarFotoperiodo${index + 1}`, true);
    }
    xhttp.send();
  };

  // Función para guardar los horarios del fotoperiodo
  const saveFotoperiodo = (index, horaEncendido, horaApagado) => {
    const [horaEnc, minEnc] = horaEncendido.split(":").map(Number);
    const [horaApag, minApag] = horaApagado.split(":").map(Number);

    const url = `${IP}/setFotoperiodo?index=${index}&horaEncendido=${horaEnc}&minutoEncendido=${minEnc}&horaApagado=${horaApag}&minutoApagado=${minApag}`;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log(`Fotoperiodo ${index} updated`);
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
  };

  // Función para guardar el nombre del fotoperiodo
  const saveFotoperiodoName = (index, nombre) => {
    const url = `${IP}/setFotoperiodoName?index=${index}&nombre=${encodeURIComponent(
      nombre
    )}`;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log(`Nombre de Fotoperiodo ${index} actualizado a ${nombre}`);
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
  };

  // Función para leer la temperatura actual
  const readTemperature = () => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        setCurrentTemperature(this.responseText);
        console.log("Temperature updated: " + this.responseText);
      }
    };
    xhttp.open("GET", `${IP}/temperature`, true);
    xhttp.send();
  };

  const loadInitialState = () => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          const response = JSON.parse(this.responseText);
          console.log("Response from Arduino:", response);

          // Cargar nombres y estados de los Fotoperiodos
          setNombreFotoperiodo1(response.fotoperiodo1.nombre);
          setIsEnabled1(
            response.fotoperiodo1.estado === 1 ||
              response.fotoperiodo1.estado === "true"
          );
          setHoraEncendido1(
            `${response.fotoperiodo1.horaEncendido}:${response.fotoperiodo1.minutoEncendido}`
          );
          setHoraApagado1(
            `${response.fotoperiodo1.horaApagado}:${response.fotoperiodo1.minutoApagado}`
          );

          setNombreFotoperiodo2(response.fotoperiodo2.nombre);
          setIsEnabled2(
            response.fotoperiodo2.estado === 1 ||
              response.fotoperiodo2.estado === "true"
          );
          setHoraEncendido2(
            `${response.fotoperiodo2.horaEncendido}:${response.fotoperiodo2.minutoEncendido}`
          );
          setHoraApagado2(
            `${response.fotoperiodo2.horaApagado}:${response.fotoperiodo2.minutoApagado}`
          );

          setLoading(false);
        } else {
          console.error("Error al cargar los datos del Arduino:", this.status);
          alert(
            "No se pudieron cargar los datos del Arduino. Verifica la conexión."
          );
        }
      }
    };
    xhttp.open("GET", `${IP}/getFotoperiodos`, true);
    xhttp.send();
  };

  useEffect(() => {
    loadInitialState();

    const updateCurrentTime = () => {
      const date = new Date();
      const options = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "America/Argentina/Buenos_Aires",
      };
      const argentinaTime = new Intl.DateTimeFormat("es-AR", options).format(
        date
      );
      setCurrentTime(argentinaTime);
    };

    const intervalId = setInterval(updateCurrentTime, 1000);
    const temperatureIntervalId = setInterval(readTemperature, 5000);

    return () => {
      clearInterval(intervalId);
      clearInterval(temperatureIntervalId);
    };
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="px-4 my-6 bg-primary h-full flex flex-col justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-2xl text-white font-psemibold mt-4">
          Cargando...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="px-4 my-6 bg-primary h-full flex flex-col">
      <Text className="text-2xl text-white font-psemibold">GROW PRO</Text>
      <Text className="text-2xl text-white font-psemibold mt-4">
        Hora Actual: {currentTime}
      </Text>
      <Text className="text-2xl text-white font-psemibold mt-4">
        Temperatura Actual: {currentTemperature}°C
      </Text>

      {/* Fotoperiodo 1 */}
      <View className="bg-white p-5 rounded-lg mt-5">
        <TextInput
          placeholder="Nombre del Fotoperiodo 1"
          value={nombreFotoperiodo1}
          onChangeText={setNombreFotoperiodo1}
          onEndEditing={() => saveFotoperiodoName(0, nombreFotoperiodo1)}
          className="bg-gray-200 p-2 rounded mt-4"
        />
        <View className="flex flex-row justify-between items-center mt-4">
          <Text className="text-xl text-black font-psemibold">Ventilación</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled1 ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch1}
            value={isEnabled1}
          />
        </View>
        <TextInput
          placeholder="Hora de Encendido (HH:MM)"
          value={horaEncendido1}
          onChangeText={setHoraEncendido1}
          className="bg-gray-200 p-2 rounded mt-4"
        />
        <TextInput
          placeholder="Hora de Apagado (HH:MM)"
          value={horaApagado1}
          onChangeText={setHoraApagado1}
          className="bg-gray-200 p-2 rounded mt-4"
        />
        <Button
          title="Guardar"
          onPress={() => saveFotoperiodo(0, horaEncendido1, horaApagado1)}
          className="mt-4"
        />
      </View>

      {/* Fotoperiodo 2 */}
      <View className="bg-white p-5 rounded-lg mt-5">
        <TextInput
          placeholder="Nombre del Fotoperiodo 2"
          value={nombreFotoperiodo2}
          onChangeText={setNombreFotoperiodo2}
          onEndEditing={() => saveFotoperiodoName(1, nombreFotoperiodo2)}
          className="bg-gray-200 p-2 rounded mt-4"
        />
        <View className="flex flex-row justify-between items-center mt-4">
          <Text className="text-xl text-black font-psemibold">Ventilación</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled2 ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch2}
            value={isEnabled2}
          />
        </View>
        <TextInput
          placeholder="Hora de Encendido (HH:MM)"
          value={horaEncendido2}
          onChangeText={setHoraEncendido2}
          className="bg-gray-200 p-2 rounded mt-4"
        />
        <TextInput
          placeholder="Hora de Apagado (HH:MM)"
          value={horaApagado2}
          onChangeText={setHoraApagado2}
          className="bg-gray-200 p-2 rounded mt-4"
        />
        <Button
          title="Guardar"
          onPress={() => saveFotoperiodo(1, horaEncendido2, horaApagado2)}
          className="mt-4"
        />
      </View>
    </SafeAreaView>
  );
};

export default Grow;
