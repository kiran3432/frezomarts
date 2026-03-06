const ACCESS_TOKEN_KEY = "captain_app_access_token";
const REFRESH_TOKEN_KEY = "captain_app_refresh_token";

const elements = {
  backendUrl: document.getElementById("backendUrl"),
  phoneNumber: document.getElementById("phoneNumber"),
  otp: document.getElementById("otp"),
  requestOtpBtn: document.getElementById("requestOtpBtn"),
  loginBtn: document.getElementById("loginBtn"),
  captainId: document.getElementById("captainId"),
  refreshCaptainsBtn: document.getElementById("refreshCaptainsBtn"),
  simulateBtn: document.getElementById("simulateBtn"),
  refreshRidesBtn: document.getElementById("refreshRidesBtn"),
  refreshPayoutBtn: document.getElementById("refreshPayoutBtn"),
  historyStatusFilter: document.getElementById("historyStatusFilter"),
  historyPaymentFilter: document.getElementById("historyPaymentFilter"),
  loadHistoryBtn: document.getElementById("loadHistoryBtn"),
  exportHistoryBtn: document.getElementById("exportHistoryBtn"),
  historyList: document.getElementById("historyList"),
  pendingNet: document.getElementById("pendingNet"),
  settledNet: document.getElementById("settledNet"),
  rideList: document.getElementById("rideList"),
  selectedRideLabel: document.getElementById("selectedRideLabel"),
  assignBtn: document.getElementById("assignBtn"),
  arrivingBtn: document.getElementById("arrivingBtn"),
  startBtn: document.getElementById("startBtn"),
  completeBtn: document.getElementById("completeBtn"),
  captainMap: document.getElementById("captainMap"),
  rideJson: document.getElementById("rideJson"),
  timeline: document.getElementById("timeline")
};

let selectedRide = null;
let rides = [];
let socket = null;
let subscribedRideId = null;
let map = null;
let pickupMarker = null;
let dropMarker = null;
let routeLine = null;
let simulationTimer = null;

function baseUrl() {
  return elements.backendUrl.value.trim().replace(/\/$/, "");
}

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function setTokens(accessToken, refreshToken) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return false;
  }
  const response = await fetch(`${baseUrl()}/auth/refresh`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });
  if (!response.ok) {
    clearTokens();
    return false;
  }
  const data = await response.json();
  setTokens(data.accessToken, data.refreshToken);
  addLog("Session refreshed");
  return true;
}

async function apiFetch(path, options = {}, allowRefresh = true) {
  const headers = new Headers(options.headers || {});
  const accessToken = getAccessToken();
  if (accessToken) {
    headers.set("authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${baseUrl()}${path}`, {
    ...options,
    headers
  });
  if (response.status === 401 && allowRefresh) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiFetch(path, options, false);
    }
  }
  return response;
}

function addLog(text) {
  const item = document.createElement("li");
  item.textContent = `${new Date().toLocaleTimeString()} - ${text}`;
  elements.timeline.prepend(item);
}

function updateSocketSubscription(previousRideId, nextRideId) {
  subscribedRideId = nextRideId;
  if (!socket || !socket.connected) {
    return;
  }
  if (previousRideId) {
    socket.emit("trip:unsubscribe", previousRideId);
  }
  if (nextRideId) {
    socket.emit("trip:subscribe", nextRideId);
    addLog(`Subscribed to ${nextRideId}`);
  }
}

function setSelectedRide(ride) {
  const previousRideId = selectedRide?.id || null;
  selectedRide = ride;
  elements.selectedRideLabel.textContent = ride ? `${ride.id} (${ride.status})` : "No ride selected";
  elements.rideJson.textContent = ride ? JSON.stringify(ride, null, 2) : "Select a ride from queue...";
  updateSocketSubscription(previousRideId, ride?.id || null);
  updateActionState();
  if (ride) {
    updateMapFromRide(ride);
  }
}

function initMap() {
  if (!window.L || map) {
    return;
  }
  map = window.L.map(elements.captainMap).setView([12.97, 77.59], 12);
  window.L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    attribution:
      "&copy; OpenStreetMap contributors &copy; CARTO"
  }).addTo(map);
}

function updateMapFromRide(ride) {
  if (!map || !ride?.pickup || !ride?.drop) {
    return;
  }
  const pickupLatLng = [ride.pickup.lat, ride.pickup.lng];
  const dropLatLng = [ride.drop.lat, ride.drop.lng];

  if (pickupMarker) {
    pickupMarker.setLatLng(pickupLatLng);
  } else {
    pickupMarker = window.L.marker(pickupLatLng).addTo(map).bindPopup("Pickup");
  }
  if (dropMarker) {
    dropMarker.setLatLng(dropLatLng);
  } else {
    dropMarker = window.L.marker(dropLatLng).addTo(map).bindPopup("Drop");
  }
  if (routeLine) {
    routeLine.setLatLngs([pickupLatLng, dropLatLng]);
  } else {
    routeLine = window.L.polyline([pickupLatLng, dropLatLng], {
      color: "#ffd400",
      weight: 4
    }).addTo(map);
  }
  map.fitBounds(window.L.latLngBounds([pickupLatLng, dropLatLng]), { padding: [30, 30] });
}

function renderRideList() {
  elements.rideList.innerHTML = "";
  if (!rides.length) {
    elements.rideList.textContent = "No rides found";
    return;
  }

  for (const ride of rides) {
    const card = document.createElement("button");
    const isTerminal = ride.status === "CANCELLED" || ride.status === "COMPLETED";
    card.className = `ride-item${isTerminal ? " terminal" : ""}`;
    card.disabled = isTerminal;
    card.innerHTML = `
      <strong>${ride.id}</strong>
      <span>Status: ${ride.status} ${ride.status === "CANCELLED" ? "• Cancelled" : ""}</span>
      <span>Rider: ${ride.riderId}</span>
      <span>Captain: ${ride.captainId || "Unassigned"}</span>
      <span>Payment: ${ride.paymentStatus}${ride.paymentMethod ? ` (${ride.paymentMethod})` : ""}</span>
    `;
    card.addEventListener("click", () => {
      if (isTerminal) {
        addLog(`Ride ${ride.id} is ${ride.status.toLowerCase()} and locked`);
        return;
      }
      setSelectedRide(ride);
      addLog(`Selected ride ${ride.id}`);
    });
    elements.rideList.append(card);
  }
}

function updateActionState() {
  const ride = selectedRide;
  const isTerminal = !ride || ride.status === "CANCELLED" || ride.status === "COMPLETED";
  const hasCaptain = !!ride?.captainId;

  elements.assignBtn.disabled = isTerminal || hasCaptain;
  elements.arrivingBtn.disabled = isTerminal || !hasCaptain || ride.status !== "DRIVER_ASSIGNED";
  elements.startBtn.disabled = isTerminal || !hasCaptain || ride.status !== "DRIVER_ARRIVING";
  elements.completeBtn.disabled = isTerminal || !hasCaptain || ride.status !== "STARTED";
}

async function requestOtp() {
  const response = await fetch(`${baseUrl()}/auth/request-otp`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ phoneNumber: elements.phoneNumber.value.trim() })
  });
  if (!response.ok) {
    throw new Error(`OTP request failed (${response.status})`);
  }
  const data = await response.json();
  addLog(`OTP sent. Use ${data.devOtp} (dev mode)`);
}

async function login() {
  const response = await fetch(`${baseUrl()}/auth/verify-otp`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      phoneNumber: elements.phoneNumber.value.trim(),
      otp: elements.otp.value.trim(),
      role: "CAPTAIN"
    })
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Login failed (${response.status}): ${message}`);
  }
  const data = await response.json();
  setTokens(data.accessToken, data.refreshToken);
  addLog(`Logged in as ${data.user.phoneNumber}`);
}

async function fetchCaptains() {
  const response = await apiFetch("/captains/available");
  if (!response.ok) {
    throw new Error(`Failed to load captains (${response.status})`);
  }
  const captains = await response.json();
  elements.captainId.innerHTML = "";
  if (!captains.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No available captains";
    elements.captainId.append(option);
    return;
  }
  for (const captain of captains) {
    const option = document.createElement("option");
    option.value = captain.id;
    option.textContent = `${captain.id} (${captain.name})`;
    elements.captainId.append(option);
  }
}

async function fetchRides() {
  const response = await apiFetch("/rides");
  if (!response.ok) {
    throw new Error(`Failed to load rides (${response.status})`);
  }
  rides = await response.json();
  renderRideList();
  if (selectedRide) {
    const latest = rides.find((ride) => ride.id === selectedRide.id);
    if (latest) {
      setSelectedRide(latest);
    }
  }
}

async function fetchEarnings() {
  const captainId = elements.captainId.value;
  if (!captainId) {
    elements.pendingNet.textContent = "0";
    elements.settledNet.textContent = "0";
    return;
  }
  const response = await apiFetch(`/payouts/captains/${captainId}/summary`);
  if (!response.ok) {
    throw new Error(`Failed to load earnings (${response.status})`);
  }
  const summary = await response.json();
  elements.pendingNet.textContent = String(summary.pendingNet ?? 0);
  elements.settledNet.textContent = String(summary.settledNet ?? 0);
}

async function loadHistory() {
  const captainId = elements.captainId.value;
  if (!captainId) {
    throw new Error("Select captain first");
  }
  const params = new URLSearchParams();
  params.set("captainId", captainId);
  if (elements.historyStatusFilter.value) {
    params.set("status", elements.historyStatusFilter.value);
  }
  if (elements.historyPaymentFilter.value) {
    params.set("paymentStatus", elements.historyPaymentFilter.value);
  }
  const response = await apiFetch(`/rides/history?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`History failed (${response.status})`);
  }
  const history = await response.json();
  elements.historyList.innerHTML = "";
  if (!history.length) {
    elements.historyList.textContent = "No history found";
    return;
  }
  for (const ride of history) {
    const card = document.createElement("article");
    card.className = "ride-item";
    card.innerHTML = `
      <strong>${ride.id}</strong>
      <span>Status: ${ride.status}</span>
      <span>Payment: ${ride.paymentStatus}${ride.paymentMethod ? ` (${ride.paymentMethod})` : ""}</span>
      <span>Fare: ${ride.finalFare ?? ride.estimatedFare}</span>
      <span>Surge: x${ride.surgeMultiplier}${ride.surgeLabel ? ` (${ride.surgeLabel})` : ""}</span>
    `;
    elements.historyList.append(card);
  }
}

function exportHistoryCsv() {
  const captainId = elements.captainId.value;
  if (!captainId) {
    throw new Error("Select captain first");
  }
  const params = new URLSearchParams();
  params.set("captainId", captainId);
  if (elements.historyStatusFilter.value) {
    params.set("status", elements.historyStatusFilter.value);
  }
  if (elements.historyPaymentFilter.value) {
    params.set("paymentStatus", elements.historyPaymentFilter.value);
  }
  const url = `${baseUrl()}/rides/history/export?${params.toString()}`;
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank";
  anchor.click();
  addLog("History CSV export opened");
}

async function pushSimulatedLocation() {
  const captainId = elements.captainId.value;
  if (!captainId) {
    throw new Error("Select captain first");
  }
  const response = await apiFetch(`/captains/${captainId}`);
  if (!response.ok) {
    throw new Error(`Captain lookup failed (${response.status})`);
  }
  const captain = await response.json();
  const lat = captain.currentLat + (Math.random() - 0.5) * 0.0012;
  const lng = captain.currentLng + (Math.random() - 0.5) * 0.0012;
  const updateResponse = await apiFetch(`/captains/${captainId}/location`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      lat,
      lng,
      isOnline: true,
      isAvailable: captain.isAvailable
    })
  });
  if (!updateResponse.ok) {
    throw new Error(`Simulation update failed (${updateResponse.status})`);
  }
}

function toggleSimulation() {
  if (simulationTimer) {
    clearInterval(simulationTimer);
    simulationTimer = null;
    elements.simulateBtn.textContent = "Start Simulation";
    addLog("Location simulation stopped");
    return;
  }
  simulationTimer = setInterval(() => {
    pushSimulatedLocation().catch(() => {});
  }, 2500);
  elements.simulateBtn.textContent = "Stop Simulation";
  addLog("Location simulation started");
}

async function refreshSelectedRide() {
  if (!selectedRide) {
    return;
  }
  const response = await apiFetch(`/rides/${selectedRide.id}`);
  if (!response.ok) {
    throw new Error(`Ride refresh failed (${response.status})`);
  }
  const ride = await response.json();
  setSelectedRide(ride);
  await fetchRides();
}

function connectSocket() {
  if (socket) {
    socket.disconnect();
  }
  socket = window.io(baseUrl(), {
    transports: ["websocket"]
  });

  socket.on("connect", () => {
    if (subscribedRideId) {
      socket.emit("trip:subscribe", subscribedRideId);
      addLog(`Socket connected, subscribed to ${subscribedRideId}`);
    } else {
      addLog("Socket connected");
    }
  });

  socket.on("trip:update", async (event) => {
    addLog(`Trip update: ${event.rideId} -> ${event.status}`);
    try {
      if (selectedRide?.id === event.rideId) {
        await refreshSelectedRide();
      } else {
        await fetchRides();
      }
    } catch (error) {
      addLog(error instanceof Error ? error.message : "Failed to refresh after trip update");
    }
  });

  socket.on("connect_error", (error) => {
    addLog(`Socket error: ${error.message}`);
  });
}

async function assignRide() {
  if (!selectedRide) {
    throw new Error("Select a ride first");
  }
  const captainId = elements.captainId.value;
  if (!captainId) {
    throw new Error("No captain selected");
  }
  const response = await apiFetch(`/rides/${selectedRide.id}/assign`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ captainId })
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Assign failed (${response.status}): ${message}`);
  }
  addLog(`Assigned ${selectedRide.id} -> ${captainId}`);
  await refreshSelectedRide();
  await fetchCaptains();
  await fetchEarnings();
}

async function updateRideStatus(status) {
  if (!selectedRide) {
    throw new Error("Select a ride first");
  }
  const response = await apiFetch(`/rides/${selectedRide.id}/status`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status })
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Status update failed (${response.status}): ${message}`);
  }
  addLog(`Updated ${selectedRide.id} -> ${status}`);
  await refreshSelectedRide();
  await fetchCaptains();
  await fetchEarnings();
}

async function withAction(action) {
  try {
    await action();
  } catch (error) {
    addLog(error instanceof Error ? error.message : "Unknown error");
  }
}

elements.requestOtpBtn.addEventListener("click", () => withAction(requestOtp));
elements.loginBtn.addEventListener("click", () => withAction(login));
elements.refreshCaptainsBtn.addEventListener("click", () => withAction(fetchCaptains));
elements.refreshRidesBtn.addEventListener("click", () => withAction(fetchRides));
elements.refreshPayoutBtn.addEventListener("click", () => withAction(fetchEarnings));
elements.simulateBtn.addEventListener("click", () => withAction(toggleSimulation));
elements.captainId.addEventListener("change", () => withAction(fetchEarnings));
elements.loadHistoryBtn.addEventListener("click", () => withAction(loadHistory));
elements.exportHistoryBtn.addEventListener("click", () => withAction(exportHistoryCsv));
elements.assignBtn.addEventListener("click", () => withAction(assignRide));
elements.arrivingBtn.addEventListener("click", () => withAction(() => updateRideStatus("DRIVER_ARRIVING")));
elements.startBtn.addEventListener("click", () => withAction(() => updateRideStatus("STARTED")));
elements.completeBtn.addEventListener("click", () => withAction(() => updateRideStatus("COMPLETED")));

withAction(async () => {
  initMap();
  connectSocket();
  if (getAccessToken()) {
    addLog("Session token loaded from storage");
  }
  await fetchCaptains();
  await fetchRides();
  await fetchEarnings();
  updateActionState();
  addLog("Captain console ready");
});
