import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { ActivityIndicator, ActivityIndicatorComponent,
   StyleSheet,
   Text,
   View 
  } from "react-native";
import MapView from "react-native-maps";

interface Cordinates {
  latitude: number;
  longitude: number;
}

export default function mapScreen() {
const [location, setLocation] = useState<Cordinates | null>(null);
const [error, setError] = useState<string | null>(null);

async function getLocation() {
  const permission = await Location.requestForegroundPermissionsAsync();

  if(permission.status !== "granted") {
    setError("Permissão de localização negada.");
    return;
  }

  const currentLocation = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
  setLocation({
    latitude: currentLocation.coords.latitude,
    longitude: currentLocation.coords.longitude,
  })
}

useEffect(() => {
  getLocation();
}, []);

if (error) {
  return (
<View style={styles.container}>
  <Text style={styles.error}>{error}</Text>
</View>
  );
}

if(!location) {
  return(
    <View style={styles.container}>
      <ActivityIndicator size="large" color="red" />
      <Text style={styles.loadingText}>Buscando sua localização...</Text>
    </View>
  )
}

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      showsUserLocation
      showsMyLocationButton
    />
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  error: {
    fontSize: 16,
    textAlign: "center",
  },
  loadingText: {
fontSize: 16,
marginTop: 12,
  },
map: {
  height: "100%",
},
});
