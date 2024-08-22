import { Text, Switch, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

const Grow = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [IP, setIP] = useState("http://192.168.0.110");
  const [currentTime, setCurrentTime] = useState("");

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

  const readTemperature = () => {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log("Reading temperature");
      }
    };

    xhttp.open("GET", `${IP}/temperature`, true);
    xhttp.send();
  };

  useEffect(() => {
    const updateCurrentTime = () => {
      const date = new Date();
      const gmt3Time = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000 - 3 * 3600000
      );
      setCurrentTime(gmt3Time.toLocaleTimeString());
    };

    const intervalId = setInterval(updateCurrentTime, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <SafeAreaView className="px-4 my-6 bg-primary h-full flex flex-col">
      <Text className="text-2xl text-white font-psemibold">GROW PRO</Text>

      <View className="flex flex-row bg-white p-5 rounded-lg justify-between">
        <Text className="text-2xl text-black font-psemibold">Ventilación</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      <Text className="text-2xl text-white font-psemibold mt-4">
        Hora Actual: {currentTime}
      </Text>
    </SafeAreaView>
  );
};

export default Grow;
