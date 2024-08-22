import { Text, Switch, View, TextInput, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

const Grow = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [IP, setIP] = useState("http://192.168.0.110");
  const [currentTime, setCurrentTime] = useState("");
  const [currentTemperature, setCurrentTemperature] = useState("");
  const [horaEncendido, setHoraEncendido] = useState("");
  const [horaApagado, setHoraApagado] = useState("");
  const [fotoperiodoIndex, setFotoperiodoIndex] = useState("");

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    setWind(!isEnabled);
  };

  const setWind = (boolean) => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log("Wind updated " + boolean);
      }
    };
    xhttp.open("GET", `${IP}/setviento?onoff=` + boolean, true);
    xhttp.send();
  };

  /* REFACTORY */
  const [isEnabled2, setIsEnabled2] = useState(false);

  const toggleSwitch2 = () => {
    setIsEnabled2((previousState) => !previousState);
    setWind2(!isEnabled2); // Llama a tu función setWind aquí
  };

  const setWind2 = (boolean) => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log("Wind updated " + boolean);
      }
    };
    xhttp.open("GET", `${IP}/setviento2?onoff=` + boolean, true);
    xhttp.send();
  };
  /* REFACTORY */

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

  const saveFotoperiodo = () => {
    const [horaEnc, minEnc] = horaEncendido.split(":").map(Number);
    const [horaApag, minApag] = horaApagado.split(":").map(Number);

    const url = `${IP}/setFotoperiodo?index=${fotoperiodoIndex}&horaEncendido=${horaEnc}&minutoEncendido=${minEnc}&horaApagado=${horaApag}&minutoApagado=${minApag}`;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log("Fotoperiodo updated");
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
  };

  useEffect(() => {
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

  return (
    <SafeAreaView className="px-4 my-6 bg-primary h-full flex flex-col">
      <Text className="text-2xl text-white font-psemibold">GROW PRO</Text>
      <Text className="text-2xl text-white font-psemibold mt-4">
        Hora Actual: {currentTime}
      </Text>
      <Text className="text-2xl text-white font-psemibold mt-4">
        Temperatura Actual: {currentTemperature}°C
      </Text>

      <View className="flex flex-row bg-white p-5 rounded-lg justify-between mt-5">
        <Text className="text-2xl text-black font-psemibold">Ventilación</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      <View className="flex flex-row bg-white p-5 rounded-lg justify-between mt-5">
        <Text className="text-2xl text-black font-psemibold">Ventilación</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled2 ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch2}
          value={isEnabled2}
        />
      </View>

      {/* Inputs para horarios y fotoperiodo index */}
      <View className="bg-white p-5 rounded-lg mt-5">
        <Text className="text-xl text-black font-psemibold">
          Fotoperiodo Index:
        </Text>
        <TextInput
          placeholder="Ej: 1"
          value={fotoperiodoIndex}
          onChangeText={setFotoperiodoIndex}
          className="bg-gray-200 p-2 rounded mt-2"
        />
        <Text className="text-xl text-black font-psemibold mt-4">
          Hora de Encendido:
        </Text>
        <TextInput
          placeholder="HH:MM"
          value={horaEncendido}
          onChangeText={setHoraEncendido}
          className="bg-gray-200 p-2 rounded mt-2"
        />
        <Text className="text-xl text-black font-psemibold mt-4">
          Hora de Apagado:
        </Text>
        <TextInput
          placeholder="HH:MM"
          value={horaApagado}
          onChangeText={setHoraApagado}
          className="bg-gray-200 p-2 rounded mt-2"
        />
        <Button title="Guardar" onPress={saveFotoperiodo} className="mt-4" />
      </View>
    </SafeAreaView>
  );
};

export default Grow;
