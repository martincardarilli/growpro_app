import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  RefreshControl,
  Text,
  View,
  ScrollView,
  Alert,
} from "react-native";

import { getAllAutomatizaciones, postAutomatizacion } from "../../lib/appwrite";
import { CustomButton, FormField } from "../../components"; // Assuming this path is correct
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";

// CreateAutomatizacion Component
const CreateAutomation = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    MAC: "",
  });

  const submit = async () => {
    if (form.titulo === "" || form.descripcion === "") {
      return Alert.alert("Please provide both title and description");
    }

    setUploading(true);
    try {
      await postAutomatizacion({
        titulo: form.titulo,
        descripcion: form.descripcion,
        MAC: form.MAC,
        userId: user.$id, // Associating with the user if needed
      });

      Alert.alert("Success", "Automatization created successfully");
      router.push("/automatizaciones");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        titulo: "",
        descripcion: "",
      });
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="px-4 pt-6 bg-primary h-full">
      <ScrollView>
        <Text className="text-2xl text-white font-semibold">
          Nuevo dispositivo
        </Text>

        <FormField
          title="Title"
          value={form.titulo}
          placeholder="Enter title..."
          handleChangeText={(e) => setForm({ ...form, titulo: e })}
          otherStyles="mt-10"
        />

        <FormField
          title="Description"
          value={form.descripcion}
          placeholder="Enter description..."
          handleChangeText={(e) => setForm({ ...form, descripcion: e })}
          otherStyles="mt-7"
        />

        <FormField
          title="MAC Address"
          value={form.MAC}
          placeholder="Enter MAC Address..."
          handleChangeText={(e) => setForm({ ...form, MAC: e })}
          otherStyles="mt-7"
        />

        <CustomButton
          title="Submit"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateAutomation;
