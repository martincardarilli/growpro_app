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

import useAppwrite from "../../lib/useAppwrite";
import { getAllAutomatizaciones, postAutomatizacion } from "../../lib/appwrite";
import { CustomButton, FormField } from ".."; // Assuming this path is correct
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";

// CreateAutomatizacion Component
const FormAutomatizacion = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
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
        userId: user.$id, // Associating with the user if needed
      });

      Alert.alert("Success", "Automatization created successfully");
      router.push("/home");
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
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-semibold">
          Create Automatization
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

export default FormAutomatizacion;
