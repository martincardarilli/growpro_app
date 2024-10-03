import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  RefreshControl,
  Text,
  View,
  ActivityIndicator,
} from "react-native";

import useAppwrite from "../../lib/useAppwrite"; // Assuming useAppwrite is setup for fetching data
import { getAllDevices } from "../../lib/appwrite"; // Mock API call to get all devices

import ToFormButton from "../../components/devices/ToFormButton";

import ScanNetwork from "../../components/devices/ScanNetwork";

// DeviceList Component
const DeviceList = () => {
  const {
    data: devices,
    refetch,
    isLoading: isDevicesLoading,
    error: devicesError,
  } = useAppwrite(getAllDevices); // Assuming getAllDevices fetches the devices from Appwrite

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Log devices data whenever it updates
  useEffect(() => {
    console.log("Fetched devices:");
    console.log(devices);
  }, [devices]);

  // Show a loading indicator while devices are being fetched
  if (isDevicesLoading) {
    return (
      <SafeAreaView className="bg-primary flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  // Show an error message if fetching devices failed
  if (devicesError) {
    return (
      <SafeAreaView className="bg-primary flex-1 justify-center items-center">
        <Text className="text-white">Failed to load devices</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary flex-1">
      <ToFormButton />
      <ScanNetwork knownDevices={devices} />
    </SafeAreaView>
  );
};

export default DeviceList;
