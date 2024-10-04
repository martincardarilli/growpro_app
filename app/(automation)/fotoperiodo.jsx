import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, Alert } from "react-native";

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
    horaEncendido: "",
    horaApagado: "",
  });

  const submit = async () => {
    const { titulo, descripcion, horaEncendido, horaApagado } = form;

    if (!titulo || !descripcion || !horaEncendido || !horaApagado) {
      return Alert.alert(
        "Please provide all fields: title, description, turn-on time, and turn-off time"
      );
    }

    setUploading(true);
    try {
      await postAutomatizacion({
        titulo,
        descripcion,
        horaEncendido,
        horaApagado,
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
          title="Turn-on Time"
          value={form.horaEncendido}
          placeholder="Enter turn-on time..."
          handleChangeText={(e) => setForm({ ...form, horaEncendido: e })}
          otherStyles="mt-7"
        />

        <FormField
          title="Turn-off Time"
          value={form.horaApagado}
          placeholder="Enter turn-off time..."
          handleChangeText={(e) => setForm({ ...form, horaApagado: e })}
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
