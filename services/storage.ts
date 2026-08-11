import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@pokehunterenzo:capturePokemon";

export interface CapturePokemon {
  id: number;
  latitude: number;
  longitude: number;
  capturedAt: string;
}

export async function getCapturePokemon() {
  const storedPokemon = await AsyncStorage.getItem(STORAGE_KEY);

  if (!storedPokemon) {
    return [];
  }

  return JSON.parse(storedPokemon) as CapturePokemon[];
}

export async function saveCapturePokemon(
  id: number,
  latitude: number,
  longitude: number,
) {
  const storedPokemon = await getCapturePokemon();

  const pokemonAlreadyCaptured = storedPokemon.some(
    (pokemon) => pokemon.id === id,
  );
  if (pokemonAlreadyCaptured) {
    return;
  }

  storedPokemon.push({
    id,
    latitude,
    longitude,
    capturedAt: new Date().toISOString(),
  });

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storedPokemon));
}

export async function clearCapturePokemon() {
    await AsyncStorage.removeItem(STORAGE_KEY);
}
