import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { NetworkInfo } from "react-native-network-info";
import useAppwrite from "../../lib/useAppwrite"; // Assuming useAppwrite is setup for fetching data
import { getAllDevices } from "../../lib/appwrite"; // Mock API call to get all devices
import ToFormButton from "../../components/devices/ToFormButton";

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
        reject(err); // Asegura que el error se maneje
      });
  });
};

// DeviceList Component (unificado con ScanNetwork)
const DeviceList = () => {
  const {
    data: knownDevices,
    refetch,
    isLoading: isDevicesLoading,
    error: devicesError,
  } = useAppwrite(getAllDevices); // Assuming getAllDevices fetches the devices from Appwrite

  const [refreshing, setRefreshing] = useState(false);
  const [localIp, setLocalIp] = useState(null);
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch known devices on mount
  useEffect(() => {
    NetworkInfo.getIPAddress().then((ip) => {
      setLocalIp(ip);
      console.log("Local IP:", ip);
      scanLocalNetwork(ip);
    });
  }, []);

  const scanLocalNetwork = async (localIp) => {
    // Limpiamos los dispositivos antes de hacer un nuevo escaneo
    setDevices([]);
    setIsLoading(true);

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

  const handleLocalRefresh = async () => {
    setRefreshing(true);
    const ip = await NetworkInfo.getIPAddress();
    setLocalIp(ip);
    console.log("Local IP Refresh:", ip);

    await refetch(); // Refresca los dispositivos conocidos desde la base de datos
    await scanLocalNetwork(ip); // Se vuelve a escanear la red local

    setRefreshing(false);
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
  const missingDevices = knownDevices?.filter(
    (knownDevice) => !foundMacAddresses.includes(knownDevice.MAC)
  );

  // Combinar dispositivos encontrados con los no encontrados
  const combinedDevices = [
    ...devices.map((item) => ({ ...item, found: true })), // Marcamos los dispositivos encontrados
    ...(missingDevices?.map((device) => ({ ...device, found: false })) || []), // Marcamos los dispositivos no encontrados
  ];

  // Mostrar el indicador de carga solo si no estamos haciendo "pull-to-refresh"
  if ((isDevicesLoading || isLoading) && !refreshing) {
    return (
      <SafeAreaView className="bg-primary flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  // Mostrar un mensaje de error si falla la carga de los dispositivos
  if (devicesError) {
    return (
      <SafeAreaView className="bg-primary flex-1 justify-center items-center">
        <Text className="text-white">Failed to load devices</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary flex-1">
      <Text className="text-1xl p-5 text-white font-psemibold">
        IP Celular: {localIp}
      </Text>
      <FlatList
        data={combinedDevices}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          // Aplicar opacidad a los ítems si está en estado de refresco
          const itemStyle = {
            opacity: refreshing ? 0.5 : 1, // Cambia la opacidad durante el pull-to-refresh
          };
          if (item.found) {
            // Dispositivos encontrados en el escaneo
            const macAddress = parseDeviceResponse(item.response);
            if (!macAddress) {
              return (
                <View
                  className="p-4 bg-red-800 mb-4 rounded-lg"
                  style={itemStyle}
                >
                  <Text className="text-white">
                    {item.ip} Respuesta no válida o mal formada: {item.response}
                  </Text>
                </View>
              );
            }

            const knownDevice = isKnownDevice(macAddress);
            const ipChanged = knownDevice && knownDevice.ip !== item.ip;

            return (
              <View
                className="p-4 bg-gray-800 mb-4 rounded-lg"
                style={itemStyle}
              >
                <Text className="text-white">
                  {knownDevice
                    ? "Dispositivo conocido"
                    : "(?) Dispositivo desconocido"}
                </Text>
                {knownDevice && (
                  <Text className="text-white">
                    {ipChanged
                      ? "! La IP local ha cambiado"
                      : "La IP local es la misma"}
                  </Text>
                )}
                <Text className="text-white font-bold">IP: {item.ip}</Text>
                <Text className="text-white mb-5">MAC: {macAddress}</Text>
                <Text className="text-white" style={{ fontSize: 10 }}>
                  Respuesta:{" "}
                  {JSON.stringify(JSON.parse(item.response), null, 3)}
                </Text>
              </View>
            );
          } else {
            // Dispositivos conocidos no encontrados
            return (
              <View
                key={item.MAC}
                className="p-4 bg-red-800 mb-4 rounded-lg"
                style={itemStyle}
              >
                <Text className="text-white font-bold">MAC: {item.MAC}</Text>
                <Text className="text-white">
                  Model: {item.model || "Unknown Model"}
                </Text>
                <Text className="text-white">
                  Última IP conocida: {item.ip || "N/A"}
                </Text>
                <Text className="text-white">No se encontró en la red.</Text>
              </View>
            );
          }
        }}
        ListEmptyComponent={() => (
          <Text className="text-white mt-2 text-center">No devices found.</Text>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleLocalRefresh}
            tintColor="#ffffff"
          />
        }
      />
      <ToFormButton />
    </SafeAreaView>
  );
};

export default DeviceList;
