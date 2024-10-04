import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View, Alert, TouchableOpacity } from "react-native";
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
  });
  const [activadores, setActivadores] = useState([{ id: 1, value: "" }]); // Activadores iniciales
  const [acciones, setAcciones] = useState([{ id: 1, value: "" }]); // Acciones iniciales

  // Añadir un nuevo activador
  const addActivador = () => {
    setActivadores([...activadores, { id: activadores.length + 1, value: "" }]);
  };

  // Eliminar un activador
  const removeActivador = (id) => {
    setActivadores(activadores.filter((item) => item.id !== id));
  };

  // Añadir una nueva acción
  const addAccion = () => {
    setAcciones([...acciones, { id: acciones.length + 1, value: "" }]);
  };

  // Eliminar una acción
  const removeAccion = (id) => {
    setAcciones(acciones.filter((item) => item.id !== id));
  };

  // Manejar el cambio de texto en los activadores y acciones
  const handleActivadorChange = (id, value) => {
    setActivadores(
      activadores.map((item) => (item.id === id ? { ...item, value } : item))
    );
  };

  const handleAccionChange = (id, value) => {
    setAcciones(
      acciones.map((item) => (item.id === id ? { ...item, value } : item))
    );
  };

  const submit = async () => {
    if (form.titulo === "" || form.descripcion === "") {
      return Alert.alert("Please provide both title and description");
    }
    if (activadores.length === 0 || acciones.length === 0) {
      return Alert.alert("Please add at least one activador and one accion");
    }

    setUploading(true);
    try {
      await postAutomatizacion({
        titulo: form.titulo,
        descripcion: form.descripcion,
        activadores,
        acciones,
        userId: user.$id,
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
      setActivadores([{ id: 1, value: "" }]);
      setAcciones([{ id: 1, value: "" }]);
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

        {/* Activadores */}
        <Text className="text-xl text-white mt-5">Activadores</Text>
        {activadores.map((activador, index) => (
          <View key={activador.id} className="flex-row items-center">
            <FormField
              title={`Activador ${index + 1}`}
              value={activador.value}
              placeholder={`Enter activador ${index + 1}...`}
              handleChangeText={(e) => handleActivadorChange(activador.id, e)}
              otherStyles="flex-1 mt-5"
            />
            {activadores.length > 1 && (
              <TouchableOpacity onPress={() => removeActivador(activador.id)}>
                <Text className="text-red-500 ml-3">Eliminar</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity onPress={addActivador}>
          <Text className="text-blue-500 mt-3">+ Agregar activador</Text>
        </TouchableOpacity>

        {/* Acciones */}
        <Text className="text-xl text-white mt-5">Acciones</Text>
        {acciones.map((accion, index) => (
          <View key={accion.id} className="flex-row items-center">
            <FormField
              title={`Accion ${index + 1}`}
              value={accion.value}
              placeholder={`Enter accion ${index + 1}...`}
              handleChangeText={(e) => handleAccionChange(accion.id, e)}
              otherStyles="flex-1 mt-5"
            />
            {acciones.length > 1 && (
              <TouchableOpacity onPress={() => removeAccion(accion.id)}>
                <Text className="text-red-500 ml-3">Eliminar</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity onPress={addAccion}>
          <Text className="text-blue-500 mt-3">+ Agregar accion</Text>
        </TouchableOpacity>

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
