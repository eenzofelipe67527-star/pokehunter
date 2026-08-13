import CameraButton from "@/components/CameraButton";
import PokemonItem from "@/components/PokemonItem";
import { getPokemonList, Pokemon } from "@/services/pokeapi";
import { clearCapturedPokemon, getCapturedPokemon } from "@/services/storage";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PokedexScreen() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [offset, setOffset] = useState(0);
  const [capturedIds, setCapturedIds] = useState<number[]>([]);

  const LIMIT = 20;

  async function loadPokemonList() {
    if (loading || !hasNextPage) {
      return;
    }

    setLoading(true);

    getPokemonList(LIMIT, offset)
      .then((response) => {
        setPokemonList((oldState) => [...oldState, ...response.pokemonList]);
        setHasNextPage(response.hasNextPage);
        setOffset((oldState) => oldState + response.pokemonList.length);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }

function handleCLear() {
  clearCapturedPokemon();
  setCapturedIds([]);
}

  useFocusEffect(useCallback(() => {
    getCapturedPokemon()
      .then((response) => {
        setCapturedIds(response.map((pokemon) => pokemon.id))
      });
  }, [])
  )

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="light" />

      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.title}>Pokedex</Text>

          <Pressable onPress={handleCLear}>
            <FontAwesome name="trash" size={20}
              color="#red" />
          </Pressable>
        </View>

        <FlatList
          data={pokemonList}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <PokemonItem
              id={item.id}
              name={item.name}
              image={item.image}
              captured={capturedIds.includes(item.id)}
            />
          )}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator
                size="small"
                color="red"
                style={styles.loading}
              />
            ) : null
          }
          onEndReached={loadPokemonList}
          onEndReachedThreshold={0.5}
        />

        <CameraButton />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#1e1e1e",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: "#1e1e1e",
    borderBottomWidth: 1,
    borderBottomColor: "#2f2f2f",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  main: {
    height: "100%",
    backgroundColor: "#121212",
  },
  list: {
    padding: 16,
    paddingBottom: 90,
  },
  row: {
    gap: 16,
    marginBottom: 16,
  },
  loading: {
    marginVertical: 24,
  },
});