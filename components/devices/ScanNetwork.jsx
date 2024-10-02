import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { NetworkInfo } from "react-native-network-info";

const ScanNetwork = () => {
  const [localIp, setLocalIp] = useState(null);
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Obtener la IP local
    NetworkInfo.getIPAddress().then((ip) => {
      setLocalIp(ip);
      console.log("Local IP:", ip);
      scanLocalNetwork(ip);
    });
  }, []);

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

  const scanLocalNetwork = async (localIp) => {
    // Obtener el rango de la IP local (ej: 192.168.100.x)
    const ipParts = localIp.split(".");
    const baseIp = "192.168.100"; // Hardcodeado para la red específica
    let devicesFound = [];

    // Crear promesas para escanear todas las IPs en el rango de la red local (de 1 a 254)
    const scanPromises = [];
    for (let i = 70; i <= 254; i++) {
      const testIp = `${baseIp}.${i}`;
      scanPromises.push(
        fetchWithTimeout(`http://${testIp}/status`, { method: "GET" }, 2000) // Timeout de 2 segundos
          .then(async (response) => {
            if (response.ok) {
              // Leer el cuerpo de la respuesta
              const responseBody = await response.text();
              console.log(`Dispositivo encontrado en ${testIp}`);
              console.log(`Respuesta: ${responseBody}`);
              devicesFound.push({ ip: testIp, response: responseBody });
            }
          })
          .catch((err) => {
            console.log(`IP ${testIp} no encontrada o timeout: ${err.message}`);
          })
      );
    }

    // Ejecutar todas las promesas de forma asíncrona
    await Promise.all(scanPromises);

    // Si se encontraron dispositivos, actualiza el estado
    if (devicesFound.length > 0) {
      setDevices(devicesFound);
    } else {
      console.log("No se encontraron dispositivos");
    }

    // Marcar como completo el proceso de escaneo
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="bg-primary flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary flex-1">
      <FlatList
        data={devices}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="p-4 bg-gray-800 mb-4 rounded-lg">
            <Text className="text-white font-bold">IP: {item.ip}</Text>
            <Text className="text-white">Respuesta: {item.response}</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text className="text-white mt-2 text-center">No devices found.</Text>
        )}
      />
    </SafeAreaView>
  );
};

export default ScanNetwork;
