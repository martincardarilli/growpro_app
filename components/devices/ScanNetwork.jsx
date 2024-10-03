import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { NetworkInfo } from "react-native-network-info";

const fetchWithTimeout = (url, options = {}, timeout = 2000) => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(
      () => reject(new Error("Request timed out")),
      timeout
    );

    fetch(url, options)
      .then((response) => {
        clearTimeout(timeoutId);
        resolve(response);
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        reject(err);
      });
  });
};

const ScanNetwork = ({ knownDevices }) => {
  const [localIp, setLocalIp] = useState(null);
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    NetworkInfo.getIPAddress().then((ip) => {
      setLocalIp(ip);
      console.log("Local IP:", ip);
      scanLocalNetwork(ip);
    });
  }, []);

  const scanLocalNetwork = async (localIp) => {
    const ipParts = localIp.split(".");
    const baseIp = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}`;
    let devicesFound = [];

    const scanPromises = [];
    for (let i = 2; i <= 254; i++) {
      const testIp = `${baseIp}.${i}`;
      scanPromises.push(
        fetchWithTimeout(`http://${testIp}/status`, { method: "GET" }, 2000)
          .then(async (response) => {
            if (response.ok) {
              const responseBody = await response.text();
              console.log(`Dispositivo encontrado en ${testIp}`);
              devicesFound.push({ ip: testIp, response: responseBody });
            }
          })
          .catch((err) => {
            console.log(`IP ${testIp} no encontrada o timeout: ${err.message}`);
          })
      );
    }

    await Promise.all(scanPromises);

    setDevices(devicesFound);
    setIsLoading(false);
  };

  const isKnownDevice = (deviceMAC) => {
    return knownDevices.find((device) => device.MAC === deviceMAC);
  };

  const parseDeviceResponse = (response) => {
    try {
      const parsedResponse = JSON.parse(response);
      if (
        parsedResponse.device &&
        typeof parsedResponse.device.mac_address === "string"
      ) {
        return parsedResponse.device.mac_address;
      }
    } catch (error) {
      console.error("Error al parsear la respuesta:", error);
    }
    return null;
  };

  const foundMacAddresses = devices.map((item) =>
    parseDeviceResponse(item.response)
  );

  // Filtrar los dispositivos conocidos que no fueron encontrados
  const missingDevices = knownDevices.filter(
    (knownDevice) => !foundMacAddresses.includes(knownDevice.MAC)
  );

  if (isLoading) {
    return (
      <SafeAreaView className="bg-primary flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary flex-1">
      <Text className="text-1xl p-5 text-white font-psemibold">
        IP Celular: {localIp}
      </Text>
      <FlatList
        data={devices}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const macAddress = parseDeviceResponse(item.response);
          if (!macAddress) {
            return (
              <View className="p-4 bg-red-800 mb-4 rounded-lg">
                <Text className="text-white">
                  {item.ip} Respuesta no válida o mal formada: {item.response}
                </Text>
              </View>
            );
          }

          const knownDevice = isKnownDevice(macAddress);
          const ipChanged = knownDevice && knownDevice.ip !== item.ip;

          return (
            <View className="p-4 bg-gray-800 mb-4 rounded-lg">
              <Text className="text-white font-bold">IP: {item.ip}</Text>
              <Text className="text-white">Respuesta: {item.response}</Text>

              <Text className="text-white">MAC: {macAddress}</Text>
              <Text className="text-white">
                {knownDevice
                  ? "Dispositivo conocido"
                  : "Dispositivo desconocido"}
              </Text>
              {knownDevice && (
                <Text className="text-white">
                  {ipChanged
                    ? "La IP local ha cambiado"
                    : "La IP local es la misma"}
                </Text>
              )}
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <Text className="text-white mt-2 text-center">No devices found.</Text>
        )}
      />

      {/* Mostrar los dispositivos conocidos que no fueron encontrados */}
      {missingDevices.length > 0 && (
        <View className="p-5">
          <Text className="text-1xl text-white font-psemibold">
            Dispositivos conocidos no encontrados:
          </Text>
          {missingDevices.map((device) => (
            <View key={device.MAC} className="p-4 bg-red-800 mb-4 rounded-lg">
              <Text className="text-white font-bold">MAC: {device.MAC}</Text>
              <Text className="text-white">
                Model: {device.model || "Unknown Model"}
              </Text>
              <Text className="text-white">
                Última IP conocida: {device.ip || "N/A"}
              </Text>
              <Text className="text-white">No se encontró en la red.</Text>
            </View>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

export default ScanNetwork;
