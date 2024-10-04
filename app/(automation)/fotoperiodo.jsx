import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, Alert } from "react-native";

import { getAllAutomatizaciones, postAutomatizacion } from "../../lib/appwrite";
import { CustomButton, FormField } from "../../components"; // Assuming this path is correct
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";

// Helper function to validate time format HH:MM
const isValidTime = (time) => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Regex to match HH:MM format
  return timeRegex.test(time);
};

// CreateAutomatizacion Component
const CreateAutomation = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    horaEncendido: "",
    horaApagado: "",
    tipoAutomatizacion: "Fotoperiodo", // Hardcodeado a "Fotoperiodo"
  });

  const submit = async () => {
    const {
      titulo,
      descripcion,
      horaEncendido,
      horaApagado,
      tipoAutomatizacion,
    } = form;

    // Validate that all fields are filled
    if (!titulo || !descripcion || !horaEncendido || !horaApagado) {
      return Alert.alert(
        "Please provide all fields: title, description, turn-on time, and turn-off time"
      );
    }

    // Validate time format
    if (!isValidTime(horaEncendido) || !isValidTime(horaApagado)) {
      return Alert.alert(
        "Invalid time format",
        "Please enter time in HH:MM format (e.g., 08:30 or 19:45)."
      );
    }

    setUploading(true);
    try {
      await postAutomatizacion({
        titulo,
        descripcion,
        horaEncendido,
        horaApagado,
        tipoAutomatizacion, // Incluyendo el tipo de automatización hardcodeado
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
        horaEncendido: "",
        horaApagado: "",
        tipoAutomatizacion: "Fotoperiodo", // Resetearlo a "Fotoperiodo"
      });
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="px-4 pt-6 bg-primary h-full">
      <ScrollView>
        <Text className="text-2xl text-white font-semibold">
          Create Automatization
        </Text>

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

        <CustomButton
          title="Submit"
          handlePress={submit}
          containerStyles="mt-5"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateAutomation;
