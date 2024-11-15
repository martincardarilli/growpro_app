import {
  Text,
  Switch,
  View,
  ScrollView,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

import { Picker } from "@react-native-picker/picker";

import Chart2 from "../../components/Chart2";

import useAppwrite from "../../lib/useAppwrite"; // Assuming useAppwrite is setup for fetching data

import { getAllDevices } from "../../lib/appwrite"; // Import updateDevice function

const Grow = () => {
  const [isEnabled1, setIsEnabled1] = useState(false);
  const [isEnabled2, setIsEnabled2] = useState(false);
  const [isEnabled3, setIsEnabled3] = useState(false);
  const [isEnabled4, setIsEnabled4] = useState(false);

  // En mi casa es de 192.168.100.X
  const [IP, setIP] = useState("http://192.168.0.111");

  // En lo de lohse es 192.168.0.X
  //const [IP, setIP] = useState("http://192.168.0.108");
  const [currentTime, setCurrentTime] = useState("");

  // Estados para los nombres de los fotoperiodos
  const [nombreFotoperiodo1, setNombreFotoperiodo1] = useState("Fotoperiodo 1");
  const [nombreFotoperiodo2, setNombreFotoperiodo2] = useState("Fotoperiodo 2");

  // Estados para los horarios de los fotoperiodos
  const [horaEncendido1, setHoraEncendido1] = useState("");
  const [horaApagado1, setHoraApagado1] = useState("");
  const [horaEncendido2, setHoraEncendido2] = useState("");
  const [horaApagado2, setHoraApagado2] = useState("");
  const [loading, setLoading] = useState(true);

  const toggleModo1 = () => {
    setModo1((prevModo) => (prevModo === "Fot." ? "Vie." : "Fot."));
  };

  const toggleModo2 = () => {
    setModo2((prevModo) => (prevModo === "Fot." ? "Vie." : "Fot."));
  };

  // Funciones para manejar los toggles
  const toggleSwitch1 = () => {
    setIsEnabled1((previousState) => !previousState);
    setWind(0, !isEnabled1);
  };

  const toggleSwitch2 = () => {
    setIsEnabled2((previousState) => !previousState);
    setWind(1, !isEnabled2);
  };

  // Funciones para manejar los toggles
  const toggleSwitch3 = () => {
    setIsEnabled3((previousState) => !previousState);
    setWind(2, !isEnabled3);
  };

  const toggleSwitch4 = () => {
    setIsEnabled4((previousState) => !previousState);
    setWind(3, !isEnabled4);
  };

  // Función para enviar el estado del viento al servidor
  const setWind = (index, boolean) => {
    console.log(`${selectedIP}/prenderSwitch${index + 1}`);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log(`Wind for Fotoperiodo ${index} updated: ` + boolean);
      }
    };
    if (boolean == true) {
      xhttp.open("GET", `${selectedIP}/prenderSwitch${index + 1}`, true);
    } else {
      xhttp.open("GET", `${selectedIP}/apagarSwitch${index + 1}`, true);
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

  const loadInitialState = () => {
    var xhttp = new XMLHttpRequest();

    // Establecer un timeout de 5 segundos (5000 ms)
    xhttp.timeout = 1000;

    let errorHandled = false; // Variable para evitar mostrar múltiples errores

    const handleRequestError = () => {
      if (!errorHandled) {
        console.error(
          "Error al cargar los datos del Arduino o timeout alcanzado."
        );
        errorHandled = true;

        // Usar datos simulados si la solicitud falla
        const simulatedResponse = {
          fotoperiodo1: {
            nombre: "Fotoperiodo 1",
            estado: 1,
            horaEncendido: 6,
            minutoEncendido: 0,
            horaApagado: 18,
            minutoApagado: 0,
          },
          fotoperiodo2: {
            nombre: "Fotoperiodo 2",
            estado: 0,
            horaEncendido: 7,
            minutoEncendido: 0,
            horaApagado: 19,
            minutoApagado: 0,
          },
        };

        console.log("Using simulated response:", simulatedResponse);

        setNombreFotoperiodo1(simulatedResponse.fotoperiodo1.nombre);
        setIsEnabled1(simulatedResponse.fotoperiodo1.estado === 1);
        setHoraEncendido1(
          `${simulatedResponse.fotoperiodo1.horaEncendido}:${simulatedResponse.fotoperiodo1.minutoEncendido}`
        );
        setHoraApagado1(
          `${simulatedResponse.fotoperiodo1.horaApagado}:${simulatedResponse.fotoperiodo1.minutoApagado}`
        );

        setNombreFotoperiodo2(simulatedResponse.fotoperiodo2.nombre);
        setIsEnabled2(simulatedResponse.fotoperiodo2.estado === 1);
        setHoraEncendido2(
          `${simulatedResponse.fotoperiodo2.horaEncendido}:${simulatedResponse.fotoperiodo2.minutoEncendido}`
        );
        setHoraApagado2(
          `${simulatedResponse.fotoperiodo2.horaApagado}:${simulatedResponse.fotoperiodo2.minutoApagado}`
        );

        setLoading(false);
      }
    };

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
          handleRequestError();
        }
      }
    };

    // Manejo de errores por timeout
    xhttp.ontimeout = function () {
      handleRequestError();
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
      };
      const argentinaTime = new Intl.DateTimeFormat("es-AR", options).format(
        date
      );
      setCurrentTime(argentinaTime);
    };

    const intervalId = setInterval(updateCurrentTime, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const { data: knownDevices, isLoading, error } = useAppwrite(getAllDevices);
  const [selectedIP, setSelectedIP] = useState("");

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
    <SafeAreaView className="px-4 pt-6 bg-primary h-full flex flex-col">
      <ScrollView>
        <Text className="text-2xl text-white font-psemibold">GROW PRO</Text>

        {/* Dropdown to select IP */}
        <View
          className="bg-white p-5 rounded-lg mt-5 mb-5"
          style={{ height: 200 }}
        >
          <Text className="text-black">Seleccionar IP</Text>
          <Picker
            selectedValue={selectedIP}
            onValueChange={(itemValue) => setSelectedIP(itemValue)}
            style={{ height: 50, width: "100%" }}
          >
            <Picker.Item label="Seleccionar IP" value="" />
            {knownDevices?.map((device) => (
              <Picker.Item
                key={device.$id}
                label={`${device.model || "Device"} - ${device.ip}`}
                value={`http://${device.ip}`}
              />
            ))}
          </Picker>
        </View>

        {/* <Chart /> */}
        <Chart2 selectedIP={selectedIP} />

        {/* Fotoperiodo 1 */}
        <View className="bg-white p-5 rounded-lg mt-5">
          <View className="flex flex-row justify-between items-center">
            <TextInput
              placeholder="Nombre del Switch 1"
              value={nombreFotoperiodo1}
              onChangeText={setNombreFotoperiodo1}
              onEndEditing={() => saveFotoperiodoName(0, nombreFotoperiodo1)}
              className="bg-gray-200 p-2 rounded flex-1"
              style={{
                backgroundColor: "white",
                padding: 8,
                borderRadius: 4,
              }}
            />

            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled1 ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch1}
              value={isEnabled1}
            />
          </View>
        </View>

        {/* Fotoperiodo 2 */}
        <View className="bg-white p-5 rounded-lg mt-5">
          <View className="flex flex-row justify-between items-center">
            <TextInput
              placeholder="Nombre del Switch 2"
              value={nombreFotoperiodo2}
              onChangeText={setNombreFotoperiodo2}
              onEndEditing={() => saveFotoperiodoName(1, nombreFotoperiodo2)}
              className="bg-gray-200 p-2 rounded flex-1"
              style={{
                backgroundColor: "white",
                padding: 8,
                borderRadius: 4,
              }}
            />

            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled2 ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch2}
              value={isEnabled2}
            />
          </View>
        </View>

        {/* Fotoperiodo 2 */}
        <View className="bg-white p-5 rounded-lg mt-5">
          <View className="flex flex-row justify-between items-center">
            <TextInput
              placeholder="Nombre del Switch 2"
              className="bg-gray-200 p-2 rounded flex-1"
              style={{
                backgroundColor: "white",
                padding: 8,
                borderRadius: 4,
              }}
            />

            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled3 ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch3}
              value={isEnabled3}
            />
          </View>
        </View>

        {/* Fotoperiodo 2 */}
        <View className="bg-white p-5 rounded-lg mt-5">
          <View className="flex flex-row justify-between items-center">
            <TextInput
              placeholder="Nombre del Switch 2"
              className="bg-gray-200 p-2 rounded flex-1"
              style={{
                backgroundColor: "white",
                padding: 8,
                borderRadius: 4,
              }}
            />

            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled4 ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch4}
              value={isEnabled4}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Grow;
