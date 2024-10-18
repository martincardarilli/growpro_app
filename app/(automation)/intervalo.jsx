import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, View, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getAllDevices, postAutomatizacion } from '../../lib/appwrite';
import { CustomButton, FormField } from '../../components';
import { useGlobalContext } from '../../context/GlobalProvider';
import { router } from 'expo-router';

const CreateAutomation = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [selectedSwitchIndex, setSelectedSwitchIndex] = useState(null);

  // Form state with hours, minutes, and seconds for on and off times
  const [form, setForm] = useState({
    titulo: 'FASTEST',
    descripcion: 'FASTEST',
    horasPrendido: 0,
    minutosPrendido: 0,
    segundosPrendido: 0,
    horasApagado: 0,
    minutosApagado: 0,
    segundosApagado: 0,
  });

  useEffect(() => {
    // Fetch devices with their switches
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
              macAddress: 'Unknown',
              switches: [],
              error: 'Status malformed', 
            };
          }
        });
        setDevices(parsedDevices);
      } catch (error) {
        console.error('Error fetching devices:', error);
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

  const configureSwitch = async () => {
    if (!selectedDevice || selectedSwitchIndex === null) {
      setUploading(false);
      return Alert.alert('Error', 'Please select a device and a switch.');
    }

    try {
      setUploading(true);
      const ipAddress = selectedDevice.ip;
    //  const scheduleMatrix = createScheduleMatrix(form.horaEncendido, form.horaApagado);

      const configData = {
        tipo: 'intervalo',
      };

      const url = `http://${ipAddress}/setConfig?index=${selectedSwitchIndex}&tipo=${configData.tipo}&matriz=${encodeURIComponent(configData.matriz)}`;

      console.log('Attempting to configure switch with URL:', url);

      const xhttp = new XMLHttpRequest();
      xhttp.open('GET', url, true);
      xhttp.timeout = 10000; // 10 segundos de timeout

      xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
          setUploading(false);
          if (xhttp.status === 200) {
            Alert.alert('Success', 'Switch configuration updated on device');
          } else {
            console.error('Failed to update switch:', xhttp.responseText);
            Alert.alert('Error', 'Failed to update switch on device.');
          }
        }
      };

      xhttp.send();
    } catch (error) {
      setUploading(false);
      console.error('Error updating switch on device:', error);
      Alert.alert('Error', 'Failed to update switch on device.');
    }
  };

  // Function to calculate total interval time (in seconds)
  const calculateTotalTime = () => {
    const totalPrendido =
      parseInt(form.horasPrendido) * 3600 + parseInt(form.minutosPrendido) * 60 + parseInt(form.segundosPrendido);
    const totalApagado =
      parseInt(form.horasApagado) * 3600 + parseInt(form.minutosApagado) * 60 + parseInt(form.segundosApagado);
    
    return totalPrendido + totalApagado;
  };

  // Calcular el tiempo total en formato horas, minutos, segundos
  const totalTimeInSeconds = calculateTotalTime();
  const totalHours = Math.floor(totalTimeInSeconds / 3600);
  const totalMinutes = Math.floor((totalTimeInSeconds % 3600) / 60);
  const totalSeconds = totalTimeInSeconds % 60;

  const submit = async () => {
    const { titulo, descripcion } = form;

    if (!titulo || !descripcion) {
      return Alert.alert('Por favor, proporciona todos los campos: título y descripción.');
    }

    setUploading(true);
    try {
      await postAutomatizacion({
        titulo,
        descripcion,
        device: selectedDevice.macAddress,
        switch: selectedSwitchIndex,
        config: {
          tipo: 'intervalo',
          horasPrendido: form.horasPrendido,
          minutosPrendido: form.minutosPrendido,
          segundosPrendido: form.segundosPrendido,
          horasApagado: form.horasApagado,
          minutosApagado: form.minutosApagado,
          segundosApagado: form.segundosApagado,
        },
        userId: user.$id,
      });

      Alert.alert('Éxito', 'Automatización creada exitosamente');
      router.push('/automatizaciones');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="px-4 bg-primary h-full">
      <ScrollView>
        <Text className="text-2xl text-white font-semibold">Intervalo</Text>

        <View className="mt-5">
          <Text className="text-lg text-white font-semibold">Tiempo Prendido</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Picker
              selectedValue={form.horasPrendido}
              onValueChange={(value) => setForm({ ...form, horasPrendido: value })}
              style={{ flex: 1 }}
            >
              {[...Array(24).keys()].map((i) => (
                <Picker.Item key={i} label={`${i}h`} value={i} />
              ))}
            </Picker>

            <Picker
              selectedValue={form.minutosPrendido}
              onValueChange={(value) => setForm({ ...form, minutosPrendido: value })}
              style={{ flex: 1 }}
            >
              {[...Array(60).keys()].map((i) => (
                <Picker.Item key={i} label={`${i}m`} value={i} />
              ))}
            </Picker>

            <Picker
              selectedValue={form.segundosPrendido}
              onValueChange={(value) => setForm({ ...form, segundosPrendido: value })}
              style={{ flex: 1 }}
            >
              {[...Array(60).keys()].map((i) => (
                <Picker.Item key={i} label={`${i}s`} value={i} />
              ))}
            </Picker>
          </View>
        </View>

        <View className="mt-5">
          <Text className="text-lg text-white font-semibold">Tiempo Apagado</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Picker
              selectedValue={form.horasApagado}
              onValueChange={(value) => setForm({ ...form, horasApagado: value })}
              style={{ flex: 1 }}
            >
              {[...Array(24).keys()].map((i) => (
                <Picker.Item key={i} label={`${i}h`} value={i} />
              ))}
            </Picker>

            <Picker
              selectedValue={form.minutosApagado}
              onValueChange={(value) => setForm({ ...form, minutosApagado: value })}
              style={{ flex: 1 }}
            >
              {[...Array(60).keys()].map((i) => (
                <Picker.Item key={i} label={`${i}m`} value={i} />
              ))}
            </Picker>

            <Picker
              selectedValue={form.segundosApagado}
              onValueChange={(value) => setForm({ ...form, segundosApagado: value })}
              style={{ flex: 1 }}
            >
              {[...Array(60).keys()].map((i) => (
                <Picker.Item key={i} label={`${i}s`} value={i} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Mostrar el tiempo total calculado */}
        <View className="mt-5">
          <Text className="text-lg text-white font-semibold">
            Tiempo intervalo total: {totalHours} horas, {totalMinutes} minutos, {totalSeconds} segundos
          </Text>
        </View>

        {/* Añadir línea divisoria */}
        <View
          style={{
            borderBottomColor: 'gray',
            borderBottomWidth: 2,
            marginVertical: 50,
          }}
        />
        {/* Inputs adicionales */}
        <FormField
          title="Título"
          value={form.titulo}
          placeholder="Ingrese el título..."
          handleChangeText={(e) => setForm({ ...form, titulo: e })}
          otherStyles="mt-5"
        />

        <FormField
          title="Descripción"
          value={form.descripcion}
          placeholder="Ingrese la descripción..."
          handleChangeText={(e) => setForm({ ...form, descripcion: e })}
          otherStyles="mt-5"
        />
        {/* Añadir línea divisoria */}
        <View
          style={{
            borderBottomColor: 'gray',
            borderBottomWidth: 2,
            marginVertical: 50,
          }}
        />

        <Text className="text-lg text-white font-semibold mt-5">Select Device</Text>
        <Picker
          selectedValue={selectedDeviceId}
          onValueChange={handleDeviceChange}
          style={{ color: 'white', fontSize: 12 }} // Aplica el color al Picker
          itemStyle={{ color: 'white', fontSize: 12 }} // Esto es útil para iOS
        >
          <Picker.Item label="Select a device" value={null} style={{ color: 'white' }} />
          {devices.map((device) => (
            <Picker.Item
              key={device.$id}
              label={`${device.name || 'Unknown'} (${device.model}: ${device.macAddress}) ${device.error ? ' (Error in status)' : ''}`}
              value={device.$id}
              style={{ color: 'white' }} // Aplica el color a cada item para iOS
            />
          ))}
        </Picker>

        {selectedDevice && selectedDevice.switches && !selectedDevice.error && (
          <>
            <Text className="text-lg text-white font-semibold mt-5">Select Switch</Text>
            <Picker
              selectedValue={selectedSwitchIndex}
              onValueChange={handleSwitchChange}
              style={{ color: 'white', fontSize: 12 }} // Aplica el color al Picker
              itemStyle={{ color: 'white', fontSize: 12 }} // Esto es útil para iOS
            >
              <Picker.Item label="Select a switch" value={null} style={{ color: 'white' }} />
              {selectedDevice.switches.map((sw, idx) => (
                <Picker.Item
                  key={idx}
                  //label={`Name: ${sw.nombre}, Number: ${idx + 1}, Mode: ${sw.modo}`}
                  label={`${sw.nombre} (${idx + 1})`}
                  value={idx}
                  style={{ color: 'white' }} // Aplica el color a cada item para iOS
                />
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
