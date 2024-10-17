import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, Text, View, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { NetworkInfo } from 'react-native-network-info';
import useAppwrite from '../../lib/useAppwrite'; // Assuming useAppwrite is setup for fetching data
import { getAllDevices, updateDevice } from '../../lib/appwrite'; // Import updateDevice function
import ToFormButton from '../../components/devices/ToFormButton';

const fetchWithTimeout = (url, options = {}, timeout = 2000) => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(new Error('Request timed out')), timeout);

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

// DeviceList Component
const DeviceList = () => {
  const { data: knownDevices, refetch, isLoading: isDevicesLoading, error: devicesError } = useAppwrite(getAllDevices);

  const [refreshing, setRefreshing] = useState(false);
  const [localIp, setLocalIp] = useState(null);
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    NetworkInfo.getIPAddress().then((ip) => {
      setLocalIp(ip);
      console.log('Local IP:', ip);
      scanLocalNetwork(ip);
    });
  }, []);

  const scanLocalNetwork = async (localIp) => {
    setDevices([]);
    setIsLoading(true);

    const ipParts = localIp.split('.');
    const baseIp = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}`;
    let devicesFound = [];

    const scanPromises = [];
    for (let i = 2; i <= 254; i++) {
      const testIp = `${baseIp}.${i}`;
      scanPromises.push(
        fetchWithTimeout(`http://${testIp}/status`, { method: 'GET' }, 2000)
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
    console.log('Local IP Refresh:', ip);

    await refetch();
    await scanLocalNetwork(ip);

    setRefreshing(false);
  };

  const handleUpdateIp = async (deviceId, newIp) => {
    try {
      await updateDevice(deviceId, { ip: newIp });
      console.log('IP actualizada correctamente');
      await refetch(); // Refresca la lista de dispositivos
    } catch (error) {
      console.error('Error al actualizar la IP del dispositivo:', error);
    }
  };

  const isKnownDevice = (deviceMAC) => {
    return knownDevices.find((device) => device.MAC === deviceMAC);
  };

  const parseDeviceResponse = (response) => {
    try {
      const parsedResponse = JSON.parse(response);
      if (parsedResponse.device && typeof parsedResponse.device.mac_address === 'string') {
        return parsedResponse.device.mac_address;
      }
    } catch (error) {
      console.error('Error al parsear la respuesta:', error);
    }
    return null;
  };

  const foundMacAddresses = devices.map((item) => parseDeviceResponse(item.response));

  const missingDevices = knownDevices?.filter((knownDevice) => !foundMacAddresses.includes(knownDevice.MAC));

  const combinedDevices = [...devices.map((item) => ({ ...item, found: true })), ...(missingDevices?.map((device) => ({ ...device, found: false })) || [])];

  // Ahora, creamos una función para actualizar el 'status' usando un patrón similar
  async function updateStatus(deviceId, newStatus) {
    try {
      // Llama a la función que actualiza el dispositivo con el nuevo status
      await updateDevice(deviceId, { status: newStatus });

      console.log(`Status actualizado para el dispositivo ${deviceId}:`, newStatus);
    } catch (error) {
      console.error('Error al actualizar el status:', error);
    }
  }

  if ((isDevicesLoading || isLoading) && !refreshing) {
    return (
      <SafeAreaView className="bg-primary flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  if (devicesError) {
    return (
      <SafeAreaView className="bg-primary flex-1 justify-center items-center">
        <Text className="text-white">Failed to load devices</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary flex-1">
      <Text className="text-1xl p-5 text-white font-psemibold">IP Celular: {localIp}</Text>
      <FlatList
        data={combinedDevices}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const itemStyle = {
            opacity: refreshing ? 0.5 : 1,
          };
          if (item.found) {
            const macAddress = parseDeviceResponse(item.response);
            const knownDevice = isKnownDevice(macAddress);
            const ipChanged = knownDevice && knownDevice.ip !== item.ip;

            return (
              <View className="p-4 bg-gray-800 mb-4 rounded-lg" style={itemStyle}>
                <Text className="text-white">{knownDevice ? 'Dispositivo conocido:' : '(?) Dispositivo desconocido'}</Text>

                <Text className="text-white">{knownDevice ? knownDevice.model : ''}</Text>

                {knownDevice && ipChanged && <Text className="text-white">! La IP local ha cambiado. Anterior: {knownDevice.ip}</Text>}
                <View className="flex-row items-center">
                  <Text className="text-white font-bold">IP: {item.ip}</Text>
                  {ipChanged && knownDevice && (
                    <TouchableOpacity onPress={() => handleUpdateIp(knownDevice.$id, item.ip)}>
                      <Text className="text-blue-500 underline ml-2">(Actualizar IP)</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Text className="text-white mb-5">MAC: {macAddress}</Text>

                <TouchableOpacity onPress={() => updateStatus(knownDevice.$id, item.response)}>
                  <Text className="text-blue-500 underline ml-2">(Actualizar Status)</Text>
                </TouchableOpacity>

                <Text className="text-white" style={{ fontSize: 10, fontFamily: 'Courier' }}>
                  Respuesta:{' '}
                  {JSON.parse(item.response)
                    ? JSON.stringify(
                        JSON.parse(item.response),
                        (key, value) => {
                          // Detecta la clave "horario" y reemplaza el valor por una versión más amigable
                          if (key === 'horario' && Array.isArray(value)) {
                            // Agrega una sangría a cada fila de la matriz y elimina las comillas
                            return '\n' + value.map((row) => '           ' + row.join(' ')).join('\n') + '\n';
                          }
                          return value;
                        },
                        2 // Ajusta la indentación para el resto del JSON
                      )
                        .replace(/\\n/g, '\n') // Asegúrate de que los saltos de línea se procesen correctamente
                        .replace(/"    1/g, '    1') // Elimina las comillas iniciales de las líneas de la matriz
                        .replace(/0\n"/g, '0\n') // Elimina las comillas finales de las líneas de la matriz
                    : item.response}
                </Text>
              </View>
            );
          } else {
            return (
              <View key={item.MAC} className="p-4 bg-red-800 mb-4 rounded-lg" style={itemStyle}>
                <Text className="text-white font-bold">{`${item.name} (${item.model}: ${item.MAC})`}</Text>
                <Text className="text-white mb-5">IP: {item.ip || 'N/A'}</Text>
                <Text className="text-white">No se encontró en la red.</Text>
              </View>
            );
          }
        }}
        ListEmptyComponent={() => <Text className="text-white mt-2 text-center">No devices found.</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleLocalRefresh} tintColor="#ffffff" />}
      />
      <ToFormButton />
    </SafeAreaView>
  );
};

export default DeviceList;
