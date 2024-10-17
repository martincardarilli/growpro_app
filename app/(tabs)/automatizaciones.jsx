import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, RefreshControl, Text, View, ActivityIndicator, Image } from 'react-native';

import useAppwrite from '../../lib/useAppwrite';
import { getAllAutomatizaciones } from '../../lib/appwrite';

import ToFormButton from '../../components/automatizaciones/ToFormButton';

// Automatizaciones Component
const Automatizaciones = () => {
  const { data: automatizaciones, refetch, isLoading: isAutomatizacionesLoading, error: automatizacionesError } = useAppwrite(getAllAutomatizaciones);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Log automatizaciones data whenever it updates
  useEffect(() => {
    console.log('Fetched automatizaciones:');
    console.log(automatizaciones);
  }, [automatizaciones]);

  // Show a loading indicator while automatizaciones are being fetched
  if (isAutomatizacionesLoading) {
    return (
      <SafeAreaView className="bg-primary flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  // Show an error message if fetching automatizaciones failed
  if (automatizacionesError) {
    return (
      <SafeAreaView className="bg-primary flex-1 justify-center items-center">
        <Text className="text-white">Failed to load automatizaciones</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary flex-1">
      <FlatList
        data={automatizaciones}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View className="p-4 bg-gray-800 mb-4 rounded-lg">
            <Text className="text-white font-bold">{item.titulo || 'Automatización sin título'}</Text>
            <Text className="text-gray-400 mb-5">Descripción: {item.descripcion || 'Sin descripción'}</Text>

           

            <Text className="text-gray-400">Device: {`${item.name || 'Unknown'} (${item.model || 'Unknown'}: ${item.device || 'Unknown'})`}</Text>

            <Text className="text-gray-400">Switch: {parseInt(item.switch) + 1 || 'Sin switch'}</Text>

            <Text className="text-gray-400 mt-5 mb-5">Config (JSON): {item.config || 'Sin config'}</Text>

            {/* Display user information */}
            {item.userId && (
              <View className="flex-row items-center mt-2">
                <Image source={{ uri: item.userId.avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                <View className="ml-3">
                  <Text className="text-white">Usuario: {item.userId.username || 'Sin nombre de usuario'}</Text>
                  <Text className="text-gray-400">Email: {item.userId.email || 'Sin correo'}</Text>
                </View>
              </View>
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <Text className="text-2xl text-white font-psemibold">Automatizaciones</Text>

            <Text className="text-lg font-pregular text-gray-100 mb-3">List of Automatizaciones</Text>
          </View>
        )}
        ListEmptyComponent={() => <Text className="text-white mt-2 text-center">No hay automatizaciones disponibles.</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      {/* Form to create a new automatizacion */}
      {/*  <FormAutomatizacion />  */}
      <ToFormButton />
    </SafeAreaView>
  );
};

export default Automatizaciones;
