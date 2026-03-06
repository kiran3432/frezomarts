const ACCESS_TOKEN_KEY = "rider_app_access_token";
const REFRESH_TOKEN_KEY = "rider_app_refresh_token";

const elements = {
  backendUrl: document.getElementById("backendUrl"),
  phoneNumber: document.getElementById("phoneNumber"),
  otp: document.getElementById("otp"),
  requestOtpBtn: document.getElementById("requestOtpBtn"),
  loginBtn: document.getElementById("loginBtn"),
  riderId: document.getElementById("riderId"),
  pickupAddress: document.getElementById("pickupAddress"),
  dropAddress: document.getElementById("dropAddress"),
  pickupResults: document.getElementById("pickupResults"),
  dropResults: document.getElementById("dropResults"),
  bookRideBtn: document.getElementById("bookRideBtn"),
  refreshBtn: document.getElementById("refreshBtn"),
  cancelReason: document.getElementById("cancelReason"),
  cancelRideBtn: document.getElementById("cancelRideBtn"),
  rebookBtn: document.getElementById("rebookBtn"),
  paymentMethod: document.getElementById("paymentMethod"),
  payRideBtn: document.getElementById("payRideBtn"),
  invoiceBtn: document.getElementById("invoiceBtn"),
  riderMap: document.getElementById("riderMap"),
  routeMeta: document.getElementById("routeMeta"),
  historyStatusFilter: document.getElementById("historyStatusFilter"),
  historyPaymentFilter: document.getElementById("historyPaymentFilter"),
  loadHistoryBtn: document.getElementById("loadHistoryBtn"),
  exportHistoryBtn: document.getElementById("exportHistoryBtn"),
  historyList: document.getElementById("historyList"),
  statusPill: document.getElementById("statusPill"),
  rideJson: document.getElementById("rideJson"),
  timeline: document.getElementById("timeline")
};

let activeRide = null;
let socket = null;
let map = null;
let pickupMarker = null;
let dropMarker = null;
let routeLine = null;
let captainMarker = null;
let captainPoll = null;
const addressState = {
  pickup: { lat: 12.9758, lng: 77.6055, label: "MG Road, Bengaluru" },
  drop: { lat: 12.9352, lng: 77.6245, label: "Koramangala, Bengaluru" }
};
const searchTimers = { pickup: null, drop: null };

function setStatus(text) {
  elements.statusPill.textContent = text;
}

function getBackendUrl() {
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

function addTimelineEntry(text) {
  const item = document.createElement("li");
  item.textContent = `${new Date().toLocaleTimeString()} - ${text}`;
  elements.timeline.prepend(item);
}

function renderRide(ride) {
  activeRide = ride;
  setStatus(ride?.status || "No active ride");
  elements.rideJson.textContent = ride ? JSON.stringify(ride, null, 2) : "Waiting for ride...";
  if (ride) {
    updateMapFromPoints(ride.pickup, ride.drop);
  }
}

function getResultsList(kind) {
  return kind === "pickup" ? elements.pickupResults : elements.dropResults;
}

function getAddressInput(kind) {
  return kind === "pickup" ? elements.pickupAddress : elements.dropAddress;
}

function clearSearchResults(kind) {
  const list = getResultsList(kind);
  list.innerHTML = "";
  list.classList.remove("visible");
}

function selectAddress(kind, item) {
  const input = getAddressInput(kind);
  input.value = item.display_name;
  addressState[kind] = {
    lat: Number(item.lat),
    lng: Number(item.lon),
    label: item.display_name
  };
  clearSearchResults(kind);
  addTimelineEntry(`${kind === "pickup" ? "Pickup" : "Drop"} set: ${item.display_name}`);
  if (addressState.pickup && addressState.drop) {
    updateMapFromPoints(addressState.pickup, addressState.drop);
  }
}

function renderSearchResults(kind, results) {
  const list = getResultsList(kind);
  list.innerHTML = "";
  if (!results.length) {
    list.classList.remove("visible");
    return;
  }

  for (const item of results) {
    const row = document.createElement("li");
    row.textContent = item.display_name;
    row.addEventListener("mousedown", (event) => {
      event.preventDefault();
      selectAddress(kind, item);
    });
    list.append(row);
  }

  list.classList.add("visible");
}

async function searchAddress(query) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "5");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("q", query);
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Address lookup failed (${response.status})`);
  }
  return response.json();
}

async function geocodeSingleAddress(query) {
  const results = await searchAddress(query);
  if (!results.length) {
    throw new Error(`No map result for: ${query}`);
  }
  return {
    lat: Number(results[0].lat),
    lng: Number(results[0].lon),
    label: results[0].display_name
  };
}

function scheduleAddressSearch(kind) {
  const input = getAddressInput(kind);
  const query = input.value.trim();
  addressState[kind] = null;
  clearTimeout(searchTimers[kind]);

  if (query.length < 3) {
    clearSearchResults(kind);
    return;
  }

  searchTimers[kind] = setTimeout(async () => {
    try {
      const results = await searchAddress(query);
      renderSearchResults(kind, results);
    } catch (error) {
      addTimelineEntry(error instanceof Error ? error.message : "Address search failed");
    }
  }, 320);
}

async function ensureAddressCoordinates(kind) {
  const input = getAddressInput(kind);
  const query = input.value.trim();
  if (!query) {
    throw new Error(`${kind === "pickup" ? "Pickup" : "Drop"} address required`);
  }

  if (addressState[kind] && addressState[kind].label === query) {
    return addressState[kind];
  }

  const resolved = await geocodeSingleAddress(query);
  addressState[kind] = resolved;
  input.value = resolved.label;
  clearSearchResults(kind);
  addTimelineEntry(`${kind === "pickup" ? "Pickup" : "Drop"} mapped`);
  return resolved;
}

function haversineKm(a, b) {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return earthRadiusKm * y;
}

function initMap() {
  if (!window.L || map) {
    return;
  }
  map = window.L.map(elements.riderMap).setView([12.97, 77.59], 12);
  window.L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    attribution:
      "&copy; OpenStreetMap contributors &copy; CARTO"
  }).addTo(map);
}

function updateMapFromPoints(pickup, drop) {
  if (!map) {
    return;
  }

  const pickupLatLng = [pickup.lat, pickup.lng];
  const dropLatLng = [drop.lat, drop.lng];

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

  const km = haversineKm(pickup, drop);
  const etaMinutes = Math.max(4, Math.round(km * 3.5));
  elements.routeMeta.textContent = `Approx distance ${km.toFixed(2)} km • ETA ${etaMinutes} min`;
}

async function pollCaptainLocation() {
  if (!activeRide?.captainId || !["DRIVER_ASSIGNED", "DRIVER_ARRIVING", "STARTED"].includes(activeRide.status)) {
    if (captainMarker && map) {
      map.removeLayer(captainMarker);
      captainMarker = null;
    }
    return;
  }
  const response = await apiFetch(`/captains/${activeRide.captainId}`);
  if (!response.ok) {
    return;
  }
  const captain = await response.json();
  if (!map) {
    return;
  }
  const captainLatLng = [captain.currentLat, captain.currentLng];
  if (captainMarker) {
    captainMarker.setLatLng(captainLatLng);
  } else {
    captainMarker = window.L.circleMarker(captainLatLng, {
      radius: 8,
      color: "#44ff88",
      fillColor: "#44ff88",
      fillOpacity: 0.9
    })
      .addTo(map)
      .bindPopup(`Captain ${captain.id}`);
  }
}

function ensureCaptainPolling() {
  if (captainPoll) {
    clearInterval(captainPoll);
  }
  captainPoll = setInterval(() => {
    pollCaptainLocation().catch(() => {});
  }, 4000);
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return false;
  }
  const response = await fetch(`${getBackendUrl()}/auth/refresh`, {
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
  addTimelineEntry("Session refreshed");
  return true;
}

async function apiFetch(path, options = {}, allowRefresh = true) {
  const headers = new Headers(options.headers || {});
  const accessToken = getAccessToken();
  if (accessToken) {
    headers.set("authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${getBackendUrl()}${path}`, {
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

async function requestOtp() {
  const response = await fetch(`${getBackendUrl()}/auth/request-otp`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ phoneNumber: elements.phoneNumber.value.trim() })
  });
  if (!response.ok) {
    throw new Error(`OTP request failed: ${response.status}`);
  }
  const data = await response.json();
  addTimelineEntry(`OTP sent. Use ${data.devOtp} (dev mode)`);
}

async function login() {
  const response = await fetch(`${getBackendUrl()}/auth/verify-otp`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      phoneNumber: elements.phoneNumber.value.trim(),
      otp: elements.otp.value.trim(),
      role: "RIDER"
    })
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Login failed: ${response.status} ${message}`);
  }
  const data = await response.json();
  setTokens(data.accessToken, data.refreshToken);
  addTimelineEntry(`Logged in as ${data.user.phoneNumber}`);
}

async function refreshRide() {
  if (!activeRide?.id) {
    return;
  }
  const response = await apiFetch(`/rides/${activeRide.id}`);
  if (!response.ok) {
    throw new Error(`Failed to refresh ride: ${response.status}`);
  }
  const ride = await response.json();
  renderRide(ride);
}

function connectSocket(rideId) {
  if (socket) {
    socket.disconnect();
  }

  socket = window.io(getBackendUrl(), {
    transports: ["websocket"]
  });

  socket.on("connect", () => {
    socket.emit("trip:subscribe", rideId);
    addTimelineEntry(`Subscribed to trip ${rideId}`);
  });

  socket.on("trip:update", async (event) => {
    addTimelineEntry(`Trip update: ${event.status}`);
    try {
      await refreshRide();
    } catch (error) {
      addTimelineEntry(error instanceof Error ? error.message : "Failed to refresh ride");
    }
  });

  socket.on("connect_error", (error) => {
    addTimelineEntry(`Socket error: ${error.message}`);
  });
}

async function createRide() {
  const pickup = await ensureAddressCoordinates("pickup");
  const drop = await ensureAddressCoordinates("drop");
  updateMapFromPoints(pickup, drop);

  const payload = {
    riderId: elements.riderId.value.trim(),
    pickup: { lat: pickup.lat, lng: pickup.lng },
    drop: { lat: drop.lat, lng: drop.lng }
  };

  const response = await apiFetch("/rides", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Ride creation failed: ${response.status} ${message}`);
  }

  const ride = await response.json();
  renderRide(ride);
  addTimelineEntry(`Ride created: ${ride.id}`);
  connectSocket(ride.id);
}

async function cancelRide() {
  if (!activeRide?.id) {
    throw new Error("No active ride to cancel");
  }
  const response = await apiFetch(`/rides/${activeRide.id}/cancel`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      reason: elements.cancelReason.value.trim() || undefined
    })
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Cancel failed: ${response.status} ${message}`);
  }
  const ride = await response.json();
  renderRide(ride);
  addTimelineEntry(`Ride cancelled: ${ride.id}`);
}

async function rebookSameRoute() {
  if (!activeRide) {
    throw new Error("No previous ride available for rebook");
  }
  addressState.pickup = {
    lat: activeRide.pickup.lat,
    lng: activeRide.pickup.lng,
    label: `${activeRide.pickup.lat.toFixed(5)}, ${activeRide.pickup.lng.toFixed(5)}`
  };
  addressState.drop = {
    lat: activeRide.drop.lat,
    lng: activeRide.drop.lng,
    label: `${activeRide.drop.lat.toFixed(5)}, ${activeRide.drop.lng.toFixed(5)}`
  };
  elements.pickupAddress.value = addressState.pickup.label;
  elements.dropAddress.value = addressState.drop.label;
  updateMapFromPoints(addressState.pickup, addressState.drop);
  addTimelineEntry("Route prefilled from previous ride");
  await createRide();
}

async function payForRide() {
  if (!activeRide?.id) {
    throw new Error("No active ride for payment");
  }
  const response = await apiFetch(`/payments/rides/${activeRide.id}/collect`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ method: elements.paymentMethod.value })
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Payment failed: ${response.status} ${message}`);
  }
  const payment = await response.json();
  addTimelineEntry(`Payment success: ${payment.amount} via ${payment.paymentMethod}`);
  await refreshRide();
}

function renderInvoiceHtml(invoice) {
  const esc = (value) => String(value ?? "-");
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice ${esc(invoice.invoiceId)}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; color: #1b1b1b; }
    h1 { margin: 0 0 8px; }
    .muted { color: #555; margin: 0 0 20px; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0 22px; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    th { background: #f2f2f2; }
  </style>
</head>
<body>
  <h1>Ride Invoice</h1>
  <p class="muted">Invoice ${esc(invoice.invoiceId)} | Generated ${esc(invoice.generatedAt)}</p>

  <table>
    <tr><th>Ride ID</th><td>${esc(invoice.ride.id)}</td></tr>
    <tr><th>Rider</th><td>${esc(invoice.ride.riderId)}</td></tr>
    <tr><th>Captain</th><td>${esc(invoice.ride.captainId)}</td></tr>
    <tr><th>Status</th><td>${esc(invoice.ride.status)}</td></tr>
  </table>

  <table>
    <tr><th>Estimated Fare</th><td>${esc(invoice.fare.estimatedFare)}</td></tr>
    <tr><th>Final Fare</th><td>${esc(invoice.fare.finalFare)}</td></tr>
    <tr><th>Payable Amount</th><td>${esc(invoice.fare.payableAmount)}</td></tr>
    <tr><th>Payment Status</th><td>${esc(invoice.payment.status)}</td></tr>
    <tr><th>Payment Method</th><td>${esc(invoice.payment.method)}</td></tr>
    <tr><th>Collected At</th><td>${esc(invoice.payment.collectedAt)}</td></tr>
  </table>

</body>
</html>`;
}

async function downloadInvoice() {
  if (!activeRide?.id) {
    throw new Error("No ride available for invoice");
  }
  const response = await apiFetch(`/invoices/rides/${activeRide.id}`);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Invoice failed: ${response.status} ${message}`);
  }
  const invoice = await response.json();
  const popup = window.open("", "_blank");
  if (!popup) {
    throw new Error("Popup blocked. Allow popups to view invoice.");
  }
  popup.document.open();
  popup.document.write(renderInvoiceHtml(invoice));
  popup.document.close();
  popup.focus();
  popup.print();
  addTimelineEntry(`Invoice opened: ${invoice.invoiceId}`);
}

async function loadHistory() {
  const params = new URLSearchParams();
  params.set("riderId", elements.riderId.value.trim());
  if (elements.historyStatusFilter.value) {
    params.set("status", elements.historyStatusFilter.value);
  }
  if (elements.historyPaymentFilter.value) {
    params.set("paymentStatus", elements.historyPaymentFilter.value);
  }
  const response = await apiFetch(`/rides/history?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`History failed: ${response.status}`);
  }
  const history = await response.json();
  elements.historyList.innerHTML = "";
  if (!history.length) {
    elements.historyList.textContent = "No rides found";
    return;
  }
  for (const ride of history) {
    const card = document.createElement("article");
    card.className = "history-item";
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
  const params = new URLSearchParams();
  params.set("riderId", elements.riderId.value.trim());
  if (elements.historyStatusFilter.value) {
    params.set("status", elements.historyStatusFilter.value);
  }
  if (elements.historyPaymentFilter.value) {
    params.set("paymentStatus", elements.historyPaymentFilter.value);
  }
  const url = `${getBackendUrl()}/rides/history/export?${params.toString()}`;
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank";
  anchor.click();
  addTimelineEntry("History CSV export opened");
}

async function withAction(action) {
  try {
    await action();
  } catch (error) {
    addTimelineEntry(error instanceof Error ? error.message : "Unknown error");
  }
}

elements.requestOtpBtn.addEventListener("click", () => withAction(requestOtp));
elements.loginBtn.addEventListener("click", () => withAction(login));
elements.bookRideBtn.addEventListener("click", () => withAction(createRide));
elements.refreshBtn.addEventListener("click", () => withAction(refreshRide));
elements.cancelRideBtn.addEventListener("click", () => withAction(cancelRide));
elements.rebookBtn.addEventListener("click", () => withAction(rebookSameRoute));
elements.payRideBtn.addEventListener("click", () => withAction(payForRide));
elements.invoiceBtn.addEventListener("click", () => withAction(downloadInvoice));
elements.loadHistoryBtn.addEventListener("click", () => withAction(loadHistory));
elements.exportHistoryBtn.addEventListener("click", () => withAction(exportHistoryCsv));
elements.pickupAddress.addEventListener("input", () => scheduleAddressSearch("pickup"));
elements.dropAddress.addEventListener("input", () => scheduleAddressSearch("drop"));
elements.pickupAddress.addEventListener("blur", () => setTimeout(() => clearSearchResults("pickup"), 120));
elements.dropAddress.addEventListener("blur", () => setTimeout(() => clearSearchResults("drop"), 120));
elements.pickupAddress.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    withAction(async () => {
      const pickup = await ensureAddressCoordinates("pickup");
      if (addressState.drop) {
        updateMapFromPoints(pickup, addressState.drop);
      }
    });
  }
});
elements.dropAddress.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    withAction(async () => {
      const drop = await ensureAddressCoordinates("drop");
      if (addressState.pickup) {
        updateMapFromPoints(addressState.pickup, drop);
      }
    });
  }
});

if (getAccessToken()) {
  addTimelineEntry("Session token loaded from storage");
}

initMap();
updateMapFromPoints(addressState.pickup, addressState.drop);
ensureCaptainPolling();
