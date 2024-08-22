import { Text, Switch, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

const Grow = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [IP, setIP] = useState("http://192.168.0.110");
  const [currentTime, setCurrentTime] = useState("");
  const [currentTemperature, setCurrentTemperature] = useState("");

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    setWind(!isEnabled); // Llama a tu función setWind aquí
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

    const temperatureIntervalId = setInterval(readTemperature, 5000); // Lee la temperatura cada 5 segundos

    return () => {
      clearInterval(intervalId);
      clearInterval(temperatureIntervalId); // Limpia el intervalo de temperatura
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
    </SafeAreaView>
  );
};

export default Grow;
