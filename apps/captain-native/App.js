import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const BRAND = "#ffd400";

export default function App() {
  const [backendUrl, setBackendUrl] = useState("http://10.0.2.2:4000");
  const [phoneNumber, setPhoneNumber] = useState("+919900112244");
  const [otp, setOtp] = useState("123456");
  const [captainId, setCaptainId] = useState("captain_1");
  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [log, setLog] = useState([]);

  const normalizedBase = useMemo(() => backendUrl.trim().replace(/\/$/, ""), [backendUrl]);

  const appendLog = (msg) => {
    setLog((prev) => [`${new Date().toLocaleTimeString()} - ${msg}`, ...prev].slice(0, 15));
  };

  const apiFetch = async (path, options = {}) => {
    const headers = {
      "content-type": "application/json",
      ...(options.headers || {})
    };
    if (accessToken) {
      headers.authorization = `Bearer ${accessToken}`;
    }
    return fetch(`${normalizedBase}${path}`, { ...options, headers });
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
      body: JSON.stringify({ phoneNumber: phoneNumber.trim(), otp: otp.trim(), role: "CAPTAIN" })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Login failed");
    setAccessToken(data.accessToken);
    appendLog(`Logged in as ${data.user.phoneNumber}`);
  };

  const refreshRides = async () => {
    const response = await apiFetch("/rides");
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Ride list failed");
    const active = data.filter((ride) => ride.status !== "COMPLETED" && ride.status !== "CANCELLED");
    setRides(active);
    if (selectedRide?.id) {
      const latest = active.find((item) => item.id === selectedRide.id);
      if (latest) setSelectedRide(latest);
    }
    appendLog(`Loaded rides: ${active.length}`);
  };

  const assignRide = async () => {
    if (!selectedRide?.id) throw new Error("Select a ride");
    const response = await apiFetch(`/rides/${selectedRide.id}/assign`, {
      method: "POST",
      body: JSON.stringify({ captainId: captainId.trim() })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Assign failed");
    setSelectedRide(data);
    appendLog(`Assigned ${data.id}`);
    await refreshRides();
  };

  const updateStatus = async (status) => {
    if (!selectedRide?.id) throw new Error("Select a ride");
    const response = await apiFetch(`/rides/${selectedRide.id}/status`, {
      method: "POST",
      body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || `Status ${status} failed`);
    setSelectedRide(data);
    appendLog(`Updated ${data.id}: ${status}`);
    await refreshRides();
  };

  const withAction = (action) => async () => {
    try {
      await action();
    } catch (error) {
      appendLog(error instanceof Error ? error.message : "Unknown error");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.title}>Captain Native</Text>
        <Text style={styles.sub}>Mobile-first captain workflow</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Session</Text>
          <Field label="Backend URL" value={backendUrl} onChangeText={setBackendUrl} />
          <Field label="Phone" value={phoneNumber} onChangeText={setPhoneNumber} />
          <Field label="OTP" value={otp} onChangeText={setOtp} />
          <Field label="Captain ID" value={captainId} onChangeText={setCaptainId} />
          <View style={styles.row}>
            <Button label="Request OTP" secondary onPress={withAction(requestOtp)} />
            <Button label="Login" onPress={withAction(login)} />
            <Button label="Refresh Rides" secondary onPress={withAction(refreshRides)} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ride Queue</Text>
          {rides.length ? (
            rides.map((ride) => (
              <TouchableOpacity
                key={ride.id}
                style={[styles.rideCard, selectedRide?.id === ride.id && styles.rideSelected]}
                onPress={() => setSelectedRide(ride)}
              >
                <Text style={styles.rideId}>{ride.id}</Text>
                <Text style={styles.rideMeta}>Status: {ride.status}</Text>
                <Text style={styles.rideMeta}>Rider: {ride.riderId}</Text>
                <Text style={styles.rideMeta}>Captain: {ride.captainId || "Unassigned"}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.rideMeta}>No active rides</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ride Actions</Text>
          <View style={styles.row}>
            <Button label="Assign" onPress={withAction(assignRide)} />
            <Button label="Arriving" secondary onPress={withAction(() => updateStatus("DRIVER_ARRIVING"))} />
            <Button label="Start" secondary onPress={withAction(() => updateStatus("STARTED"))} />
            <Button label="Complete" onPress={withAction(() => updateStatus("COMPLETED"))} />
          </View>
          <Text style={styles.json}>{selectedRide ? JSON.stringify(selectedRide, null, 2) : "No ride selected"}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Activity</Text>
          {log.length ? log.map((item) => <Text key={item} style={styles.logItem}>{item}</Text>) : <Text style={styles.logItem}>No events yet</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, value, onChangeText }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} style={styles.input} placeholderTextColor="#7a8ba1" />
    </View>
  );
}

function Button({ label, onPress, secondary }) {
  return (
    <TouchableOpacity style={[styles.button, secondary && styles.buttonSecondary]} onPress={onPress}>
      <Text style={[styles.buttonText, secondary && styles.buttonTextSecondary]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f4f8ff" },
  page: { padding: 14, gap: 12 },
  title: { fontSize: 26, fontWeight: "800", color: "#11243f" },
  sub: { color: "#5c6f88", marginTop: -4, marginBottom: 4 },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d7e1f0",
    borderRadius: 16,
    padding: 12,
    gap: 8
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#12243b" },
  fieldWrap: { gap: 4 },
  label: { color: "#274564", fontWeight: "700", fontSize: 13 },
  input: {
    borderWidth: 1,
    borderColor: "#c2d1e6",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    color: "#12243b",
    backgroundColor: "#fbfdff"
  },
  row: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  button: {
    backgroundColor: BRAND,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  buttonSecondary: {
    backgroundColor: "#eaf1fb",
    borderWidth: 1,
    borderColor: "#d7e1f0"
  },
  buttonText: { color: "#1a1a1a", fontWeight: "800" },
  buttonTextSecondary: { color: "#1e4168" },
  rideCard: {
    borderWidth: 1,
    borderColor: "#d7e1f0",
    borderRadius: 10,
    backgroundColor: "#f8fbff",
    padding: 10,
    marginBottom: 8
  },
  rideSelected: {
    borderColor: "#e4c100",
    backgroundColor: "#fff9d6"
  },
  rideId: { color: "#12243b", fontWeight: "800", marginBottom: 4 },
  rideMeta: { color: "#2a4562", marginBottom: 2 },
  json: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#d7e1f0",
    borderRadius: 10,
    backgroundColor: "#f8fbff",
    color: "#183455",
    padding: 10,
    fontFamily: "Courier"
  },
  logItem: { color: "#2a4562", marginBottom: 4 }
});
