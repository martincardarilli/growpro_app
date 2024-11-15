import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getAllDevices, postAutomatizacion } from "../../lib/appwrite";
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";

const CreateAutomation = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [selectedSwitchIndex, setSelectedSwitchIndex] = useState(null);

  const [form, setForm] = useState({
    titulo: "Automatización de Temperatura/Humedad",
    descripcion: "",
    tipoMedicion: "temperatura", // Por defecto, selecciona "temperatura"
    valorObjetivo: "25", // Valor predeterminado para temperatura
    rangoReaccion: "1", // Rango predeterminado para temperatura
  });

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const fetchedDevices = await getAllDevices();
        const parsedDevices = fetchedDevices.map((device) => {
          try {
            const status = JSON.parse(device.status);
            return {
              ...device,
              macAddress: status.device.mac_address,
              switches: status.switches || [],
            };
          } catch (error) {
            console.warn(`Error parsing status for device ${device.$id}:`, error);
            return {
              ...device,
              macAddress: "Unknown",
              switches: [],
              error: "Status malformed",
            };
          }
        });
        setDevices(parsedDevices);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices();
  }, []);

  const selectedDevice = devices.find((device) => device.$id === selectedDeviceId);
  const selectedSwitch = selectedDevice?.switches?.[selectedSwitchIndex];

  const handleDeviceChange = (deviceId) => {
    setSelectedDeviceId(deviceId);
    setSelectedSwitchIndex(null);
  };

  const handleSwitchChange = (switchIndex) => {
    setSelectedSwitchIndex(switchIndex);
  };

  const handleMeasurementTypeChange = (value) => {
    setForm({
      ...form,
      tipoMedicion: value,
      valorObjetivo: value === "temperatura" ? "25" : "50", // Valor predeterminado
      rangoReaccion: value === "temperatura" ? "1" : "10", // Rango de reacción predeterminado
    });
  };

  const configureSwitch = async () => {
    if (!selectedDevice || selectedSwitchIndex === null) {
      setUploading(false);
      return Alert.alert("Error", "Please select a device and a switch.");
    }

    const { tipoMedicion, valorObjetivo, rangoReaccion } = form;

    if (!valorObjetivo || !rangoReaccion) {
      return Alert.alert("Error", "Please provide both the target value and the reaction range.");
    }

    try {
      setUploading(true);
      const ipAddress = selectedDevice.ip;

      const configData = {
        tipo: tipoMedicion,
        valorObjetivo: parseFloat(valorObjetivo),
        rangoReaccion: parseFloat(rangoReaccion),
        valorEncendido: parseFloat(valorObjetivo) + parseFloat(rangoReaccion),
        valorApagado: parseFloat(valorObjetivo) - parseFloat(rangoReaccion),
      };

      const url = `http://${ipAddress}/setConfig?index=${selectedSwitchIndex}&config=${encodeURIComponent(
        JSON.stringify(configData)
      )}`;

      console.log("Attempting to configure switch with URL:", url);

      const xhttp = new XMLHttpRequest();
      xhttp.open("GET", url, true);
      xhttp.timeout = 10000;

      xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
          setUploading(false);
          if (xhttp.status === 200) {
            Alert.alert("Success", "Switch configuration updated on device");
          } else {
            console.error("Failed to update switch:", xhttp.responseText);
            Alert.alert("Error", "Failed to update switch on device.");
          }
        }
      };

      xhttp.send();
    } catch (error) {
      setUploading(false);
      console.error("Error updating switch on device:", error);
      Alert.alert("Error", "Failed to update switch on device.");
    }
  };

  // Calcular valores de encendido y apagado basados en el valor objetivo y el rango de reacción
  const valorEncendido = parseFloat(form.valorObjetivo) + parseFloat(form.rangoReaccion);
  const valorApagado = parseFloat(form.valorObjetivo) - parseFloat(form.rangoReaccion);

  const submit = async () => {
    const { titulo, descripcion, tipoMedicion, valorObjetivo, rangoReaccion } = form;
  
    if (!titulo || !descripcion) {
      return Alert.alert("Error", "Por favor, proporciona todos los campos: título y descripción.");
    }
  
    if (!valorObjetivo || !rangoReaccion) {
      return Alert.alert("Error", "Por favor, proporciona el valor objetivo y el rango de reacción.");
    }
  
    setUploading(true);
    try {
      await postAutomatizacion({
        titulo,
        descripcion,
        device: selectedDevice.macAddress,
        switch: String(selectedSwitchIndex),
        config: {
          tipo: tipoMedicion,
          valorObjetivo: parseFloat(valorObjetivo),
          rangoReaccion: parseFloat(rangoReaccion),
          valorEncendido: parseFloat(valorObjetivo) + parseFloat(rangoReaccion),
          valorApagado: parseFloat(valorObjetivo) - parseFloat(rangoReaccion),
        },
        userId: user.$id,
      });
  
      Alert.alert("Éxito", "Automatización creada exitosamente");
      router.push("/automatizaciones");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <SafeAreaView className="px-4 bg-primary h-full">
      <ScrollView>
        <Text className="text-2xl text-white font-semibold">Automatización:</Text>

        <Text className="text-lg text-white font-semibold mt-5">Select Measurement Type</Text>
        <Picker
          selectedValue={form.tipoMedicion}
          onValueChange={handleMeasurementTypeChange}
          style={{ color: "white", fontSize: 12 }}
        >
          <Picker.Item label="Temperature" value="temperatura" />
          <Picker.Item label="Humidity" value="humedad" />
        </Picker>

        <FormField
          title="Target Value"
          value={form.valorObjetivo}
          placeholder={`Enter target value (${form.tipoMedicion === "temperatura" ? "°C" : "%"})...`}
          keyboardType="numeric"
          handleChangeText={(e) => setForm({ ...form, valorObjetivo: e })}
          otherStyles="mt-5"
        />
        <FormField
          title="Reaction Range"
          value={form.rangoReaccion}
          placeholder={`Enter reaction range (${form.tipoMedicion === "temperatura" ? "°C" : "%"})...`}
          keyboardType="numeric"
          handleChangeText={(e) => setForm({ ...form, rangoReaccion: e })}
          otherStyles="mt-5"
        />

        {/* Mostrar aclaración de encendido/apagado */}
        <View className="mt-5">
          <Text className="text-lg text-white font-semibold">
            Aclaración: El switch se encenderá cuando {form.tipoMedicion === "temperatura" ? "la temperatura" : "la humedad"} alcance {valorEncendido}
            {form.tipoMedicion === "temperatura" ? "°C" : "%"} y se apagará cuando baje a {valorApagado}
            {form.tipoMedicion === "temperatura" ? "°C" : "%"}.
          </Text>
        </View>

        <FormField
          title="Title"
          value={form.titulo}
          placeholder="Enter title..."
          handleChangeText={(e) => setForm({ ...form, titulo: e })}
          otherStyles="mt-5"
        />
        <FormField
          title="Description"
          value={form.descripcion}
          placeholder="Enter description..."
          handleChangeText={(e) => setForm({ ...form, descripcion: e })}
          otherStyles="mt-5"
        />

        <Text className="text-lg text-white font-semibold mt-5">Select Device</Text>
        <Picker
          selectedValue={selectedDeviceId}
          onValueChange={handleDeviceChange}
          style={{ color: "white", fontSize: 12 }}
        >
          <Picker.Item label="Select a device" value={null} style={{ color: "white" }} />
          {devices.map((device) => (
            <Picker.Item
              key={device.$id}
              label={`${device.name || "Unknown"} (${device.model}: ${device.macAddress}) ${device.error ? " (Error in status)" : ""}`}
              value={device.$id}
              style={{ color: "white" }}
            />
          ))}
        </Picker>

        {selectedDevice && selectedDevice.switches && !selectedDevice.error && (
          <>
            <Text className="text-lg text-white font-semibold mt-5">Select Switch</Text>
            <Picker
              selectedValue={selectedSwitchIndex}
              onValueChange={handleSwitchChange}
              style={{ color: "white", fontSize: 12 }}
            >
              <Picker.Item label="Select a switch" value={null} style={{ color: "white" }} />
              {selectedDevice.switches.map((sw, idx) => (
                <Picker.Item key={idx} label={`${sw.nombre} (${idx + 1})`} value={idx} style={{ color: "white" }} />
              ))}
            </Picker>

            <CustomButton title="Configure Switch" handlePress={configureSwitch} containerStyles="mt-5" />
          </>
        )}

        <CustomButton title="Submit" handlePress={submit} containerStyles="mt-5" isLoading={uploading} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateAutomation;
