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

    if (devicesFound.length > 0) {
      setDevices(devicesFound);
    } else {
      console.log("No se encontraron dispositivos");
    }

    setIsLoading(false);
  };

  const isKnownDevice = (deviceIp) => {
    return knownDevices.some(
      (device) => device.ip === deviceIp || device.MAC === deviceIp
    );
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
      <Text className="text-1xl p-5 text-white font-psemibold">
        IP Celular: {localIp}
      </Text>
      <FlatList
        data={devices}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="p-4 bg-gray-800 mb-4 rounded-lg">
            <Text className="text-white font-bold">IP: {item.ip}</Text>
            <Text className="text-white">Respuesta: {item.response}</Text>
            <Text className="text-white">
              {isKnownDevice(item.ip)
                ? "Dispositivo conocido"
                : "Dispositivo desconocido"}
            </Text>
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
