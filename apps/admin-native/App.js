import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";

const TABS = ["Dashboard", "Rides", "Payments", "Captains", "Settings"];
const PAYMENT_METHODS = ["CASH", "UPI", "CARD"];

function detectDefaultBackendUrl() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    Constants.manifest?.debuggerHost ||
    "";
  const host = typeof hostUri === "string" ? hostUri.split(":")[0] : "";
  if (host) {
    return `http://${host}:4000`;
  }
  if (Platform.OS === "android") {
    return "http://10.0.2.2:4000";
  }
  return "http://localhost:4000";
}

function shortId(value = "") {
  if (value.length <= 12) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export default function App() {
  const [backendUrl, setBackendUrl] = useState(detectDefaultBackendUrl);
  const [phoneNumber, setPhoneNumber] = useState("+919911112222");
  const [otp, setOtp] = useState("123456");
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("Dashboard");
  const [loading, setLoading] = useState(false);
  const [rides, setRides] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [availableCaptains, setAvailableCaptains] = useState([]);
  const [captainIdInput, setCaptainIdInput] = useState("");
  const [payoutSummary, setPayoutSummary] = useState(null);
  const [log, setLog] = useState([]);

  const normalizedBase = useMemo(() => backendUrl.trim().replace(/\/$/, ""), [backendUrl]);

  const appendLog = (message) => {
    const entry = `${new Date().toLocaleTimeString()} - ${message}`;
    setLog((prev) => [entry, ...prev].slice(0, 20));
  };

  const safeJson = async (response) => {
    try {
      return await response.json();
    } catch {
      return {};
    }
  };

  const apiFetch = async (path, options = {}, overrideToken) => {
    const token = overrideToken || accessToken;
    const headers = {
      "content-type": "application/json",
      ...(options.headers || {})
    };
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    try {
      return await fetch(`${normalizedBase}${path}`, {
        ...options,
        headers
      });
    } catch {
      throw new Error(`Network request failed. Check backend URL: ${normalizedBase}`);
    }
  };

  const withAction = (action) => async () => {
    try {
      await action();
    } catch (error) {
      appendLog(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const requestOtp = async () => {
    const response = await apiFetch("/auth/request-otp", {
      method: "POST",
      body: JSON.stringify({ phoneNumber: phoneNumber.trim() })
    });
    const data = await safeJson(response);
    if (!response.ok) {
      throw new Error(data.message || "OTP request failed");
    }
    appendLog(`OTP sent. Dev OTP: ${data.devOtp || "123456"}`);
  };

  const testBackendConnection = async () => {
    const response = await apiFetch("/health");
    const data = await safeJson(response);
    if (!response.ok) throw new Error(data.message || "Backend health check failed");
    appendLog(`Backend connected: ${normalizedBase}`);
  };

  const loginAsAdmin = async () => {
    const response = await apiFetch("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({
        phoneNumber: phoneNumber.trim(),
        otp: otp.trim(),
        role: "ADMIN"
      })
    });
    const data = await safeJson(response);
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }
    if (data?.user?.role !== "ADMIN") {
      throw new Error("This phone is not mapped as ADMIN. Use a fresh phone number.");
    }
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken || "");
    setUser(data.user);
    appendLog(`Logged in as ADMIN (${data.user.phoneNumber})`);
    await refreshAll(data.accessToken);
  };

  const refreshSession = async () => {
    if (!refreshToken) throw new Error("No refresh token");
    const response = await apiFetch("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken })
    });
    const data = await safeJson(response);
    if (!response.ok) {
      throw new Error(data.message || "Session refresh failed");
    }
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    appendLog("Session refreshed");
    return data.accessToken;
  };

  const refreshAll = async (tokenOverride) => {
    const token = tokenOverride || accessToken;
    if (!token) return;
    setLoading(true);
    try {
      const [ridesRes, pendingRes, captainsRes] = await Promise.all([
        apiFetch("/rides", {}, token),
        apiFetch("/payments/pending", {}, token),
        apiFetch("/captains/available", {}, token)
      ]);

      if (ridesRes.status === 401 || pendingRes.status === 401 || captainsRes.status === 401) {
        const newToken = await refreshSession();
        return refreshAll(newToken);
      }

      const ridesData = await safeJson(ridesRes);
      const pendingData = await safeJson(pendingRes);
      const captainsData = await safeJson(captainsRes);

      if (!ridesRes.ok) throw new Error(ridesData.message || "Could not fetch rides");
      if (!pendingRes.ok) throw new Error(pendingData.message || "Could not fetch pending payments");
      if (!captainsRes.ok) throw new Error(captainsData.message || "Could not fetch captains");

      setRides(Array.isArray(ridesData) ? ridesData : []);
      setPendingPayments(Array.isArray(pendingData) ? pendingData : []);
      setAvailableCaptains(Array.isArray(captainsData) ? captainsData : []);
      appendLog("Admin data refreshed");
    } finally {
      setLoading(false);
    }
  };

  const updateRideStatus = async (rideId, status) => {
    const response = await apiFetch(`/rides/${rideId}/status`, {
      method: "POST",
      body: JSON.stringify({ status })
    });
    const data = await safeJson(response);
    if (!response.ok) throw new Error(data.message || "Status update failed");
    appendLog(`Ride ${shortId(rideId)} -> ${status}`);
    await refreshAll();
  };

  const autoAssignRide = async (rideId) => {
    const response = await apiFetch(`/rides/${rideId}/auto-assign`, { method: "POST" });
    const data = await safeJson(response);
    if (!response.ok) throw new Error(data.message || "Auto-assign failed");
    appendLog(`Ride ${shortId(rideId)} auto-assigned`);
    await refreshAll();
  };

  const cancelRide = async (rideId) => {
    const response = await apiFetch(`/rides/${rideId}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason: "Cancelled by admin" })
    });
    const data = await safeJson(response);
    if (!response.ok) throw new Error(data.message || "Cancel failed");
    appendLog(`Ride ${shortId(rideId)} cancelled`);
    await refreshAll();
  };

  const collectPayment = async (rideId, method) => {
    const response = await apiFetch(`/payments/rides/${rideId}/collect`, {
      method: "POST",
      body: JSON.stringify({ method })
    });
    const data = await safeJson(response);
    if (!response.ok) throw new Error(data.message || "Payment collect failed");
    appendLog(`Payment collected: ${shortId(rideId)} via ${method}`);
    await refreshAll();
  };

  const fetchPayoutSummary = async () => {
    const captainId = captainIdInput.trim();
    if (!captainId) throw new Error("Enter captain ID");
    const response = await apiFetch(`/payouts/captains/${captainId}/summary`);
    const data = await safeJson(response);
    if (!response.ok) throw new Error(data.message || "Summary fetch failed");
    setPayoutSummary(data);
    appendLog(`Loaded payout summary for ${captainId}`);
  };

  const settleCaptainPayout = async () => {
    const captainId = captainIdInput.trim();
    if (!captainId) throw new Error("Enter captain ID");
    const response = await apiFetch(`/payouts/captains/${captainId}/settle`, {
      method: "POST"
    });
    const data = await safeJson(response);
    if (!response.ok) throw new Error(data.message || "Payout settle failed");
    appendLog(`Settled payouts: ${data.settledCount} rides`);
    await fetchPayoutSummary();
  };

  const logout = () => {
    setAccessToken("");
    setRefreshToken("");
    setUser(null);
    setRides([]);
    setPendingPayments([]);
    setAvailableCaptains([]);
    setPayoutSummary(null);
    setTab("Dashboard");
    appendLog("Logged out");
  };

  const dashboardStats = {
    totalRides: rides.length,
    completedRides: rides.filter((item) => item.status === "COMPLETED").length,
    activeRides: rides.filter((item) => !["COMPLETED", "CANCELLED"].includes(item.status)).length,
    pendingPayments: pendingPayments.length,
    availableCaptains: availableCaptains.length
  };

  if (!accessToken) {
    return (
      <View style={styles.safe}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.authWrap}>
          <Text style={styles.brand}>RYDEX Admin</Text>
          <Text style={styles.subtitle}>Sign in with ADMIN role</Text>

          <Field label="Backend URL" value={backendUrl} onChangeText={setBackendUrl} />
          <Field label="Admin Phone" value={phoneNumber} onChangeText={setPhoneNumber} />
          <Field label="OTP" value={otp} onChangeText={setOtp} />

          <TouchableOpacity style={styles.primaryBtn} onPress={withAction(requestOtp)}>
            <Text style={styles.primaryBtnText}>Request OTP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={withAction(testBackendConnection)}>
            <Text style={styles.secondaryBtnText}>Test Connection</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={withAction(loginAsAdmin)}>
            <Text style={styles.secondaryBtnText}>Login as Admin</Text>
          </TouchableOpacity>

          <Text style={styles.hintText}>Use a fresh phone number if this one is already saved as RIDER/CAPTAIN.</Text>

          <LogFeed items={log} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Console</Text>
          <Text style={styles.headerSub}>{user?.phoneNumber || "ADMIN"}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headButton} onPress={withAction(refreshAll)}>
            <Text style={styles.headButtonText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headButton} onPress={logout}>
            <Text style={styles.headButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabWrap}>
        {TABS.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.tabChip, tab === item && styles.tabChipActive]}
            onPress={() => setTab(item)}
          >
            <Text style={[styles.tabChipText, tab === item && styles.tabChipTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentPad}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={withAction(refreshAll)} />}
      >
        {tab === "Dashboard" ? (
          <View style={styles.grid}>
            <StatCard label="Total rides" value={dashboardStats.totalRides} />
            <StatCard label="Active rides" value={dashboardStats.activeRides} />
            <StatCard label="Completed rides" value={dashboardStats.completedRides} />
            <StatCard label="Pending payments" value={dashboardStats.pendingPayments} />
            <StatCard label="Available captains" value={dashboardStats.availableCaptains} />
          </View>
        ) : null}

        {tab === "Rides" ? (
          <View style={styles.section}>
            {rides.length === 0 ? <Text style={styles.emptyText}>No rides found.</Text> : null}
            {rides.map((ride) => (
              <View key={ride.id} style={styles.card}>
                <Text style={styles.cardTitle}>{shortId(ride.id)}</Text>
                <Text style={styles.cardMeta}>Status: {ride.status}</Text>
                <Text style={styles.cardMeta}>Rider: {ride.riderId}</Text>
                <Text style={styles.cardMeta}>Captain: {ride.captainId || "Not assigned"}</Text>
                <Text style={styles.cardMeta}>Fare: {ride.finalFare || ride.estimatedFare}</Text>
                <View style={styles.buttonRow}>
                  <MiniButton label="Auto assign" onPress={withAction(() => autoAssignRide(ride.id))} />
                  <MiniButton label="Arriving" onPress={withAction(() => updateRideStatus(ride.id, "DRIVER_ARRIVING"))} />
                  <MiniButton label="Start" onPress={withAction(() => updateRideStatus(ride.id, "STARTED"))} />
                  <MiniButton label="Complete" onPress={withAction(() => updateRideStatus(ride.id, "COMPLETED"))} />
                  <MiniButton label="Cancel" onPress={withAction(() => cancelRide(ride.id))} />
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {tab === "Payments" ? (
          <View style={styles.section}>
            {pendingPayments.length === 0 ? <Text style={styles.emptyText}>No pending payments.</Text> : null}
            {pendingPayments.map((item) => (
              <View key={item.rideId} style={styles.card}>
                <Text style={styles.cardTitle}>{shortId(item.rideId)}</Text>
                <Text style={styles.cardMeta}>Rider: {item.riderId}</Text>
                <Text style={styles.cardMeta}>Captain: {item.captainId || "Not assigned"}</Text>
                <Text style={styles.cardMeta}>Amount: {item.amount}</Text>
                <View style={styles.buttonRow}>
                  {PAYMENT_METHODS.map((method) => (
                    <MiniButton
                      key={`${item.rideId}-${method}`}
                      label={method}
                      onPress={withAction(() => collectPayment(item.rideId, method))}
                    />
                  ))}
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {tab === "Captains" ? (
          <View style={styles.section}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Payout settlement</Text>
              <Field label="Captain ID" value={captainIdInput} onChangeText={setCaptainIdInput} />
              <View style={styles.buttonRow}>
                <MiniButton label="Load summary" onPress={withAction(fetchPayoutSummary)} />
                <MiniButton label="Settle pending" onPress={withAction(settleCaptainPayout)} />
              </View>
              {payoutSummary ? (
                <View style={styles.summaryWrap}>
                  <Text style={styles.cardMeta}>Rides: {payoutSummary.rides}</Text>
                  <Text style={styles.cardMeta}>Total net: {payoutSummary.totalNet}</Text>
                  <Text style={styles.cardMeta}>Pending net: {payoutSummary.pendingNet}</Text>
                  <Text style={styles.cardMeta}>Settled net: {payoutSummary.settledNet}</Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.sectionTitle}>Available captains</Text>
            {availableCaptains.length === 0 ? <Text style={styles.emptyText}>No available captains.</Text> : null}
            {availableCaptains.map((captain) => (
              <View key={captain.id} style={styles.card}>
                <Text style={styles.cardTitle}>{captain.name || shortId(captain.id)}</Text>
                <Text style={styles.cardMeta}>ID: {captain.id}</Text>
                <Text style={styles.cardMeta}>Phone: {captain.phoneNumber || "-"}</Text>
                <Text style={styles.cardMeta}>
                  Location: {captain.currentLat || "-"}, {captain.currentLng || "-"}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {tab === "Settings" ? (
          <View style={styles.section}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Connection</Text>
              <Field label="Backend URL" value={backendUrl} onChangeText={setBackendUrl} />
              <Field label="Admin Phone" value={phoneNumber} onChangeText={setPhoneNumber} />
              <Text style={styles.cardMeta}>Token: {accessToken ? "Active" : "Missing"}</Text>
              <View style={styles.buttonRow}>
                <MiniButton label="Test connection" onPress={withAction(testBackendConnection)} />
              </View>
            </View>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="small" color="#111111" />
          </View>
        ) : null}

        <LogFeed items={log} />
      </ScrollView>
    </View>
  );
}

function Field({ label, value, onChangeText }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor="#98a0ad"
      />
    </View>
  );
}

function LogFeed({ items }) {
  return (
    <View style={styles.logCard}>
      <Text style={styles.logTitle}>Activity log</Text>
      {items.length === 0 ? <Text style={styles.logItem}>No activity yet.</Text> : null}
      {items.map((item) => (
        <Text key={item} style={styles.logItem}>
          {item}
        </Text>
      ))}
    </View>
  );
}

function StatCard({ label, value }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function MiniButton({ label, onPress }) {
  return (
    <TouchableOpacity style={styles.miniBtn} onPress={onPress}>
      <Text style={styles.miniBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f2f4f7"
  },
  authWrap: {
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 24,
    gap: 8
  },
  brand: {
    fontSize: 30,
    fontWeight: "900",
    color: "#0f1827"
  },
  subtitle: {
    fontSize: 14,
    color: "#47556b",
    marginBottom: 8
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#111827"
  },
  headerSub: {
    marginTop: 2,
    color: "#4b5563",
    fontSize: 13,
    fontWeight: "700"
  },
  headerActions: {
    flexDirection: "row",
    gap: 8
  },
  headButton: {
    minHeight: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#c8d0de",
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff"
  },
  headButtonText: {
    color: "#111827",
    fontWeight: "700",
    fontSize: 12
  },
  tabWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8
  },
  tabChip: {
    borderWidth: 1,
    borderColor: "#ccd3df",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#ffffff"
  },
  tabChipActive: {
    borderColor: "#101827",
    backgroundColor: "#101827"
  },
  tabChipText: {
    color: "#39465d",
    fontWeight: "700",
    fontSize: 12
  },
  tabChipTextActive: {
    color: "#ffffff"
  },
  content: {
    flex: 1
  },
  contentPad: {
    paddingHorizontal: 16,
    paddingBottom: 24
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10
  },
  statCard: {
    width: "48.5%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d8deea",
    borderRadius: 14,
    padding: 12
  },
  statLabel: {
    color: "#4f5d73",
    fontSize: 12,
    fontWeight: "700"
  },
  statValue: {
    marginTop: 4,
    color: "#0f1728",
    fontSize: 26,
    fontWeight: "900"
  },
  section: {
    gap: 10
  },
  sectionTitle: {
    color: "#101828",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 2
  },
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d8deea",
    borderRadius: 14,
    padding: 12
  },
  cardTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900"
  },
  cardMeta: {
    marginTop: 2,
    color: "#47546a",
    fontSize: 12,
    fontWeight: "600"
  },
  summaryWrap: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e3e8f2",
    paddingTop: 8
  },
  field: {
    marginTop: 8
  },
  fieldLabel: {
    color: "#334154",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: "#ccd5e4",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    minHeight: 42,
    paddingHorizontal: 10,
    color: "#101828",
    fontWeight: "600"
  },
  primaryBtn: {
    marginTop: 10,
    minHeight: 46,
    borderRadius: 12,
    backgroundColor: "#101827",
    alignItems: "center",
    justifyContent: "center"
  },
  primaryBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800"
  },
  secondaryBtn: {
    marginTop: 8,
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#c9d2df",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center"
  },
  secondaryBtnText: {
    color: "#101827",
    fontSize: 14,
    fontWeight: "800"
  },
  hintText: {
    marginTop: 8,
    color: "#5d6a7f",
    fontSize: 12
  },
  buttonRow: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  miniBtn: {
    minHeight: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#cad3e0",
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  miniBtnText: {
    color: "#101827",
    fontSize: 12,
    fontWeight: "700"
  },
  emptyText: {
    color: "#5d6a7f",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4
  },
  loaderWrap: {
    alignItems: "center",
    marginTop: 12
  },
  logCard: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#d8deea",
    borderRadius: 14,
    backgroundColor: "#ffffff",
    padding: 12
  },
  logTitle: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 6
  },
  logItem: {
    color: "#4f5d73",
    fontSize: 12,
    marginBottom: 3
  }
});
