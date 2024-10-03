import { TouchableOpacity, Image, Text } from "react-native";
import { router } from "expo-router";
import { icons } from "../../constants";

const ToFormButton = () => {
  return (
    <TouchableOpacity
      style={{
        width: 120,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1A1A1A",
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#555",
        flexDirection: "row",

        position: "absolute",
        bottom: 30, // Adjust this based on where you want it (distance from bottom)
        right: 20, // Adjust this based on where you want it (distance from right)
        zIndex: 10, // This ensures the button is above other elements

        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5, // For Android shadow
      }}
      onPress={() => router.push("/SwitchMatrix")} // Navigates to the form screen
    >
      <Image
        source={icons.plus} // You can use a different icon if needed
        style={{ width: 24, height: 24 }}
        resizeMode="contain"
      />

      <Text style={{ color: "white", marginLeft: 10 }}>Nuevo</Text>
    </TouchableOpacity>
  );
};

export default ToFormButton;
