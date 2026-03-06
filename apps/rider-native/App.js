import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Polyline } from "react-native-maps";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";

const BRAND = "#009B77";
const TAB_ITEMS = [
  { key: "Ride", icon: "◎" },
  { key: "Metro", icon: "▦" },
  { key: "Parcel", icon: "◫" },
  { key: "Travel", icon: "✦" },
  { key: "Profile", icon: "◉" }
];

const SERVICE_CARDS = [
  {
    id: "scooty",
    title: "Scooty",
    subtitle: "Fast and affordable",
    color: "#edf3fb",
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "parcel",
    title: "Parcel",
    subtitle: "Send anything",
    color: "#eceff4",
    image:
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "metro",
    title: "Metro",
    subtitle: "Tickets & offers",
    color: "#edf3fb",
    image:
      "https://images.unsplash.com/photo-1581368135153-a506cf13b1e1?auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "all",
    title: "All Services",
    subtitle: "Ride, Parcel, Metro",
    color: "#eceff4",
    image:
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=500&q=60"
  }
];

const SUGGESTIONS = [
  {
    id: "auto",
    title: "Auto",
    image: "https://img.icons8.com/color/96/auto-rickshaw.png"
  },
  {
    id: "bike",
    title: "Bike",
    image: "https://img.icons8.com/color/96/motorcycle.png"
  },
  {
    id: "trip",
    title: "Trip",
    image: "https://img.icons8.com/color/96/car--v1.png"
  },
  {
    id: "parcel",
    title: "Send parcels",
    image: "https://img.icons8.com/color/96/delivery.png"
  },
  {
    id: "rentals",
    title: "Rentals",
    image: "https://img.icons8.com/color/96/rent.png"
  },
  {
    id: "intercity",
    title: "Intercity",
    image: "https://img.icons8.com/color/96/taxi.png"
  },
  {
    id: "transit",
    title: "Transit",
    image: "https://img.icons8.com/color/96/train.png"
  },
  {
    id: "reserve",
    title: "Reserve",
    image: "https://img.icons8.com/color/96/planner.png"
  }
];

const RECENT_LOCATIONS = [
  "Secunderabad Railway Station Road",
  "Kacheguda Railway Station",
  "HITEC City Metro Station",
  "Jubilee Bus Station",
  "Yashoda Hospitals Hitec City"
];

const PREMIUM_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#f3f5f9" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#5e6f85" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#dbe3ef" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#cfd9e8" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#d7e5ff" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] }
];

const INITIAL_PICKUP = { latitude: 17.4374, longitude: 78.4482 };
const INITIAL_DROP = { latitude: 17.4571, longitude: 78.3657 };

export default function App() {
  const [tab, setTab] = useState("Ride");
  const [uiMode, setUiMode] = useState("home");
  const [mapTarget, setMapTarget] = useState("pickup");

  const [backendUrl, setBackendUrl] = useState("http://localhost:4000");
  const [phoneNumber, setPhoneNumber] = useState("+919900112233");
  const [profileName, setProfileName] = useState("Kiran");
  const [profileEmail, setProfileEmail] = useState("kiran@example.com");
  const [otp, setOtp] = useState("123456");
  const [riderId, setRiderId] = useState("rider_1");
  const [cancelReason, setCancelReason] = useState("Plan changed");
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  const [pickupAddress, setPickupAddress] = useState("Pickup location");
  const [dropAddress, setDropAddress] = useState("Drop location");
  const [stops, setStops] = useState([]);

  const [pickupCoord, setPickupCoord] = useState(INITIAL_PICKUP);
  const [dropCoord, setDropCoord] = useState(INITIAL_DROP);
  const [currentCoord, setCurrentCoord] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeStopCoords, setRouteStopCoords] = useState([]);
  const [routeDistanceKm, setRouteDistanceKm] = useState(null);
  const [routeDurationMin, setRouteDurationMin] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);

  const [ride, setRide] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [log, setLog] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const normalizedBase = useMemo(() => backendUrl.trim().replace(/\/$/, ""), [backendUrl]);

  const appendLog = (msg) => {
    setLog((prev) => [`${new Date().toLocaleTimeString()} - ${msg}`, ...prev].slice(0, 15));
  };

  const apiFetch = async (path, options = {}) => {
    const headers = {
      "content-type": "application/json",
      ...(options.headers || {})
    };
    if (accessToken) headers.authorization = `Bearer ${accessToken}`;
    return fetch(`${normalizedBase}${path}`, { ...options, headers });
  };

  const geocode = async (query) => {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("limit", "1");
    url.searchParams.set("q", query);
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error("Address lookup failed");
    const data = await response.json();
    if (!data.length) throw new Error(`Address not found: ${query}`);
    return {
      latitude: Number(data[0].lat),
      longitude: Number(data[0].lon),
      label: data[0].display_name
    };
  };

  const reverseGeocode = async ({ latitude, longitude }) => {
    try {
      const url = new URL("https://nominatim.openstreetmap.org/reverse");
      url.searchParams.set("format", "jsonv2");
      url.searchParams.set("lat", String(latitude));
      url.searchParams.set("lon", String(longitude));
      const response = await fetch(url.toString());
      if (!response.ok) {
        return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
      }
      const data = await response.json();
      return data.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    } catch {
      return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    }
  };

  const formatExpoAddress = (entry) => {
    const lineOne = [entry.name, entry.street].filter(Boolean).join(" ").trim();
    const lineTwo = [entry.district, entry.city, entry.subregion, entry.region, entry.postalCode, entry.country]
      .filter(Boolean)
      .join(", ");
    return [lineOne, lineTwo].filter(Boolean).join(", ");
  };

  const resolveAddressFromCoord = async (coord) => {
    try {
      const local = await Location.reverseGeocodeAsync(coord);
      if (local?.length) {
        const label = formatExpoAddress(local[0]);
        if (label) return label;
      }
    } catch {}
    return reverseGeocode(coord);
  };

  const toRadians = (value) => (value * Math.PI) / 180;

  const distanceKm = (fromCoord, toCoord) => {
    const radius = 6371;
    const dLat = toRadians(toCoord.latitude - fromCoord.latitude);
    const dLon = toRadians(toCoord.longitude - fromCoord.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(fromCoord.latitude)) *
        Math.cos(toRadians(toCoord.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return 2 * radius * Math.asin(Math.sqrt(a));
  };

  const totalDistanceKm = (path) => {
    if (!path || path.length < 2) return 0;
    return path.slice(1).reduce((sum, point, index) => sum + distanceKm(path[index], point), 0);
  };

  const locateCurrent = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== "granted") {
      throw new Error("Location permission denied");
    }
    let position = null;
    try {
      position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest
      });
    } catch {
      position = await Location.getLastKnownPositionAsync({
        maxAge: 60_000,
        requiredAccuracy: 100
      });
    }
    if (!position) throw new Error("Unable to detect current location");
    const coord = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
    setCurrentCoord(coord);
    setPickupCoord(coord);
    setMapTarget("pickup");
    const address = await resolveAddressFromCoord(coord);
    setPickupAddress(address);
    appendLog("Current location set as pickup");
  };

  const requestOtp = async () => {
    const response = await fetch(`${normalizedBase}/auth/request-otp`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ phoneNumber: phoneNumber.trim() })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "OTP request failed");
    appendLog(`OTP sent. Use ${data.devOtp || "123456"}`);
  };

  const login = async () => {
    const response = await fetch(`${normalizedBase}/auth/verify-otp`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ phoneNumber: phoneNumber.trim(), otp: otp.trim(), role: "RIDER" })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Login failed");
    setAccessToken(data.accessToken);
    appendLog(`Logged in as ${data.user.phoneNumber}`);
  };

  const refreshRide = async () => {
    if (!ride?.id) throw new Error("No active ride");
    const response = await apiFetch(`/rides/${ride.id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Refresh failed");
    setRide(data);
    appendLog(`Ride status: ${data.status}`);
  };

  const cancelRide = async () => {
    if (!ride?.id) throw new Error("No active ride");
    const response = await apiFetch(`/rides/${ride.id}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason: cancelReason.trim() || undefined })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Cancel failed");
    setRide(data);
    appendLog(`Ride cancelled: ${data.id}`);
  };

  const payRide = async () => {
    if (!ride?.id) throw new Error("No active ride");
    const response = await apiFetch(`/payments/rides/${ride.id}/collect`, {
      method: "POST",
      body: JSON.stringify({ method: paymentMethod.trim().toUpperCase() })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Payment failed");
    appendLog(`Payment success: ${data.amount} via ${data.paymentMethod}`);
    await refreshRide();
  };

  const saveProfile = async () => {
    if (!profileName.trim()) {
      throw new Error("Enter profile name");
    }
    if (!phoneNumber.trim()) {
      throw new Error("Enter phone number");
    }
    if (!profileEmail.trim() || !profileEmail.includes("@")) {
      throw new Error("Enter valid email");
    }
    appendLog("Profile updated");
  };

  const bookRide = async () => {
    if (!pickupAddress || !dropAddress || pickupAddress === "Pickup location" || dropAddress === "Drop location") {
      throw new Error("Enter pickup and drop before booking");
    }

    let pickup = pickupCoord;
    let drop = dropCoord;

    if (!pickupCoord) {
      const result = await geocode(pickupAddress);
      pickup = { latitude: result.latitude, longitude: result.longitude };
      setPickupCoord(pickup);
    }
    if (!dropCoord) {
      const result = await geocode(dropAddress);
      drop = { latitude: result.latitude, longitude: result.longitude };
      setDropCoord(drop);
    }

    const response = await apiFetch("/rides", {
      method: "POST",
      body: JSON.stringify({
        riderId: riderId.trim(),
        pickup: { lat: pickup.latitude, lng: pickup.longitude },
        drop: { lat: drop.latitude, lng: drop.longitude }
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Ride creation failed");
    setRide(data);
    setUiMode("home");
    appendLog(`Ride created: ${data.id}`);
  };

  const withAction = (action) => async () => {
    try {
      await action();
    } catch (error) {
      appendLog(error instanceof Error ? error.message : "Unknown error");
    }
  };

  useEffect(() => {
    withAction(locateCurrent)();
  }, []);

  useEffect(() => {
    withAction(async () => {
      if (dropAddress === "Drop location") {
        const label = await reverseGeocode(dropCoord);
        setDropAddress(label);
      }
    })();
  }, []);

  const onRefreshAll = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      if (ride?.id) {
        await refreshRide();
      } else {
        appendLog("Refreshed");
      }
    } finally {
      setRefreshing(false);
    }
  };

  const refreshMapAddresses = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const pickup = await reverseGeocode(pickupCoord);
      const drop = await reverseGeocode(dropCoord);
      setPickupAddress(pickup);
      setDropAddress(drop);
      appendLog("Map addresses refreshed");
    } finally {
      setRefreshing(false);
    }
  };

  const addStop = () => {
    if (stops.length >= 3) return;
    setStops((prev) => [...prev, ""]);
  };

  const updateStop = (index, value) => {
    setStops((prev) => prev.map((item, idx) => (idx === index ? value : item)));
  };

  const removeStop = (index) => {
    setStops((prev) => prev.filter((_, idx) => idx !== index));
    setRouteStopCoords((prev) => prev.filter((_, idx) => idx !== index));
    if (mapTarget === `stop-${index}`) {
      setMapTarget("drop");
      return;
    }
    if (mapTarget.startsWith("stop-")) {
      const currentIndex = Number(mapTarget.replace("stop-", ""));
      if (Number.isFinite(currentIndex) && currentIndex > index) {
        setMapTarget(`stop-${currentIndex - 1}`);
      }
    }
    appendLog(`Stop ${index + 1} removed`);
  };

  const loadStreetRoute = async (fromCoord, toCoord, options = {}) => {
    const viaCoords = options.viaCoords || [];
    const path = [fromCoord, ...viaCoords, toCoord];
    setRouteLoading(true);
    try {
      const points = path.map((coord) => `${coord.longitude},${coord.latitude}`).join(";");
      const routeUrl = new URL(`https://router.project-osrm.org/route/v1/driving/${points}`);
      routeUrl.searchParams.set("overview", "full");
      routeUrl.searchParams.set("geometries", "geojson");
      const response = await fetch(routeUrl.toString());
      if (!response.ok) throw new Error("Street route unavailable");
      const data = await response.json();
      const route = data.routes?.[0];
      const geometry = route?.geometry?.coordinates;
      if (!Array.isArray(geometry) || geometry.length < 2) {
        throw new Error("Street route unavailable");
      }
      const mappedCoords = geometry.map(([longitude, latitude]) => ({ latitude, longitude }));
      setRouteCoords(mappedCoords);
      setRouteDistanceKm(Number((route.distance / 1000).toFixed(1)));
      setRouteDurationMin(Math.max(1, Math.round(route.duration / 60)));
      return;
    } catch {
      const fallbackDistance = Number(totalDistanceKm(path).toFixed(1));
      setRouteCoords(path);
      setRouteDistanceKm(fallbackDistance);
      setRouteDurationMin(Math.max(1, Math.round((fallbackDistance / 25) * 60)));
      appendLog("Street route unavailable, using direct path");
    } finally {
      setRouteLoading(false);
    }
  };

  const resolveCoordForAddress = async (address, fallbackCoord, fieldName) => {
    const trimmed = address?.trim();
    const placeholders = {
      pickup: "Pickup location",
      drop: "Drop location"
    };
    if (!trimmed || trimmed === placeholders[fieldName]) {
      throw new Error(`Enter ${fieldName} address`);
    }
    try {
      const result = await geocode(trimmed);
      return {
        coord: { latitude: result.latitude, longitude: result.longitude },
        label: result.label || trimmed
      };
    } catch {
      if (fallbackCoord) {
        appendLog(`Using saved ${fieldName} coordinate`);
        return { coord: fallbackCoord, label: trimmed };
      }
      throw new Error(`Unable to resolve ${fieldName} address`);
    }
  };

  const continueToMap = async () => {
    const pickupResult = await resolveCoordForAddress(pickupAddress, pickupCoord, "pickup");
    const dropResult = await resolveCoordForAddress(dropAddress, dropCoord, "drop");

    const cleanStops = stops.map((item) => item.trim()).filter(Boolean);
    const nextStopCoords = [];
    for (const stop of cleanStops) {
      try {
        const result = await geocode(stop);
        nextStopCoords.push({ latitude: result.latitude, longitude: result.longitude });
      } catch {
        appendLog(`Skipped stop: ${stop}`);
      }
    }

    setPickupCoord(pickupResult.coord);
    setDropCoord(dropResult.coord);
    setPickupAddress(pickupResult.label);
    setDropAddress(dropResult.label);
    setRouteStopCoords(nextStopCoords);
    setUiMode("map");

    await loadStreetRoute(pickupResult.coord, dropResult.coord, {
      viaCoords: nextStopCoords
    });
  };

  const setLocationForTarget = (value) => {
    if (mapTarget === "pickup") {
      setPickupAddress(value);
      return;
    }
    if (mapTarget === "drop") {
      setDropAddress(value);
      return;
    }
    const index = Number(mapTarget.replace("stop-", ""));
    if (Number.isFinite(index) && index < stops.length) {
      updateStop(index, value);
    }
  };

  const onDragPickup = async (coord) => {
    setPickupCoord(coord);
    setMapTarget("pickup");
    try {
      const label = await resolveAddressFromCoord(coord);
      setPickupAddress(label);
      appendLog("Pickup pin moved");
    } catch {
      setPickupAddress(`${coord.latitude.toFixed(5)}, ${coord.longitude.toFixed(5)}`);
    }
    await loadStreetRoute(coord, dropCoord, { viaCoords: routeStopCoords });
  };

  const onDragDrop = async (coord) => {
    setDropCoord(coord);
    setMapTarget("drop");
    try {
      const label = await resolveAddressFromCoord(coord);
      setDropAddress(label);
      appendLog("Drop pin moved");
    } catch {
      setDropAddress(`${coord.latitude.toFixed(5)}, ${coord.longitude.toFixed(5)}`);
    }
    await loadStreetRoute(pickupCoord, coord, { viaCoords: routeStopCoords });
  };

  const applyMapSelection = () => {
    setUiMode("address");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      {uiMode === "address" ? (
        <AddressScreen
          pickupAddress={pickupAddress}
          dropAddress={dropAddress}
          stops={stops}
          mapTarget={mapTarget}
          onSetTarget={setMapTarget}
          onAddStop={addStop}
          onRemoveStop={removeStop}
          onRecentPick={setLocationForTarget}
          onSelectOnMap={() => setUiMode("map")}
          onUseCurrentLocation={withAction(locateCurrent)}
          onBack={() => setUiMode("home")}
          onContinue={withAction(continueToMap)}
          refreshing={refreshing}
          onRefresh={onRefreshAll}
        />
      ) : null}

      {uiMode === "map" ? (
        <MapScreen
          pickupCoord={pickupCoord}
          dropCoord={dropCoord}
          stopCoords={routeStopCoords}
          currentCoord={currentCoord}
          routeCoords={routeCoords}
          routeDistanceKm={routeDistanceKm}
          routeDurationMin={routeDurationMin}
          routeLoading={routeLoading}
          pickupAddress={pickupAddress}
          dropAddress={dropAddress}
          mapTarget={mapTarget}
          onSetTarget={setMapTarget}
          onDragPickup={onDragPickup}
          onDragDrop={onDragDrop}
          onBack={() => setUiMode("address")}
          onApply={applyMapSelection}
          onRefresh={withAction(locateCurrent)}
        />
      ) : null}

      {uiMode === "home" ? (
        <>
          <View style={styles.homeTop}>
            <View style={styles.brandBlock}>
              <Text style={styles.brandName}>RYDEX</Text>
              <Text style={styles.brandTagline}>Your Ride, On Time</Text>
            </View>
            <TouchableOpacity style={styles.searchBar} onPress={() => setUiMode("address")}>
              <Text style={styles.searchIcon}>⌕</Text>
              <Text style={styles.searchText}>Enter pickup location</Text>
            </TouchableOpacity>

            <View style={styles.currentRideCard}>
              <Text style={styles.currentRideTitle}>Current Ride</Text>
              <Text style={styles.currentRideText}>{ride ? `${ride.id} - ${ride.status}` : "No active ride"}</Text>
              <View style={styles.row}>
                <SmallButton label="Refresh" onPress={withAction(refreshRide)} />
                <SmallButton label="Cancel" onPress={withAction(cancelRide)} />
                <SmallButton label="Pay" onPress={withAction(payRide)} />
              </View>
            </View>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.homeContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshAll} />}
          >
            {tab === "Ride" ? (
              <>
                <View style={styles.suggestionsHead}>
                  <Text style={styles.sectionTitle}>Suggestions</Text>
                  <Text style={styles.suggestArrow}>→</Text>
                </View>
                <View style={styles.suggestionsGrid}>
                  {SUGGESTIONS.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.suggestCard}
                      onPress={() => {
                        appendLog(`${item.title} selected`);
                        setUiMode("address");
                      }}
                    >
                      <Image source={{ uri: item.image }} style={styles.suggestImage} />
                      <Text style={styles.suggestTitle}>{item.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.banner}>
                  <Text style={styles.bannerTitle}>We're now closer to you</Text>
                  <Text style={styles.bannerSub}>Now in more cities</Text>
                </View>
              </>
            ) : null}

            {tab === "Profile" ? (
              <ProfileScreen
                profileName={profileName}
                phoneNumber={phoneNumber}
                profileEmail={profileEmail}
                pickupAddress={pickupAddress}
                dropAddress={dropAddress}
                backendUrl={backendUrl}
                otp={otp}
                riderId={riderId}
                cancelReason={cancelReason}
                paymentMethod={paymentMethod}
                onProfileName={setProfileName}
                onPhoneNumber={setPhoneNumber}
                onProfileEmail={setProfileEmail}
                onBackendUrl={setBackendUrl}
                onOtp={setOtp}
                onRiderId={setRiderId}
                onCancelReason={setCancelReason}
                onPaymentMethod={setPaymentMethod}
                onSaveProfile={withAction(saveProfile)}
                onRequestOtp={withAction(requestOtp)}
                onLogin={withAction(login)}
                log={log}
              />
            ) : null}

            {tab !== "Ride" && tab !== "Profile" ? (
              <View style={styles.placeholderCard}>
                <Text style={styles.placeholderTitle}>{tab}</Text>
                <Text style={styles.placeholderSub}>This section is being prepared.</Text>
              </View>
            ) : null}
          </ScrollView>

          <View style={styles.tabBarWrap}>
            <View style={styles.tabBar}>
              {TAB_ITEMS.map((item) => (
                <TouchableOpacity key={item.key} style={styles.tabItem} onPress={() => setTab(item.key)}>
                  <View style={[styles.tabIconWrap, tab === item.key && styles.tabIconWrapActive]}>
                    <Text style={[styles.tabIcon, tab === item.key && styles.tabIconActive]}>{item.icon}</Text>
                  </View>
                  <Text style={[styles.tabLabel, tab === item.key && styles.tabLabelActive]}>{item.key}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
      ) : null}
    </SafeAreaView>
  );
}

function AddressScreen({
  pickupAddress,
  dropAddress,
  stops,
  mapTarget,
  onSetTarget,
  onAddStop,
  onRemoveStop,
  onRecentPick,
  onSelectOnMap,
  onUseCurrentLocation,
  onBack,
  onContinue,
  refreshing,
  onRefresh
}) {
  return (
    <View style={styles.overlayScreen}>
      <View style={styles.addressHeader}>
        <TouchableOpacity onPress={onBack}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
        <Text style={styles.addressHeaderTitle}>Pickup</Text>
        <TouchableOpacity style={styles.forMeChip}><Text style={styles.forMeText}>For me</Text></TouchableOpacity>
      </View>

      <View style={styles.alertCard}>
        <Text style={styles.alertText}>Uh oh, we can't find you! Enter your pickup location for a smooth ride.</Text>
      </View>

      <View style={styles.routeCard}>
        <TouchableOpacity style={styles.routeRow} onPress={() => onSetTarget("pickup")}>
          <Text style={styles.greenDot}>●</Text>
          <Text style={styles.routeValue}>{pickupAddress}</Text>
        </TouchableOpacity>
        <View style={styles.routeDivider} />
        <TouchableOpacity style={styles.routeRow} onPress={() => onSetTarget("drop")}>
          <Text style={styles.redDot}>●</Text>
          <Text style={styles.routeValue}>{dropAddress}</Text>
        </TouchableOpacity>
        {stops.map((stop, index) => (
          <View key={`stop-${index}`}>
            <View style={styles.routeDivider} />
            <View style={styles.stopRow}>
              <TouchableOpacity style={styles.stopTouch} onPress={() => onSetTarget(`stop-${index}`)}>
                <Text style={styles.stopDot}>●</Text>
                <Text style={styles.routeValue}>{stop || `Stop ${index + 1}`}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.removeStopBtn} onPress={() => onRemoveStop(index)}>
                <Text style={styles.removeStopText}>-</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.addressActions}>
        <TouchableOpacity style={styles.actionGhost} onPress={onUseCurrentLocation}>
          <Text style={styles.actionText}>Use current</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionGhost} onPress={onSelectOnMap}>
          <Text style={styles.actionText}>Select on map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionFill} onPress={onAddStop}>
          <Text style={styles.actionText}>Add stops</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.targetHint}>Editing: {mapTarget}</Text>

      <ScrollView
        style={styles.recentList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {RECENT_LOCATIONS.map((item) => (
          <TouchableOpacity key={item} style={styles.recentItem} onPress={() => onRecentPick(item)}>
            <Text style={styles.recentTitle}>{item}</Text>
            <Text style={styles.recentSubtitle}>Tap to use this address</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.bottomCta} onPress={onContinue}>
        <Text style={styles.bottomCtaText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

function MapScreen({
  pickupCoord,
  dropCoord,
  stopCoords,
  currentCoord,
  routeCoords,
  routeDistanceKm,
  routeDurationMin,
  routeLoading,
  pickupAddress,
  dropAddress,
  mapTarget,
  onSetTarget,
  onDragPickup,
  onDragDrop,
  onBack,
  onApply,
  onRefresh
}) {
  const mapRef = useRef(null);
  const region = {
    latitude: currentCoord?.latitude || (pickupCoord.latitude + dropCoord.latitude) / 2,
    longitude: currentCoord?.longitude || (pickupCoord.longitude + dropCoord.longitude) / 2,
    latitudeDelta: 0.12,
    longitudeDelta: 0.12
  };
  const pathToFit = useMemo(() => {
    if (routeCoords.length > 1) return routeCoords;
    return [pickupCoord, ...stopCoords, dropCoord];
  }, [dropCoord, pickupCoord, routeCoords, stopCoords]);

  useEffect(() => {
    if (!mapRef.current || pathToFit.length < 2) return;
    const timer = setTimeout(() => {
      mapRef.current?.fitToCoordinates(pathToFit, {
        edgePadding: { top: 120, right: 70, bottom: 280, left: 70 },
        animated: true
      });
    }, 120);
    return () => clearTimeout(timer);
  }, [pathToFit]);

  return (
    <View style={styles.overlayScreen}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          initialRegion={region}
          customMapStyle={PREMIUM_MAP_STYLE}
          showsUserLocation
          showsMyLocationButton
          showsCompass
        >
          {routeCoords.length > 1 ? (
            <Polyline coordinates={routeCoords} strokeColor="#111111" strokeWidth={4} lineCap="round" lineJoin="round" />
          ) : null}
          <Marker
            coordinate={pickupCoord}
            anchor={{ x: 0.5, y: 1 }}
            draggable
            title="Pickup"
            onDragEnd={(event) => onDragPickup(event.nativeEvent.coordinate)}
          >
            <View style={styles.mapPin}>
              <View style={[styles.mapPinHead, styles.mapPinPickup]}>
                <View style={styles.mapPinInner} />
              </View>
              <View style={[styles.mapPinStem, styles.mapPinPickup]} />
            </View>
          </Marker>
          {stopCoords.map((coord, index) => (
            <Marker key={`map-stop-${index}`} coordinate={coord} anchor={{ x: 0.5, y: 0.5 }} title={`Stop ${index + 1}`}>
              <View style={styles.mapStopPin}>
                <Text style={styles.mapStopPinText}>{index + 1}</Text>
              </View>
            </Marker>
          ))}
          <Marker
            coordinate={dropCoord}
            anchor={{ x: 0.5, y: 1 }}
            draggable
            title="Drop"
            onDragEnd={(event) => onDragDrop(event.nativeEvent.coordinate)}
          >
            <View style={styles.mapPin}>
              <View style={[styles.mapPinHead, styles.mapPinDrop]}>
                <View style={styles.mapPinInner} />
              </View>
              <View style={[styles.mapPinStem, styles.mapPinDrop]} />
            </View>
          </Marker>
        </MapView>

        <TouchableOpacity style={styles.mapBackBtn} onPress={onBack}>
          <Text style={styles.mapBtnText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mapRefreshBtn} onPress={onRefresh}>
          <Text style={styles.mapBtnText}>↻</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapSheet}>
        <View style={styles.sheetTop}>
          <Text style={styles.sheetTitle}>Select your location</Text>
          <TouchableOpacity style={styles.changeBtn} onPress={() => onSetTarget(mapTarget === "pickup" ? "drop" : "pickup")}>
            <Text style={styles.changeBtnText}>Change</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.addressCard}>
          <Text style={styles.addressLabel}>Pickup (Green Pin)</Text>
          <Text style={styles.addressText}>{pickupAddress}</Text>
        </View>
        <View style={styles.addressCard}>
          <Text style={styles.addressLabel}>Drop (Red Pin)</Text>
          <Text style={styles.addressText}>{dropAddress}</Text>
        </View>
        <View style={styles.distanceCard}>
          <Text style={styles.distanceTitle}>Distance by road</Text>
          <Text style={styles.distanceValue}>
            {routeDistanceKm !== null ? `${routeDistanceKm} km` : routeLoading ? "Calculating..." : "--"}
          </Text>
          {routeDurationMin !== null ? <Text style={styles.distanceSub}>{routeDurationMin} min approx.</Text> : null}
        </View>

        <TouchableOpacity style={styles.bottomCta} onPress={onApply}>
          <Text style={styles.bottomCtaText}>{mapTarget === "drop" ? "Select Drop" : "Select Pickup"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ProfileScreen({
  profileName,
  phoneNumber,
  profileEmail,
  pickupAddress,
  dropAddress,
  backendUrl,
  otp,
  riderId,
  cancelReason,
  paymentMethod,
  onProfileName,
  onPhoneNumber,
  onProfileEmail,
  onBackendUrl,
  onOtp,
  onRiderId,
  onCancelReason,
  onPaymentMethod,
  onSaveProfile,
  onRequestOtp,
  onLogin,
  log
}) {
  return (
    <View style={styles.profileWrap}>
      <View style={styles.profileCard}>
        <Text style={styles.profileName}>{profileName}</Text>
        <Text style={styles.profilePhone}>{phoneNumber}</Text>
        <Text style={styles.profileMeta}>{profileEmail}</Text>
        <Text style={styles.profileMeta}>Pickup: {pickupAddress}</Text>
        <Text style={styles.profileMeta}>Drop: {dropAddress}</Text>
      </View>

      <View style={styles.profileActions}>
        <TouchableOpacity style={styles.profileActionBtn}><Text style={styles.profileActionText}>Saved Places</Text></TouchableOpacity>
        <TouchableOpacity style={styles.profileActionBtn}><Text style={styles.profileActionText}>Payment Methods</Text></TouchableOpacity>
        <TouchableOpacity style={styles.profileActionBtn}><Text style={styles.profileActionText}>Help & Support</Text></TouchableOpacity>
      </View>

      <View style={styles.devCard}>
        <Text style={styles.devTitle}>Edit Profile</Text>
        <Field label="Name" value={profileName} onChangeText={onProfileName} />
        <Field label="Phone Number" value={phoneNumber} onChangeText={onPhoneNumber} />
        <Field label="Email" value={profileEmail} onChangeText={onProfileEmail} />
        <SmallButton label="Save Profile" onPress={onSaveProfile} />
      </View>

      <View style={styles.devCard}>
        <Text style={styles.devTitle}>Developer Controls</Text>
        <Field label="Backend URL" value={backendUrl} onChangeText={onBackendUrl} />
        <Field label="OTP" value={otp} onChangeText={onOtp} />
        <Field label="Rider ID" value={riderId} onChangeText={onRiderId} />
        <Field label="Cancel Reason" value={cancelReason} onChangeText={onCancelReason} />
        <Field label="Payment Method" value={paymentMethod} onChangeText={onPaymentMethod} />
        <View style={styles.row}>
          <SmallButton label="Request OTP" onPress={onRequestOtp} />
          <SmallButton label="Login" onPress={onLogin} />
        </View>
        <Text style={styles.logTitle}>Activity</Text>
        {log.map((item, index) => (
          <Text key={`${index}-${item}`} style={styles.logItem}>{item}</Text>
        ))}
      </View>
    </View>
  );
}

function Field({ label, value, onChangeText }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} style={styles.fieldInput} placeholderTextColor="#7a8ba1" />
    </View>
  );
}

function SmallButton({ label, onPress }) {
  return (
    <TouchableOpacity style={styles.smallBtn} onPress={onPress}>
      <Text style={styles.smallBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f7fb" },
  overlayScreen: { flex: 1, backgroundColor: "#f5f7fb" },

  homeTop: { padding: 14, gap: 10 },
  brandBlock: { gap: 1 },
  brandName: { color: "#0f2532", fontSize: 28, fontWeight: "900", letterSpacing: 0.4 },
  brandTagline: { color: "#3f5d69", fontSize: 13, fontWeight: "700" },
  searchBar: {
    height: 52,
    borderRadius: 26,
    backgroundColor: "#eceff4",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  searchIcon: { fontSize: 18, color: "#1b2a3f", fontWeight: "700" },
  searchText: { fontSize: 18, color: "#101a2a", fontWeight: "700" },

  currentRideCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dbe3ef",
    borderRadius: 16,
    padding: 10
  },
  currentRideTitle: { color: "#1f2d40", fontWeight: "800", fontSize: 14 },
  currentRideText: { color: "#52647d", marginTop: 3, marginBottom: 8, fontSize: 12 },

  scroll: { flex: 1 },
  homeContent: { paddingHorizontal: 14, paddingBottom: 120 },
  sectionTitle: { color: "#1f2d40", fontSize: 18, fontWeight: "800", marginBottom: 10 },
  suggestionsHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  suggestArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eef2f7",
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: 36,
    color: "#2b3f5d",
    fontSize: 22,
    fontWeight: "700"
  },
  suggestionsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 0, columnGap: 0 },
  suggestCard: {
    width: "24.6%",
    backgroundColor: "#eceef2",
    borderRadius: 10,
    minHeight: 106,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    paddingHorizontal: 4,
    marginBottom: 2
  },
  suggestImage: { width: 34, height: 34, marginBottom: 7 },
  suggestTitle: { color: "#1a283d", fontSize: 12, fontWeight: "700", textAlign: "center" },
  servicesGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 9 },
  serviceCard: { width: "48.5%", borderRadius: 18, padding: 10, minHeight: 140, overflow: "hidden" },
  serviceSub: { color: "#445a74", fontSize: 12 },
  serviceTitle: { color: "#152236", fontSize: 22, fontWeight: "800" },
  serviceImage: { width: "58%", height: 72, borderRadius: 10, alignSelf: "flex-end", marginTop: 8 },

  banner: { marginTop: 14, borderRadius: 16, backgroundColor: "#eaf0fa", padding: 12 },
  bannerTitle: { color: "#1a2a41", fontWeight: "800", fontSize: 16 },
  bannerSub: { color: "#4c617d", marginTop: 2, fontSize: 13 },

  devCard: {
    marginTop: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d7e1f0",
    borderRadius: 16,
    padding: 12
  },
  devTitle: { color: "#1f2c40", fontWeight: "800", fontSize: 16, marginBottom: 8 },
  fieldWrap: { marginBottom: 8 },
  fieldLabel: { color: "#304760", fontWeight: "700", fontSize: 12, marginBottom: 3 },
  fieldInput: {
    borderWidth: 1,
    borderColor: "#c2d1e6",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fbfdff",
    color: "#12243b"
  },

  row: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  smallBtn: { backgroundColor: BRAND, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  smallBtnText: { color: "#1a1a1a", fontWeight: "800", fontSize: 12 },

  logTitle: { color: "#33485f", fontWeight: "700", marginTop: 8, marginBottom: 6 },
  logItem: { color: "#4b5e78", marginBottom: 4, fontSize: 12 },

  tabBarWrap: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 10
  },
  tabBar: {
    height: 72,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dce4f2",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6
  },
  tabItem: { flex: 1, alignItems: "center", justifyContent: "center", gap: 2 },
  tabIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center"
  },
  tabIconWrapActive: { backgroundColor: "#d9f2ec" },
  tabIcon: { color: "#617387", fontSize: 14, fontWeight: "700" },
  tabIconActive: { color: BRAND },
  tabLabel: { color: "#617387", fontSize: 11, fontWeight: "700" },
  tabLabelActive: { color: "#14263d", fontWeight: "900" },

  profileWrap: { gap: 10, marginBottom: 12 },
  profileCard: {
    marginTop: 2,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbe3ef",
    borderRadius: 16,
    padding: 12
  },
  profileName: { color: "#16263f", fontSize: 18, fontWeight: "900" },
  profilePhone: { color: "#48617c", marginTop: 2, fontSize: 13, fontWeight: "700" },
  profileMeta: { color: "#5e7290", marginTop: 5, fontSize: 12 },
  profileActions: { gap: 8 },
  profileActionBtn: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbe3ef",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12
  },
  profileActionText: { color: "#1f2f46", fontSize: 14, fontWeight: "700" },

  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  backIcon: { fontSize: 26, color: "#1a2539" },
  addressHeaderTitle: { fontSize: 20, fontWeight: "800", color: "#141f31", flex: 1, marginLeft: 8 },
  forMeChip: {
    borderWidth: 1,
    borderColor: "#cfd8e7",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  forMeText: { color: "#2f425b", fontWeight: "700", fontSize: 12 },
  alertCard: {
    marginHorizontal: 14,
    marginTop: 4,
    backgroundColor: "#f8eded",
    borderRadius: 14,
    padding: 10
  },
  alertText: { color: "#3d4d63", fontSize: 12, fontWeight: "700" },

  routeCard: {
    marginHorizontal: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#d4dce8",
    borderRadius: 16,
    backgroundColor: "#fff"
  },
  routeRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, minHeight: 50 },
  stopRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, minHeight: 50, gap: 8 },
  stopTouch: { flex: 1, flexDirection: "row", alignItems: "center", minHeight: 50 },
  routeDivider: { height: 1, backgroundColor: "#e2e8f2", marginLeft: 34 },
  greenDot: { color: "#1fad59", fontSize: 18, width: 20 },
  redDot: { color: "#de4a3e", fontSize: 18, width: 20 },
  stopDot: { color: "#355783", fontSize: 16, width: 20 },
  routeValue: { flex: 1, color: "#172438", fontSize: 14, fontWeight: "700", paddingVertical: 4 },
  removeStopBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#c7d2e3",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  removeStopText: { color: "#18263a", fontSize: 18, fontWeight: "900", marginTop: -2 },

  addressActions: { flexDirection: "row", gap: 10, marginHorizontal: 14, marginTop: 12 },
  actionGhost: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#cfd8e7",
    borderRadius: 999,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 46
  },
  actionFill: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#cfd8e7",
    borderRadius: 999,
    backgroundColor: "#eff2f6",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 46
  },
  actionText: { fontSize: 14, color: "#1e2b3e", fontWeight: "700" },
  targetHint: { marginHorizontal: 16, marginTop: 8, color: "#697b92", fontSize: 12 },

  recentList: { marginTop: 4, paddingHorizontal: 14, marginBottom: 88 },
  recentItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#dfe5ef" },
  recentTitle: { fontSize: 14, color: "#18253a", fontWeight: "800" },
  recentSubtitle: { marginTop: 2, color: "#5f7188", fontSize: 11 },

  bottomCta: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    backgroundColor: BRAND,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52
  },
  bottomCtaText: { color: "#ffffff", fontSize: 17, fontWeight: "800" },

  mapContainer: { flex: 1 },
  mapBackBtn: {
    position: "absolute",
    left: 14,
    top: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  mapRefreshBtn: {
    position: "absolute",
    right: 14,
    top: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  mapBtnText: { fontSize: 22, color: "#1a2b41" },
  mapPin: { alignItems: "center" },
  mapPinHead: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center"
  },
  mapPinPickup: { backgroundColor: "#18a958" },
  mapPinDrop: { backgroundColor: "#111111" },
  mapPinInner: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#ffffff" },
  mapPinStem: { width: 3, height: 16, marginTop: -1, borderRadius: 2 },
  mapStopPin: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 6,
    backgroundColor: "#344f6f",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ffffff"
  },
  mapStopPinText: { color: "#ffffff", fontSize: 12, fontWeight: "800" },

  mapSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 12,
    minHeight: 270
  },
  sheetTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sheetTitle: { color: "#1b2a3d", fontSize: 18, fontWeight: "800" },
  changeBtn: {
    borderWidth: 1,
    borderColor: "#cfd8e7",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7
  },
  changeBtnText: { color: "#3a4f6a", fontWeight: "700" },
  addressCard: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#d8e1ef",
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#f9fbff"
  },
  addressLabel: { color: "#425773", fontWeight: "700", fontSize: 12 },
  addressText: { marginTop: 2, color: "#1b2a3d", fontSize: 13, fontWeight: "600" }
  ,
  distanceCard: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#d8e1ef",
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#f9fbff"
  },
  distanceTitle: { color: "#425773", fontWeight: "700", fontSize: 12 },
  distanceValue: { marginTop: 2, color: "#111111", fontSize: 20, fontWeight: "900" },
  distanceSub: { marginTop: 2, color: "#4f627a", fontSize: 12, fontWeight: "600" }
});
