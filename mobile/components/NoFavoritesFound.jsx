
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constans/colors";
import { favoritesStyles } from "@/assets/styles/favorites.styles";

function NoFavoritesFound() {
  const router = useRouter();

  return (
    <View style={favoritesStyles.emptyState}>
      <View style={favoritesStyles.emptyIconContainer}>
        <Ionicons name="heart-outline" size={80} color={COLORS.textLight} />
      </View>
      <Text style={favoritesStyles.emptyTitle}>Ничего нет</Text>
      <TouchableOpacity style={favoritesStyles.exploreButton} onPress={() => router.push("/")}>
        <Ionicons name="search" size={18} color={COLORS.white} />
        <Text style={favoritesStyles.exploreButtonText}>Найдите рецепты</Text>
      </TouchableOpacity>
    </View>
  );
}

export default NoFavoritesFound;