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
    titulo: '',
    descripcion: '',
    horaEncendido: '',
    horaApagado: '',
  });

  useEffect(() => {
    // Fetch devices with their switches
    const fetchDevices = async () => {
      try {
        const fetchedDevices = await getAllDevices();
        setDevices(fetchedDevices);
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
      return Alert.alert('Error', 'Please select a device and a switch.');
    }

    try {
      // Create an instance of XMLHttpRequest
      const xhttp = new XMLHttpRequest();
      xhttp.open('POST', `http://${selectedDevice.ipLocal}/setConfig`, true);
      xhttp.setRequestHeader('Content-Type', 'application/json');

      xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4) {
          if (xhttp.status === 200) {
            Alert.alert('Success', 'Switch configuration updated on device');

            // Optionally record this action in the database
            postAutomatizacion({
              titulo: form.titulo,
              descripcion: form.descripcion,
              config: {
                tipo: 'fotoperiodo',
                switches: selectedDevice.switches,
              },
              userId: user.$id,
            }).catch((error) => {
              console.error('Error saving automatization:', error);
              Alert.alert('Error', 'Failed to save the automatization.');
            });
          } else {
            console.error('Failed to update switch:', xhttp.responseText);
            Alert.alert('Error', 'Failed to update switch on device.');
          }
        }
      };

      // Send the request with the configuration as JSON
      const configData = {
        tipo: 'fotoperiodo',
        estado: selectedSwitch.estado ? 1 : 0,
      };
      xhttp.send(JSON.stringify({ config: configData }));
    } catch (error) {
      console.error('Error updating switch on device:', error);
      Alert.alert('Error', 'Failed to update switch on device.');
    }
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
          switches: selectedDevice ? selectedDevice.switches : [],
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
            <Picker.Item key={device.$id} label={device.name} value={device.$id} />
          ))}
        </Picker>

        {selectedDevice && selectedDevice.switches && (
          <>
            <Text className="text-lg text-white font-semibold mt-5">Select Switch</Text>
            <Picker selectedValue={selectedSwitchIndex} onValueChange={handleSwitchChange}>
              <Picker.Item label="Select a switch" value={null} />
              {selectedDevice.switches.map((sw, idx) => (
                <Picker.Item key={idx} label={sw.nombre} value={idx} />
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
