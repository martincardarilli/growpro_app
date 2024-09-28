import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, RefreshControl, Text, View } from "react-native";

import useAppwrite from "../../lib/useAppwrite";
import { getAllAutomatizaciones } from "../../lib/appwrite";

// const { user } = useGlobalContext();

const Automatizaciones = () => {
  const { data: automatizaciones, refetch } = useAppwrite(
    getAllAutomatizaciones
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="px-4 my-6 bg-primary h-full">
      <Text className="text-2xl text-white font-psemibold">
        Automatizaciones
      </Text>
      <FlatList
        data={automatizaciones}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View className="p-4">
            <Text className="text-white">
              {item.title || "Automatización sin título"}
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text className="text-white mt-2">
            No hay automatizaciones disponibles.
          </Text>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Automatizaciones;
