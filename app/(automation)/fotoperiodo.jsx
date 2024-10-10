import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, View, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getAllDevices, postAutomatizacion } from '../../lib/appwrite';
import { CustomButton, FormField } from '../../components';
import { useGlobalContext } from '../../context/GlobalProvider';
import { router } from 'expo-router';

// Helper function to validate time format HH:MM
const isValidTime = (time) => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Regex to match HH:MM format
  return timeRegex.test(time);
};

const CreateAutomation = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [selectedSwitchIndex, setSelectedSwitchIndex] = useState(null);
  const [form, setForm] = useState({
    titulo: 'FASTEST',
    descripcion: 'FASTEST',
    horaEncendido: '00:00',
    horaApagado: '01:00',
  });

  useEffect(() => {
    // Fetch devices with their switches
    const fetchDevices = async () => {
      try {
        const fetchedDevices = await getAllDevices();
        const parsedDevices = fetchedDevices.map((device) => {
          // Parse the status field to extract switches
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
              error: 'Status malformed', // Mark the device with an error
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
    setSelectedSwitchIndex(null); // Reset selected switch when changing device
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
      const scheduleMatrix = createScheduleMatrix(form.horaEncendido, form.horaApagado);
  
      const configData = {
        tipo: 'fotoperiodo',
        matriz: scheduleMatrix,
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
  
  
  
  const createScheduleMatrix = (horaEncendido, horaApagado) => {
    // Crear un array de 288 elementos, inicializado con '0'
    let schedule = Array(288).fill('0');
  
    // Descomponer las horas y minutos de encendido y apagado
    const [startHour, startMinute] = horaEncendido.split(':').map(Number);
    const [endHour, endMinute] = horaApagado.split(':').map(Number);
  
    // Calcular los índices de inicio y fin en la matriz de 288 elementos
    const startIndex = startHour * 12 + Math.floor(startMinute / 5);
    const endIndex = endHour * 12 + Math.floor(endMinute / 5);
  
    // Rellenar los intervalos con '1' para representar el encendido
    if (startIndex <= endIndex) {
      schedule.fill('1', startIndex, endIndex + 1);
    } else {
      // Caso en el que el encendido pasa la medianoche
      schedule.fill('1', startIndex, 288); // Rellenar desde el inicio hasta el final
      schedule.fill('1', 0, endIndex + 1); // Rellenar desde el inicio hasta el índice final
    }
  
    // Convertir el array a un string
    return schedule.join('');
  };
  
  
  const submit = async () => {
    const { titulo, descripcion, horaEncendido, horaApagado } = form;

    if (!titulo || !descripcion || !horaEncendido || !horaApagado) {
      return Alert.alert('Please provide all fields: title, description, turn-on time, and turn-off time');
    }

    setUploading(true);
    try {
      await postAutomatizacion({
        titulo,
        descripcion,
        config: {
          tipo: 'fotoperiodo',
          horaEncendido,
          horaApagado,
          matriz: createScheduleMatrix(horaEncendido,horaApagado),
          //switches: selectedDevice ? selectedDevice.switches : [],
        },
        userId: user.$id,
      });

      Alert.alert('Success', 'Automatization created successfully');
      router.push('/automatizaciones');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="px-4 pt-6 bg-primary h-full">
      <ScrollView>
        <Text className="text-2xl text-white font-semibold">Create Automatization</Text>

        <Text className="text-lg text-white font-semibold mt-5">Select Device</Text>
        <Picker selectedValue={selectedDeviceId} onValueChange={handleDeviceChange}>
          <Picker.Item label="Select a device" value={null} />
          {devices.map((device) => (
            <Picker.Item
              key={device.$id}
              label={`Model: ${device.model || 'Unknown'}, MAC: ${device.macAddress}${device.error ? ' (Error in status)' : ''}`}
              value={device.$id}
            />
          ))}
        </Picker>

        {selectedDevice && selectedDevice.switches && !selectedDevice.error && (
          <>
            <Text className="text-lg text-white font-semibold mt-5">Select Switch</Text>
            <Picker selectedValue={selectedSwitchIndex} onValueChange={handleSwitchChange}>
              <Picker.Item label="Select a switch" value={null} />
              {selectedDevice.switches.map((sw, idx) => (
                <Picker.Item
                  key={idx}
                  //label={`Name: ${sw.nombre}, Number: ${idx + 1}, Mode: ${sw.modo}`}
                  label={`${sw.nombre} (${idx + 1})`}
                  value={idx}
                />
              ))}
            </Picker>

            <CustomButton title="Configure Switch" handlePress={configureSwitch} containerStyles="mt-5" />
          </>
        )}

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
        <FormField
          title="Turn-on Time"
          value={form.horaEncendido}
          placeholder="Enter turn-on time (HH:MM)..."
          handleChangeText={(e) => setForm({ ...form, horaEncendido: e })}
          otherStyles="mt-5"
        />
        <FormField
          title="Turn-off Time"
          value={form.horaApagado}
          placeholder="Enter turn-off time (HH:MM)..."
          handleChangeText={(e) => setForm({ ...form, horaApagado: e })}
          otherStyles="mt-5"
        />

        <CustomButton title="Submit" handlePress={submit} containerStyles="mt-5" isLoading={uploading} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateAutomation;
