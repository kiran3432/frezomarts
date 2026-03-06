const BACKEND_KEY = "frezo_web_backend_v2";
const CART_KEY = "frezo_web_cart_v3";
const LOCATION_CACHE_KEY = "frezo_web_location_v1";
const USER_KEY = "frezo_web_user_v1";
const ORDERS_KEY = "frezo_web_orders_v1";
const ADDRESSES_KEY = "frezo_web_addresses_v1";
const CONFIG_CACHE_KEY = "frezo_web_config_cache_v1";
const RUNTIME_CONFIG_PATH = "./runtime-config.json";
const DEFAULT_LIVE_SYNC_INTERVAL_MS = 4000;
const FALLBACK_LOCATION = {
  label: "Hyderabad, Telangana, India",
  lat: 17.385,
  lng: 78.4867
};

const DEFAULT_CATEGORIES = [
  "Fruits & Vegetables (fresh produce)",
  "Dairy & Eggs",
  "Bakery & Breads",
  "Staples & Grains",
  "Rice & Pulses",
  "Cooking Oil & Spices",
  "Snacks & Namkeen",
  "Beverages (Tea, Coffee, Juices, Soft Drinks)",
  "Packaged Foods & Instant Meals",
  "Frozen Foods & Ice-creams",
  "Household Essentials (cleaning supplies, detergents)",
  "Personal Care & Hygiene (soaps, shampoos, toothpaste)",
  "Beauty & Grooming",
  "Baby Care Products",
  "Medicines & Health Supplies (OTC meds, first-aid, vitamins)",
  "Supplements & Nutrition",
  "Pet Supplies (food, grooming)",
  "Stationery & Office Supplies",
  "Flowers & Gifts",
  "Electronics & Accessories (chargers, headphones, small gadgets)",
  "Ready-to-Eat / Food & Beverages"
];

const DEFAULT_TOP_FILTERS = [
  { id: "all", label: "All", icon: "A" },
  { id: "maxxsaver", label: "MaxxSaver", icon: "M" },
  { id: "ramzan", label: "Ramzan", icon: "R" },
  { id: "fresh", label: "Fresh", icon: "F" },
  { id: "summer", label: "Summer", icon: "S" }
];

const DEFAULT_PRODUCTS = [
  {
    id: "p_milk_1",
    name: "Amul Taaza Milk",
    category: "Dairy & Eggs",
    qty: "1 L",
    price: 72,
    mrp: 78,
    tags: ["all", "fresh"],
    imageUrl: "/assets/products/p1.jpg",
    status: "ACTIVE"
  },
  {
    id: "p_banana_1",
    name: "Farm Fresh Banana",
    category: "Fruits & Vegetables (fresh produce)",
    qty: "1 dozen",
    price: 59,
    mrp: 66,
    tags: ["all", "maxxsaver"],
    imageUrl: "/assets/products/p2.jpg",
    status: "ACTIVE"
  },
  {
    id: "p_rice_1",
    name: "Basmati Rice",
    category: "Rice & Pulses",
    qty: "5 kg",
    price: 429,
    mrp: 470,
    tags: ["all", "maxxsaver"],
    imageUrl: "/assets/products/p3.jpg",
    status: "ACTIVE"
  },
  {
    id: "p_corn_1",
    name: "Frozen Corn",
    category: "Frozen Foods & Ice-creams",
    qty: "500 g",
    price: 76,
    mrp: 86,
    tags: ["all", "fresh"],
    imageUrl: "/assets/products/p4.jpg",
    status: "ACTIVE"
  },
  {
    id: "p_biscuit_1",
    name: "Digestive Biscuits",
    category: "Snacks & Namkeen",
    qty: "960 g",
    price: 129,
    mrp: 198,
    tags: ["all", "ramzan"],
    imageUrl: "/assets/products/p5.jpg",
    status: "ACTIVE"
  },
  {
    id: "p_juice_1",
    name: "Orange Juice",
    category: "Beverages (Tea, Coffee, Juices, Soft Drinks)",
    qty: "1 L",
    price: 110,
    mrp: 130,
    tags: ["all", "summer"],
    imageUrl: "/assets/products/p1.jpg",
    status: "ACTIVE"
  },
  {
    id: "p_oil_1",
    name: "Sunflower Oil",
    category: "Cooking Oil & Spices",
    qty: "1 L",
    price: 169,
    mrp: 189,
    tags: ["all"],
    imageUrl: "/assets/products/p2.jpg",
    status: "ACTIVE"
  },
  {
    id: "p_pasta_1",
    name: "Instant Pasta",
    category: "Packaged Foods & Instant Meals",
    qty: "350 g",
    price: 94,
    mrp: 120,
    tags: ["all", "maxxsaver"],
    imageUrl: "/assets/products/p3.jpg",
    status: "ACTIVE"
  },
  {
    id: "p_cleaner_1",
    name: "Floor Cleaner",
    category: "Household Essentials (cleaning supplies, detergents)",
    qty: "2 L",
    price: 179,
    mrp: 220,
    tags: ["all"],
    imageUrl: "/assets/products/p4.jpg",
    status: "ACTIVE"
  },
  {
    id: "p_shampoo_1",
    name: "Smooth Shampoo",
    category: "Personal Care & Hygiene (soaps, shampoos, toothpaste)",
    qty: "340 ml",
    price: 229,
    mrp: 280,
    tags: ["all"],
    imageUrl: "/assets/products/p5.jpg",
    status: "ACTIVE"
  },
  {
    id: "p_meds_1",
    name: "Pain Relief Tablets",
    category: "Medicines & Health Supplies (OTC meds, first-aid, vitamins)",
    qty: "1 strip",
    price: 48,
    mrp: 60,
    tags: ["all"],
    imageUrl: "/assets/products/p1.jpg",
    status: "ACTIVE"
  },
  {
    id: "p_pet_1",
    name: "Dog Food Adult",
    category: "Pet Supplies (food, grooming)",
    qty: "1 kg",
    price: 299,
    mrp: 340,
    tags: ["all"],
    imageUrl: "/assets/products/p2.jpg",
    status: "ACTIVE"
  }
];

const DEFAULT_BANNERS = [
  {
    id: "bnr_1",
    title: "Limited Period Offer",
    subtitle: "Up to 60% off on groceries",
    cta: "Use code FREZO60",
    bgColor: "#daf6df",
    textColor: "#0d6a2c"
  },
  {
    id: "bnr_2",
    title: "Fresh Fest",
    subtitle: "Farm fresh picks delivered fast",
    cta: "Extra 15% off on produce",
    bgColor: "#e9f5ff",
    textColor: "#17446d"
  },
  {
    id: "bnr_3",
    title: "Home Essentials",
    subtitle: "Stock up and save more",
    cta: "Flat Rs 80 off above Rs 799",
    bgColor: "#fff4de",
    textColor: "#6e4a09"
  }
];

function buildDefaultHomeSections(categories, banners) {
  const sections = [];
  let pointer = 0;

  for (let cycle = 0; cycle < 3; cycle += 1) {
    for (let index = 0; index < 3; index += 1) {
      const category = categories[pointer % categories.length] || categories[0] || "";
      sections.push({
        id: `section_${cycle + 1}_pre_${index + 1}`,
        type: "PRODUCT_GRID",
        layout: "HORIZONTAL",
        title: category,
        category,
        bannerId: "",
        limit: 6
      });
      pointer += 1;
    }

    const banner = banners[cycle % banners.length];
    sections.push({
      id: `section_${cycle + 1}_banner`,
      type: "BANNER",
      layout: "HORIZONTAL",
      title: banner?.title || "Promotion",
      category: "",
      bannerId: banner?.id || "",
      limit: 0
    });

    for (let index = 0; index < 3; index += 1) {
      const category = categories[pointer % categories.length] || categories[0] || "";
      sections.push({
        id: `section_${cycle + 1}_post_${index + 1}`,
        type: "PRODUCT_GRID",
        layout: "HORIZONTAL",
        title: category,
        category,
        bannerId: "",
        limit: 6
      });
      pointer += 1;
    }
  }

  return sections;
}

const DEFAULT_CONFIG = {
  app: {
    name: "FREZO",
    subtitle: "india's next gen grocery app",
    tagline: '"fast fresh frezo"'
  },
  etaBaseMinutes: 7,
  categories: DEFAULT_CATEGORIES,
  topFilters: DEFAULT_TOP_FILTERS,
  products: DEFAULT_PRODUCTS,
  banners: DEFAULT_BANNERS,
  homeSections: buildDefaultHomeSections(DEFAULT_CATEGORIES, DEFAULT_BANNERS),
  reorder: [
    { id: "r_1", label: "Friday Basket", date: "Mar 1", productIds: ["p_milk_1", "p_banana_1"] },
    { id: "r_2", label: "Monthly Needs", date: "Feb 27", productIds: ["p_rice_1", "p_oil_1", "p_pasta_1"] }
  ]
};

const elements = {
  brandBtn: document.getElementById("brandBtn"),
  deliveryEta: document.getElementById("deliveryEta"),
  deliveryAddress: document.getElementById("deliveryAddress"),
  searchInput: document.getElementById("searchInput"),
  loginBtn: document.getElementById("loginBtn"),
  userMenuToggle: document.getElementById("userMenuToggle"),
  userMenu: document.getElementById("userMenu"),
  cartBtn: document.getElementById("cartBtn"),
  cartBtnLabel: document.getElementById("cartBtnLabel"),
  floatingCart: document.getElementById("floatingCart"),
  floatingCartLabel: document.getElementById("floatingCartLabel"),
  backendInput: document.getElementById("backendInput"),
  connectBtn: document.getElementById("connectBtn"),
  refreshBtn: document.getElementById("refreshBtn"),
  homeView: document.getElementById("homeView"),
  categoryView: document.getElementById("categoryView"),
  bannerStrip: document.getElementById("bannerStrip"),
  categoryStrip: document.getElementById("categoryStrip"),
  homeSections: document.getElementById("homeSections"),
  backHomeBtn: document.getElementById("backHomeBtn"),
  categoryTitle: document.getElementById("categoryTitle"),
  subCategoryList: document.getElementById("subCategoryList"),
  categoryGrid: document.getElementById("categoryGrid"),
  cartDrawer: document.getElementById("cartDrawer"),
  closeCartBtn: document.getElementById("closeCartBtn"),
  cartItems: document.getElementById("cartItems"),
  cartSummary: document.getElementById("cartSummary"),
  accountDrawer: document.getElementById("accountDrawer"),
  accountTitle: document.getElementById("accountTitle"),
  accountContent: document.getElementById("accountContent"),
  closeAccountBtn: document.getElementById("closeAccountBtn"),
  authModal: document.getElementById("authModal"),
  authCloseBtn: document.getElementById("authCloseBtn"),
  authLoginTab: document.getElementById("authLoginTab"),
  authSignupTab: document.getElementById("authSignupTab"),
  authForm: document.getElementById("authForm"),
  authNameRow: document.getElementById("authNameRow"),
  authNameInput: document.getElementById("authNameInput"),
  authMobileInput: document.getElementById("authMobileInput"),
  authSubmitBtn: document.getElementById("authSubmitBtn"),
  authGoogleBtn: document.getElementById("authGoogleBtn"),
  toast: document.getElementById("toast")
};

const defaultBackendBase = (() => {
  const protocol = window.location.protocol.startsWith("http") ? window.location.protocol : "http:";
  const host = window.location.hostname || "127.0.0.1";
  return `${protocol}//${host}:4000`;
})();

function normalizeBackendBase(value) {
  const cleaned = String(value || "").trim().replace(/\/$/, "");
  if (!cleaned) return defaultBackendBase;

  try {
    const parsed = new URL(cleaned);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return defaultBackendBase;
  }
}

const state = {
  backendBase: normalizeBackendBase(localStorage.getItem(BACKEND_KEY) || defaultBackendBase),
  runtimeBackendBase: "",
  liveSyncIntervalMs: DEFAULT_LIVE_SYNC_INTERVAL_MS,
  liveSyncTimer: 0,
  lastConfigUpdatedAt: "",
  config: clone(DEFAULT_CONFIG),
  cart: loadCart(),
  user: loadUser(),
  ordersByUser: loadUserScopedMap(ORDERS_KEY),
  addressesByUser: loadUserScopedMap(ADDRESSES_KEY),
  authMode: "login",
  accountView: "",
  selectedCategory: "",
  searchQuery: "",
  view: "home",
  location: null
};

function clone(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 1800);
}

function loadUserScopedMap(storageKey) {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed;
  } catch {
    return {};
  }
}

function persistUserScopedMap(storageKey, value) {
  localStorage.setItem(storageKey, JSON.stringify(value || {}));
}

function getUserScopeKey() {
  if (!state.user) return "";
  const base = String(state.user.mobile || state.user.name || "user")
    .trim()
    .toLowerCase();
  if (!base) return "";
  return `${state.user.provider}:${base}`;
}

function getCurrentUserOrders() {
  const scope = getUserScopeKey();
  if (!scope) return [];
  const rows = state.ordersByUser[scope];
  return Array.isArray(rows) ? rows : [];
}

function saveCurrentUserOrders(orders) {
  const scope = getUserScopeKey();
  if (!scope) return;
  state.ordersByUser[scope] = Array.isArray(orders) ? orders.slice(0, 80) : [];
  persistUserScopedMap(ORDERS_KEY, state.ordersByUser);
}

function getCurrentUserAddresses() {
  const scope = getUserScopeKey();
  if (!scope) return [];
  const rows = state.addressesByUser[scope];
  return Array.isArray(rows) ? rows : [];
}

function saveCurrentUserAddresses(addresses) {
  const scope = getUserScopeKey();
  if (!scope) return;
  state.addressesByUser[scope] = Array.isArray(addresses) ? addresses.slice(0, 20) : [];
  persistUserScopedMap(ADDRESSES_KEY, state.addressesByUser);
}

function formatOrderTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function loadCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "{}");
    if (!parsed || typeof parsed !== "object") return {};
    const entries = Object.entries(parsed).map(([productId, qty]) => [productId, Math.floor(Number(qty || 0))]);
    return Object.fromEntries(entries.filter(([productId, qty]) => productId && qty > 0));
  } catch {
    return {};
  }
}

function persistCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
}

function persistBackend() {
  localStorage.setItem(BACKEND_KEY, state.backendBase);
}

function loadUser() {
  try {
    const parsed = JSON.parse(localStorage.getItem(USER_KEY) || "null");
    if (!parsed || typeof parsed !== "object") return null;

    const name = String(parsed.name || "").trim();
    const mobile = String(parsed.mobile || "").trim();
    const provider = parsed.provider === "google" ? "google" : "mobile";
    if (!name && !mobile) return null;

    return {
      name: name || "Frezo User",
      mobile,
      provider
    };
  } catch {
    return null;
  }
}

function persistUser() {
  if (!state.user) {
    localStorage.removeItem(USER_KEY);
    return;
  }

  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      name: state.user.name,
      mobile: state.user.mobile,
      provider: state.user.provider
    })
  );
}

function renderLoginButton() {
  if (!state.user) {
    elements.loginBtn.textContent = "Login";
    elements.loginBtn.classList.remove("logged-in");
    elements.userMenuToggle.classList.add("hidden");
    closeUserMenu();
    return;
  }

  const firstName = String(state.user.name || "User")
    .trim()
    .split(" ")[0];
  elements.loginBtn.textContent = firstName || "User";
  elements.loginBtn.classList.add("logged-in");
  elements.userMenuToggle.classList.remove("hidden");
}

function openUserMenu() {
  elements.userMenu.classList.remove("hidden");
  elements.userMenuToggle.setAttribute("aria-expanded", "true");
}

function closeUserMenu() {
  elements.userMenu.classList.add("hidden");
  elements.userMenuToggle.setAttribute("aria-expanded", "false");
}

function toggleUserMenu() {
  if (!state.user) return;
  const isHidden = elements.userMenu.classList.contains("hidden");
  if (isHidden) {
    openUserMenu();
    return;
  }
  closeUserMenu();
}

function orderStatusLabel(status) {
  switch (String(status || "").toUpperCase()) {
    case "LIVE":
      return "Live";
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
      return "Cancelled";
    case "OUT_FOR_DELIVERY":
      return "Out for delivery";
    default:
      return "Placed";
  }
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function getProductName(productId) {
  const product = state.config.products.find((row) => row.id === productId);
  return product?.name || "Grocery items";
}

function computeOrderTotalFromItems(items) {
  const productMap = getActiveProductMap();
  return items.reduce((sum, item) => {
    const qty = Math.max(1, Math.floor(Number(item.qty || 1)));
    const itemPrice = Number(item.price || productMap.get(item.productId)?.price || 0);
    return sum + itemPrice * qty;
  }, 0);
}

function ensureSeedOrders() {
  if (!state.user) return;
  const existing = getCurrentUserOrders();
  if (existing.length) return;

  const now = Date.now();
  const address = normalizeText(elements.deliveryAddress.textContent) || FALLBACK_LOCATION.label;
  const liveItems = [
    { productId: "p_milk_1", name: getProductName("p_milk_1"), qty: 2 },
    { productId: "p_banana_1", name: getProductName("p_banana_1"), qty: 1 }
  ];
  const recentItems = [
    { productId: "p_rice_1", name: getProductName("p_rice_1"), qty: 1 },
    { productId: "p_oil_1", name: getProductName("p_oil_1"), qty: 1 }
  ];
  const pastItems = [
    { productId: "p_pasta_1", name: getProductName("p_pasta_1"), qty: 2 },
    { productId: "p_juice_1", name: getProductName("p_juice_1"), qty: 1 }
  ];

  const seed = [
    {
      id: `ord_live_${now}`,
      status: "LIVE",
      placedAt: new Date(now - 15 * 60 * 1000).toISOString(),
      etaMinutes: computeEtaMinutes(),
      address,
      items: liveItems,
      total: computeOrderTotalFromItems(liveItems)
    },
    {
      id: `ord_recent_${now - 1}`,
      status: "DELIVERED",
      placedAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
      etaMinutes: 0,
      address,
      items: recentItems,
      total: computeOrderTotalFromItems(recentItems)
    },
    {
      id: `ord_past_${now - 2}`,
      status: "DELIVERED",
      placedAt: new Date(now - 24 * 24 * 60 * 60 * 1000).toISOString(),
      etaMinutes: 0,
      address,
      items: pastItems,
      total: computeOrderTotalFromItems(pastItems)
    }
  ];
  saveCurrentUserOrders(seed);
}

function splitOrdersByBucket(orders) {
  const live = [];
  const recent = [];
  const past = [];
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const sorted = [...orders].sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());

  for (const order of sorted) {
    const status = String(order.status || "").toUpperCase();
    const placedAt = new Date(order.placedAt || 0).getTime();
    if (status === "LIVE" || status === "PACKING" || status === "OUT_FOR_DELIVERY") {
      live.push(order);
      continue;
    }
    if (Number.isFinite(placedAt) && placedAt >= cutoff) {
      recent.push(order);
      continue;
    }
    past.push(order);
  }

  return { live, recent, past };
}

function orderCardMarkup(order) {
  const items = Array.isArray(order.items) ? order.items : [];
  const itemPreview = items
    .slice(0, 2)
    .map((item) => `${item.name || getProductName(item.productId)} x${Math.max(1, Math.floor(Number(item.qty || 1)))}`)
    .join(", ");
  const hasMoreItems = items.length > 2 ? ` +${items.length - 2} more` : "";
  const statusKey = String(order.status || "placed").toLowerCase();
  const orderId = String(order.id || "").slice(-8).toUpperCase();
  const amount = Number(order.total || computeOrderTotalFromItems(items));
  const etaText = String(order.status || "").toUpperCase() === "LIVE" ? `ETA ${Math.max(1, Number(order.etaMinutes || computeEtaMinutes()))} mins` : "";

  return `
    <article class="account-card">
      <div class="account-card-head">
        <strong>Order #${escapeHtml(orderId || "NA")}</strong>
        <span class="order-status status-${escapeHtml(statusKey)}">${escapeHtml(orderStatusLabel(order.status))}</span>
      </div>
      <p class="account-card-meta">${escapeHtml(itemPreview || "Items will appear here")}${escapeHtml(hasMoreItems)}</p>
      <p class="account-card-meta">${escapeHtml(order.address || "Address unavailable")}</p>
      <div class="account-card-foot">
        <span>${currency(amount)}</span>
        <span>${escapeHtml(etaText || formatOrderTime(order.placedAt))}</span>
      </div>
    </article>
  `;
}

function orderSectionMarkup(title, rows, emptyMessage) {
  return `
    <section class="account-section">
      <div class="account-section-head">
        <h4>${escapeHtml(title)}</h4>
        <span>${rows.length}</span>
      </div>
      ${
        rows.length
          ? `<div class="account-stack">${rows.map(orderCardMarkup).join("")}</div>`
          : `<p class="account-empty">${escapeHtml(emptyMessage)}</p>`
      }
    </section>
  `;
}

function saveDetectedAddress(silent = true) {
  if (!state.user) return false;
  const detected = normalizeText(elements.deliveryAddress.textContent);
  if (!detected || /detecting location/i.test(detected)) return false;

  const addresses = getCurrentUserAddresses();
  const duplicate = addresses.some((row) => normalizeText(row.line).toLowerCase() === detected.toLowerCase());
  if (duplicate) return false;

  const entry = {
    id: `addr_${Date.now()}`,
    label: "Recent",
    line: detected,
    createdAt: new Date().toISOString()
  };

  saveCurrentUserAddresses([entry, ...addresses]);
  if (!silent) {
    showToast("Current location saved");
  }
  return true;
}

function renderOrdersPanel() {
  ensureSeedOrders();
  const orders = getCurrentUserOrders();
  const buckets = splitOrdersByBucket(orders);
  return `
    <div class="account-content-inner">
      ${orderSectionMarkup("Live Orders", buckets.live, "No live orders right now.")}
      ${orderSectionMarkup("Recent Orders", buckets.recent, "No recent orders in the last 7 days.")}
      ${orderSectionMarkup("Past Orders", buckets.past, "No past orders available.")}
    </div>
  `;
}

function renderAddressesPanel() {
  const addresses = getCurrentUserAddresses();
  return `
    <div class="account-content-inner">
      <section class="account-section">
        <h4>Add Address</h4>
        <form class="address-form" data-address-form>
          <label>
            Label
            <input name="label" maxlength="20" placeholder="Home / Work / Other" required />
          </label>
          <label>
            Address
            <input name="line" maxlength="220" placeholder="House no, street, area, city" required />
          </label>
          <button type="submit">Save Address</button>
        </form>
        <button class="plain-btn address-current-btn" type="button" data-add-current-address>
          Save current detected address
        </button>
      </section>

      <section class="account-section">
        <div class="account-section-head">
          <h4>Saved Addresses</h4>
          <span>${addresses.length}</span>
        </div>
        ${
          addresses.length
            ? `<div class="account-stack">${addresses
                .map(
                  (address) => `
                  <article class="account-card">
                    <div class="account-card-head">
                      <strong>${escapeHtml(address.label || "Address")}</strong>
                      <button class="account-link-btn" type="button" data-delete-address="${escapeHtml(address.id)}">Delete</button>
                    </div>
                    <p class="account-card-meta">${escapeHtml(address.line || "")}</p>
                    <p class="account-card-meta">${escapeHtml(formatOrderTime(address.createdAt))}</p>
                  </article>
                `
                )
                .join("")}</div>`
            : `<p class="account-empty">No saved addresses yet.</p>`
        }
      </section>
    </div>
  `;
}

function renderPrivacyPanel() {
  return `
    <div class="account-content-inner">
      <section class="account-section">
        <h4>Account Privacy</h4>
        <p class="account-empty">Mobile number and addresses are stored only on this device for faster checkout.</p>
        <p class="account-empty">Use Logout from the account menu to remove active login.</p>
      </section>
    </div>
  `;
}

function renderFaqsPanel() {
  return `
    <div class="account-content-inner">
      <section class="account-section">
        <h4>FAQs</h4>
        <div class="account-stack">
          <article class="account-card">
            <div class="account-card-head"><strong>How is delivery time calculated?</strong></div>
            <p class="account-card-meta">ETA is auto-calculated using your detected location distance.</p>
          </article>
          <article class="account-card">
            <div class="account-card-head"><strong>How do I save an address?</strong></div>
            <p class="account-card-meta">Open Saved Addresses and submit the address form. The latest saved address stays on top.</p>
          </article>
        </div>
      </section>
    </div>
  `;
}

function renderAccountDrawer() {
  if (!state.user) return;

  switch (state.accountView) {
    case "orders":
      elements.accountTitle.textContent = "My Orders";
      elements.accountContent.innerHTML = renderOrdersPanel();
      break;
    case "addresses":
      elements.accountTitle.textContent = "Saved Addresses";
      elements.accountContent.innerHTML = renderAddressesPanel();
      break;
    case "privacy":
      elements.accountTitle.textContent = "Account Privacy";
      elements.accountContent.innerHTML = renderPrivacyPanel();
      break;
    case "faqs":
      elements.accountTitle.textContent = "FAQs";
      elements.accountContent.innerHTML = renderFaqsPanel();
      break;
    default:
      elements.accountTitle.textContent = "My Account";
      elements.accountContent.innerHTML = `<p class="account-empty">Select an option from the account menu.</p>`;
      break;
  }
}

function openAccountDrawer(view) {
  if (!state.user) {
    openAuthModal("login");
    return;
  }
  state.accountView = view;
  closeCart();
  renderAccountDrawer();
  elements.accountDrawer.classList.remove("hidden");
}

function closeAccountDrawer() {
  elements.accountDrawer.classList.add("hidden");
  state.accountView = "";
}

function handleAddressFormSubmit(form) {
  const label = normalizeText(form.elements.label?.value);
  const line = normalizeText(form.elements.line?.value);
  if (!label || !line) {
    showToast("Please enter label and address");
    return;
  }

  const addresses = getCurrentUserAddresses();
  const duplicate = addresses.some((row) => normalizeText(row.line).toLowerCase() === line.toLowerCase());
  if (duplicate) {
    showToast("Address already saved");
    return;
  }

  const entry = {
    id: `addr_${Date.now()}`,
    label: label.slice(0, 20),
    line: line.slice(0, 220),
    createdAt: new Date().toISOString()
  };

  saveCurrentUserAddresses([entry, ...addresses]);
  form.reset();
  renderAccountDrawer();
  showToast("Address saved");
}

function handleAccountContentClick(event) {
  const currentAddressButton = event.target.closest("[data-add-current-address]");
  if (currentAddressButton) {
    const saved = saveDetectedAddress(false);
    if (!saved) {
      showToast("No new detected address to save");
    }
    renderAccountDrawer();
    return;
  }

  const deleteAddressButton = event.target.closest("[data-delete-address]");
  if (deleteAddressButton) {
    const targetId = deleteAddressButton.dataset.deleteAddress;
    const addresses = getCurrentUserAddresses().filter((row) => row.id !== targetId);
    saveCurrentUserAddresses(addresses);
    renderAccountDrawer();
    showToast("Address removed");
  }
}

function handleUserMenuAction(action) {
  if (!action) return;

  switch (action) {
    case "orders":
      openAccountDrawer("orders");
      break;
    case "addresses":
      openAccountDrawer("addresses");
      break;
    case "privacy":
      openAccountDrawer("privacy");
      break;
    case "faqs":
      openAccountDrawer("faqs");
      break;
    case "logout":
      closeAccountDrawer();
      state.user = null;
      persistUser();
      renderLoginButton();
      showToast("Logged out");
      break;
    default:
      break;
  }

  closeUserMenu();
}

function setAuthMode(mode) {
  state.authMode = mode === "signup" ? "signup" : "login";

  const signupMode = state.authMode === "signup";
  elements.authLoginTab.classList.toggle("active", !signupMode);
  elements.authSignupTab.classList.toggle("active", signupMode);
  elements.authNameRow.classList.toggle("hidden", !signupMode);
  elements.authSubmitBtn.textContent = signupMode ? "Create Account" : "Login with Mobile";
}

function openAuthModal(mode = "login") {
  closeUserMenu();
  closeAccountDrawer();
  setAuthMode(mode);
  elements.authMobileInput.value = state.user?.mobile || "";
  elements.authNameInput.value = state.user?.name || "";
  elements.authModal.classList.remove("hidden");
  if (state.authMode === "signup") {
    elements.authNameInput.focus();
  } else {
    elements.authMobileInput.focus();
  }
}

function closeAuthModal() {
  elements.authModal.classList.add("hidden");
}

function validMobileNumber(value) {
  return /^\d{10}$/.test(String(value || "").trim());
}

function loginWithMobile() {
  const mobile = String(elements.authMobileInput.value || "").trim();
  if (!validMobileNumber(mobile)) {
    showToast("Enter a valid 10-digit mobile number");
    return;
  }

  const existing = state.user && state.user.mobile === mobile ? state.user : null;
  state.user = {
    name: existing?.name || `User ${mobile.slice(-4)}`,
    mobile,
    provider: "mobile"
  };
  persistUser();
  renderLoginButton();
  saveDetectedAddress(true);
  ensureSeedOrders();
  closeAuthModal();
  showToast("Logged in successfully");
}

function signupWithMobile() {
  const name = String(elements.authNameInput.value || "").trim();
  const mobile = String(elements.authMobileInput.value || "").trim();

  if (!name) {
    showToast("Enter your name to sign up");
    return;
  }
  if (!validMobileNumber(mobile)) {
    showToast("Enter a valid 10-digit mobile number");
    return;
  }

  state.user = {
    name,
    mobile,
    provider: "mobile"
  };
  persistUser();
  renderLoginButton();
  saveDetectedAddress(true);
  ensureSeedOrders();
  closeAuthModal();
  showToast("Account created successfully");
}

function authenticateWithGoogle() {
  const name = state.authMode === "signup" ? String(elements.authNameInput.value || "").trim() : "";
  state.user = {
    name: name || "Google User",
    mobile: "",
    provider: "google"
  };
  persistUser();
  renderLoginButton();
  saveDetectedAddress(true);
  ensureSeedOrders();
  closeAuthModal();
  showToast("Signed in with Google");
}

function loadCachedLocation() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCATION_CACHE_KEY) || "null");
    if (!parsed || typeof parsed !== "object") return;

    const lat = Number(parsed.lat);
    const lng = Number(parsed.lng);
    const label = String(parsed.label || "").trim();
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      state.location = { lat, lng };
    }
    if (label) {
      elements.deliveryAddress.textContent = label;
    }
  } catch {
    // Ignore corrupted location cache.
  }
}

function persistLocation(label, lat, lng) {
  const safeLabel = String(label || "").trim() || FALLBACK_LOCATION.label;
  const safeLat = Number.isFinite(lat) ? Number(lat) : FALLBACK_LOCATION.lat;
  const safeLng = Number.isFinite(lng) ? Number(lng) : FALLBACK_LOCATION.lng;
  state.location = { lat: safeLat, lng: safeLng };
  elements.deliveryAddress.textContent = safeLabel;
  localStorage.setItem(
    LOCATION_CACHE_KEY,
    JSON.stringify({
      label: safeLabel,
      lat: safeLat,
      lng: safeLng
    })
  );
  if (state.user) {
    saveDetectedAddress(true);
  }
}

function getActiveProductMap() {
  return new Map(
    state.config.products
      .filter((product) => product.status !== "INACTIVE")
      .map((product) => [product.id, product])
  );
}

function sanitizeCart() {
  const validProductIds = new Set(state.config.products.map((product) => product.id));
  let dirty = false;

  for (const [productId, rawQty] of Object.entries(state.cart)) {
    const qty = Math.floor(Number(rawQty || 0));
    if (!validProductIds.has(productId) || qty <= 0) {
      delete state.cart[productId];
      dirty = true;
      continue;
    }

    if (qty !== rawQty) {
      state.cart[productId] = qty;
      dirty = true;
    }
  }

  if (dirty) {
    persistCart();
  }
}

function currency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function loadCachedConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function persistCachedConfig(config) {
  localStorage.setItem(CONFIG_CACHE_KEY, JSON.stringify(config));
}

function backendCandidates() {
  return [state.backendBase, state.runtimeBackendBase, defaultBackendBase]
    .map((base) => normalizeBackendBase(base))
    .filter((base, index, array) => base && array.indexOf(base) === index);
}

function applyConfig(nextConfig, options = {}) {
  const persist = options.persist !== false;
  const render = options.render !== false;
  state.config = normalizeConfig(nextConfig);

  if (persist) {
    persistCachedConfig(state.config);
  }

  state.lastConfigUpdatedAt = String(state.config.updatedAt || "").trim();
  sanitizeCart();

  if (!state.selectedCategory || !state.config.categories.includes(state.selectedCategory)) {
    state.selectedCategory = state.config.categories[0] || "";
  }

  if (render) {
    renderAll();
  }
}

function fallbackImageUrl(seed) {
  const safeSeed = String(seed || "frezo-item")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .slice(0, 80);
  const label = (safeSeed || "frezo-item").replace(/-/g, " ").slice(0, 20);
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='#e9f7ed'/>
          <stop offset='100%' stop-color='#dcebe1'/>
        </linearGradient>
      </defs>
      <rect width='400' height='400' fill='url(#g)'/>
      <circle cx='200' cy='160' r='56' fill='#c8dfcf'/>
      <rect x='88' y='246' width='224' height='26' rx='13' fill='#c8dfcf'/>
      <text x='200' y='320' text-anchor='middle' font-family='Arial, sans-serif' font-size='20' fill='#2b5d3a'>${label}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function imageMarkup(imageUrl, altText, seed) {
  const safeSrc = escapeHtml(String(imageUrl || "").trim() || fallbackImageUrl(seed || altText || "frezo-item"));
  const safeAlt = escapeHtml(altText || "Product image");
  const fallbackSrc = escapeHtml(fallbackImageUrl(seed || altText || "frezo-item"));

  return `<img src="${safeSrc}" alt="${safeAlt}" loading="lazy" onerror="this.onerror=null;this.src='${fallbackSrc}'" />`;
}

function normalizeConfig(input) {
  const merged = {
    ...clone(DEFAULT_CONFIG),
    ...(input || {})
  };

  merged.app = { ...DEFAULT_CONFIG.app, ...(merged.app || {}) };
  merged.categories = Array.isArray(merged.categories) && merged.categories.length ? merged.categories : clone(DEFAULT_CONFIG.categories);
  merged.topFilters = Array.isArray(merged.topFilters) && merged.topFilters.length ? merged.topFilters : clone(DEFAULT_CONFIG.topFilters);
  merged.products = Array.isArray(merged.products) ? merged.products : [];
  merged.banners = Array.isArray(merged.banners) ? merged.banners : [];
  merged.homeSections = Array.isArray(merged.homeSections) ? merged.homeSections : [];
  merged.reorder = Array.isArray(merged.reorder) ? merged.reorder : [];
  merged.etaBaseMinutes = Number(merged.etaBaseMinutes || 8);

  merged.products = merged.products.map((product, index) => ({
    id: product.id || `p_${index + 1}`,
    name: product.name || "Product",
    category: product.category || merged.categories[0],
    qty: product.qty || "",
    price: Number(product.price || 0),
    mrp: Number(product.mrp || product.price || 0),
    tags: Array.isArray(product.tags) ? product.tags : ["all"],
    imageUrl: product.imageUrl || "",
    status: product.status || "ACTIVE"
  }));

  return merged;
}

function apiUrl(path) {
  return `${state.backendBase.replace(/\/$/, "")}${path}`;
}

async function fetchJsonWithTimeout(url, timeoutMs = 2200, options = {}) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    return await response.json();
  } finally {
    window.clearTimeout(timer);
  }
}

async function fetchConfig() {
  const candidates = backendCandidates();

  let loaded = false;

  for (const candidate of candidates) {
    try {
      state.backendBase = candidate;
      const data = await fetchJsonWithTimeout(apiUrl("/studio/config"));
      applyConfig(data, { persist: true, render: true });
      persistBackend();
      loaded = true;
      break;
    } catch {
      // Try next backend candidate.
    }
  }

  if (!loaded) {
    try {
      const data = await fetchJsonWithTimeout("./studio-config.json", 1800, { cache: "no-store" });
      applyConfig(data, { persist: true, render: true });
      loaded = true;
    } catch {
      // Fall through to cached/default data.
    }
  }

  if (loaded) {
    elements.backendInput.value = state.backendBase;
    showToast("Website synced with Studio");
  } else {
    const cached = loadCachedConfig();
    if (cached) {
      applyConfig(cached, { persist: false, render: true });
      showToast("Using cached Studio data");
    } else {
      applyConfig(DEFAULT_CONFIG, { persist: false, render: true });
      showToast("Using offline fallback data");
    }
  }
}

async function syncLiveConfig() {
  if (document.hidden) return;

  for (const candidate of backendCandidates()) {
    try {
      state.backendBase = candidate;
      const data = await fetchJsonWithTimeout(apiUrl("/studio/config"), 1800, { cache: "no-store" });
      const normalized = normalizeConfig(data);
      const nextUpdatedAt = String(normalized.updatedAt || "").trim();
      const hasChanged = nextUpdatedAt && nextUpdatedAt !== state.lastConfigUpdatedAt;

      if (hasChanged) {
        applyConfig(normalized, { persist: true, render: true });
        persistBackend();
        elements.backendInput.value = state.backendBase;
        showToast("Live updates synced");
      }
      return;
    } catch {
      // Try next backend candidate.
    }
  }
}

function startLiveSync() {
  if (state.liveSyncTimer) {
    window.clearInterval(state.liveSyncTimer);
  }

  state.liveSyncTimer = window.setInterval(() => {
    void syncLiveConfig();
  }, state.liveSyncIntervalMs);
}

async function loadRuntimeConfig() {
  try {
    const payload = await fetchJsonWithTimeout(RUNTIME_CONFIG_PATH, 1200, { cache: "no-store" });
    if (!payload || typeof payload !== "object") {
      return;
    }

    const runtimeBackendRaw =
      typeof payload.backendBase === "string" ? payload.backendBase.trim() : "";
    if (runtimeBackendRaw) {
      const nextBase = normalizeBackendBase(runtimeBackendRaw);
      state.runtimeBackendBase = nextBase;
      state.backendBase = nextBase;
      persistBackend();
    }

    const nextInterval = Number(payload.liveSyncIntervalMs);
    if (Number.isFinite(nextInterval)) {
      state.liveSyncIntervalMs = Math.max(2000, Math.min(60000, Math.floor(nextInterval)));
    }
  } catch {
    // Optional runtime config can be missing.
  }
}

function toRad(value) {
  return (value * Math.PI) / 180;
}

function calculateDistanceKm(lat1, lng1, lat2, lng2) {
  const earth = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earth * c;
}

function computeEtaMinutes() {
  const base = Number(state.config.etaBaseMinutes || 8);
  if (!state.location) return base;
  const darkStore = { lat: 17.385, lng: 78.4867 };
  const distance = calculateDistanceKm(darkStore.lat, darkStore.lng, state.location.lat, state.location.lng);
  return Math.max(base, Math.min(45, base + Math.round(distance * 2)));
}

function renderDelivery() {
  elements.deliveryEta.textContent = `Delivery in ${computeEtaMinutes()} minutes`;
}

async function reverseGeocodeLabel(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`
    );
    if (!response.ok) return "";
    const payload = await response.json();
    if (!payload?.display_name) return "";
    return String(payload.display_name).split(",").slice(0, 3).join(", ");
  } catch {
    return "";
  }
}

async function resolveLocationByIp() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    const payload = await response.json();
    const lat = Number(payload?.latitude);
    const lng = Number(payload?.longitude);
    const label = [payload?.city, payload?.region, payload?.country_name].filter(Boolean).join(", ");

    persistLocation(label || FALLBACK_LOCATION.label, lat, lng);
    renderDelivery();
    return;
  } catch {
    persistLocation(FALLBACK_LOCATION.label, FALLBACK_LOCATION.lat, FALLBACK_LOCATION.lng);
    renderDelivery();
  }
}

function detectLocation() {
  if (!("geolocation" in navigator)) {
    void resolveLocationByIp();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = Number(position.coords.latitude);
      const lng = Number(position.coords.longitude);
      const fallback = `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
      const label = (await reverseGeocodeLabel(lat, lng)) || fallback;
      persistLocation(label, lat, lng);
      renderDelivery();
    },
    () => {
      void resolveLocationByIp();
    },
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

function getVisibleProducts() {
  const query = state.searchQuery.trim().toLowerCase();
  return state.config.products.filter((product) => {
    if (product.status === "INACTIVE") return false;
    if (!query) return true;
    const blob = `${product.name} ${product.category} ${product.qty}`.toLowerCase();
    return blob.includes(query);
  });
}

function productsByCategory() {
  const visible = getVisibleProducts();
  const map = new Map();
  for (const category of state.config.categories) {
    map.set(category, visible.filter((product) => product.category === category));
  }
  return map;
}

function qtyInCart(productId) {
  const qty = Math.floor(Number(state.cart[productId] || 0));
  if (qty <= 0) return 0;
  if (!getActiveProductMap().has(productId)) return 0;
  return qty;
}

function cartCount() {
  const productMap = getActiveProductMap();
  return Object.entries(state.cart).reduce((sum, [productId, qty]) => {
    if (!productMap.has(productId)) return sum;
    return sum + Math.max(0, Math.floor(Number(qty || 0)));
  }, 0);
}

function cartTotal() {
  const productMap = getActiveProductMap();
  return Object.entries(state.cart).reduce((sum, [productId, qty]) => {
    const product = productMap.get(productId);
    if (!product) return sum;
    return sum + Number(product.price || 0) * Math.max(0, Math.floor(Number(qty || 0)));
  }, 0);
}

function productCardMarkup(product) {
  const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const image = imageMarkup(product.imageUrl, product.name, product.id || product.qty || "item");

  const qty = qtyInCart(product.id);

  return `
    <article class="product-card">
      <div class="product-image">
        ${discount >= 5 ? `<span class="offer-badge">${discount}% OFF</span>` : ""}
        ${image}
      </div>
      <span class="delivery-chip">◴ ${computeEtaMinutes()} MINS</span>
      <p class="product-title">${escapeHtml(product.name)}</p>
      <p class="product-qty">${escapeHtml(product.qty || "")}</p>
      <div class="price-row">
        <div>
          <span class="price-main">${currency(product.price)}</span>
          ${product.mrp > product.price ? `<span class="price-mrp">${currency(product.mrp)}</span>` : ""}
        </div>
        <button class="add-btn" data-add="${escapeHtml(product.id)}">${qty > 0 ? qty : "ADD"}</button>
      </div>
    </article>
  `;
}

function productListItemMarkup(product) {
  const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const image = imageMarkup(product.imageUrl, product.name, product.id || product.qty || "item");
  const qty = qtyInCart(product.id);

  return `
    <article class="category-list-card">
      <div class="category-list-image">
        ${discount >= 5 ? `<span class="offer-badge">${discount}% OFF</span>` : ""}
        ${image}
      </div>
      <div class="category-list-body">
        <span class="delivery-chip">◴ ${computeEtaMinutes()} MINS</span>
        <p class="category-list-title">${escapeHtml(product.name)}</p>
        <p class="category-list-qty">${escapeHtml(product.qty || "")}</p>
        <div class="category-list-price">
          <span class="price-main">${currency(product.price)}</span>
          ${product.mrp > product.price ? `<span class="price-mrp">${currency(product.mrp)}</span>` : ""}
        </div>
      </div>
      <div class="category-list-action">
        <button class="add-btn" data-add="${escapeHtml(product.id)}">${qty > 0 ? qty : "ADD"}</button>
      </div>
    </article>
  `;
}

function bannerMarkup(banner, fallbackIndex) {
  const colors = ["#d8f1ff", "#f6efc8", "#d5f3dc", "#f6d8e3"];
  const bgColor = banner?.bgColor || colors[fallbackIndex % colors.length];
  const textColor = banner?.textColor || "#213121";
  return `
    <article class="banner-card" style="background:${escapeHtml(bgColor)};color:${escapeHtml(textColor)}">
      <h3>${escapeHtml(banner?.title || "Fresh picks for every day")}</h3>
      <p>${escapeHtml(banner?.cta || "Order Now")}</p>
    </article>
  `;
}

function renderBannerStrip() {
  const banners = state.config.banners.slice(0, 3);
  if (!banners.length) {
    elements.bannerStrip.innerHTML = [0, 1, 2].map((i) => bannerMarkup(null, i)).join("");
    return;
  }
  elements.bannerStrip.innerHTML = banners.map((banner, i) => bannerMarkup(banner, i)).join("");
}

function renderCategoryStrip() {
  const byCategory = productsByCategory();
  elements.categoryStrip.innerHTML = state.config.categories
    .map((category) => {
      const product = byCategory.get(category)?.[0];
      const thumb = imageMarkup(product?.imageUrl || "", category, `${category.slice(0, 14)}-category`);
      return `
        <button class="category-pill" data-open-category="${escapeHtml(category)}">
          <span class="category-thumb">${thumb}</span>
          <span>${escapeHtml(category)}</span>
        </button>
      `;
    })
    .join("");
}

function renderHomeSections() {
  const byCategory = productsByCategory();
  const sections = Array.isArray(state.config.homeSections) ? state.config.homeSections : [];

  const blocks = [];
  if (sections.length) {
    for (const section of sections) {
      if (section.type === "BANNER") {
        const banner = state.config.banners.find((row) => row.id === section.bannerId) || state.config.banners[0];
        blocks.push(bannerMarkup(banner, 0));
        continue;
      }

      const category = section.category || section.title;
      const products = (byCategory.get(category) || []).slice(0, Number(section.limit || 12));
      if (!products.length) continue;
      const isVertical = String(section.layout || "").toUpperCase() === "VERTICAL";
      const content = isVertical
        ? `<div class="shelf-vertical">${products.map(productListItemMarkup).join("")}</div>`
        : `<div class="shelf-track">${products.map(productCardMarkup).join("")}</div>`;
      blocks.push(`
        <section class="shelf">
          <div class="shelf-head">
            <h2>${escapeHtml(section.title || category)}</h2>
            <button class="see-all-btn" data-see-all="${escapeHtml(category)}">see all</button>
          </div>
          ${content}
        </section>
      `);
    }
  }

  if (!blocks.length) {
    for (const category of state.config.categories) {
      const products = (byCategory.get(category) || []).slice(0, 12);
      if (!products.length) continue;
      blocks.push(`
        <section class="shelf">
          <div class="shelf-head">
            <h2>${escapeHtml(category)}</h2>
            <button class="see-all-btn" data-see-all="${escapeHtml(category)}">see all</button>
          </div>
          <div class="shelf-track">${products.map(productCardMarkup).join("")}</div>
        </section>
      `);
    }
  }

  elements.homeSections.innerHTML = blocks.join("") || `<p>No products found.</p>`;
}

function renderCategoryPage() {
  const byCategory = productsByCategory();
  elements.categoryTitle.textContent = state.selectedCategory || "Category";

  elements.subCategoryList.innerHTML = state.config.categories
    .map((category) => {
      const active = category === state.selectedCategory;
      return `
        <button class="sub-cat-btn ${active ? "active" : ""}" data-sub-cat="${escapeHtml(category)}">
          ${escapeHtml(category)}
        </button>
      `;
    })
    .join("");

  const list = byCategory.get(state.selectedCategory) || [];
  elements.categoryGrid.innerHTML = list.map(productListItemMarkup).join("") || `<p>No products for this category.</p>`;
}

function renderCartButton() {
  const count = cartCount();
  const total = cartTotal();
  if (count === 0) {
    elements.cartBtn.classList.remove("has-items");
    elements.cartBtnLabel.textContent = "My Cart";
    elements.floatingCart.classList.add("hidden");
    elements.floatingCart.classList.remove("show-drop");
    elements.floatingCartLabel.textContent = "Cart · ₹0";
  } else {
    elements.cartBtn.classList.add("has-items");
    elements.cartBtnLabel.textContent = `${count} items · ${currency(total)}`;
    elements.floatingCart.classList.remove("hidden");
    elements.floatingCartLabel.textContent = `Cart (${count}) · ${currency(total)}`;
  }
}

function triggerFloatingCartDrop() {
  if (cartCount() <= 0) return;
  elements.floatingCart.classList.remove("hidden");
  elements.floatingCart.classList.remove("show-drop");
  void elements.floatingCart.offsetWidth;
  elements.floatingCart.classList.add("show-drop");
}

function renderCartDrawer() {
  const productMap = getActiveProductMap();
  const rows = Object.entries(state.cart)
    .map(([productId, qty]) => {
      const product = productMap.get(productId);
      const safeQty = Math.max(0, Math.floor(Number(qty || 0)));
      if (!product || safeQty <= 0) return "";
      return `
        <article class="cart-item">
          <div>
            <p><strong>${escapeHtml(product.name)}</strong></p>
            <p class="meta">${escapeHtml(product.qty || "")}</p>
            <p class="meta">${currency(product.price * safeQty)}</p>
          </div>
          <div class="qty-box">
            <button data-minus="${escapeHtml(product.id)}">-</button>
            <span>${safeQty}</span>
            <button data-plus="${escapeHtml(product.id)}">+</button>
          </div>
        </article>
      `;
    })
    .filter(Boolean);

  const subtotal = cartTotal();
  const delivery = subtotal > 0 ? 19 : 0;
  const total = subtotal + delivery;

  elements.cartItems.innerHTML = rows.join("") || "<p>Cart is empty.</p>";
  elements.cartSummary.innerHTML = `
    <div class="sum-row"><span>Items</span><strong>${cartCount()}</strong></div>
    <div class="sum-row"><span>Subtotal</span><strong>${currency(subtotal)}</strong></div>
    <div class="sum-row"><span>Delivery</span><strong>${currency(delivery)}</strong></div>
    <div class="sum-row total"><span>Total</span><strong>${currency(total)}</strong></div>
  `;
}

function showView(view) {
  state.view = view;
  elements.homeView.classList.toggle("active", view === "home");
  elements.categoryView.classList.toggle("active", view === "category");
}

function renderAll() {
  renderLoginButton();
  renderDelivery();
  renderBannerStrip();
  renderCategoryStrip();
  renderHomeSections();
  renderCategoryPage();
  renderCartButton();
  renderCartDrawer();
  if (!elements.accountDrawer.classList.contains("hidden")) {
    renderAccountDrawer();
  }
}

function updateQty(productId, qty) {
  const safeQty = Math.floor(Number(qty || 0));
  const isKnownProduct = getActiveProductMap().has(productId);
  if (safeQty <= 0 || !isKnownProduct) {
    delete state.cart[productId];
  } else {
    state.cart[productId] = safeQty;
  }
  sanitizeCart();
  persistCart();
  renderAll();
}

function openCategory(category) {
  state.selectedCategory = category;
  showView("category");
  renderCategoryPage();
}

function openCart() {
  closeAccountDrawer();
  elements.cartDrawer.classList.remove("hidden");
}

function closeCart() {
  elements.cartDrawer.classList.add("hidden");
}

function handleBodyClick(event) {
  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    const productId = addButton.dataset.add;
    updateQty(productId, qtyInCart(productId) + 1);
    triggerFloatingCartDrop();
    openCart();
    showToast("Added to cart");
    return;
  }

  const minusButton = event.target.closest("[data-minus]");
  if (minusButton) {
    const productId = minusButton.dataset.minus;
    updateQty(productId, qtyInCart(productId) - 1);
    return;
  }

  const plusButton = event.target.closest("[data-plus]");
  if (plusButton) {
    const productId = plusButton.dataset.plus;
    updateQty(productId, qtyInCart(productId) + 1);
    return;
  }

  const categoryButton = event.target.closest("[data-open-category]");
  if (categoryButton) {
    openCategory(categoryButton.dataset.openCategory);
    return;
  }

  const seeAllButton = event.target.closest("[data-see-all]");
  if (seeAllButton) {
    openCategory(seeAllButton.dataset.seeAll);
    return;
  }

  const subCategoryButton = event.target.closest("[data-sub-cat]");
  if (subCategoryButton) {
    state.selectedCategory = subCategoryButton.dataset.subCat;
    renderCategoryPage();
  }
}

function attachEvents() {
  document.body.addEventListener("click", handleBodyClick);

  elements.searchInput.addEventListener("input", () => {
    state.searchQuery = elements.searchInput.value.trim();
    renderAll();
  });

  elements.loginBtn.addEventListener("click", () => {
    if (state.user) {
      toggleUserMenu();
      return;
    }
    openAuthModal("login");
  });

  elements.userMenuToggle.addEventListener("click", () => {
    toggleUserMenu();
  });

  elements.userMenu.addEventListener("click", (event) => {
    const button = event.target.closest("[data-user-menu-action]");
    if (!button) return;
    handleUserMenuAction(button.dataset.userMenuAction);
  });

  elements.accountContent.addEventListener("click", handleAccountContentClick);
  elements.accountContent.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-address-form]");
    if (!form) return;
    event.preventDefault();
    handleAddressFormSubmit(form);
  });
  elements.closeAccountBtn.addEventListener("click", closeAccountDrawer);
  elements.accountDrawer.addEventListener("click", (event) => {
    if (event.target === elements.accountDrawer) {
      closeAccountDrawer();
    }
  });

  elements.authCloseBtn.addEventListener("click", closeAuthModal);
  elements.authModal.addEventListener("click", (event) => {
    if (event.target === elements.authModal) {
      closeAuthModal();
    }
  });
  elements.authLoginTab.addEventListener("click", () => setAuthMode("login"));
  elements.authSignupTab.addEventListener("click", () => setAuthMode("signup"));
  elements.authForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (state.authMode === "signup") {
      signupWithMobile();
      return;
    }
    loginWithMobile();
  });
  elements.authGoogleBtn.addEventListener("click", authenticateWithGoogle);
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!elements.authModal.classList.contains("hidden")) {
      closeAuthModal();
      return;
    }
    if (!elements.accountDrawer.classList.contains("hidden")) {
      closeAccountDrawer();
      return;
    }
    closeUserMenu();
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".user-menu-wrap")) return;
    closeUserMenu();
  });

  elements.connectBtn.addEventListener("click", async () => {
    state.backendBase = normalizeBackendBase(elements.backendInput.value);
    elements.backendInput.value = state.backendBase;
    persistBackend();
    await fetchConfig();
  });

  elements.refreshBtn.addEventListener("click", async () => {
    detectLocation();
    await fetchConfig();
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      void syncLiveConfig();
    }
  });

  elements.brandBtn.addEventListener("click", () => showView("home"));
  elements.backHomeBtn.addEventListener("click", () => showView("home"));
  elements.cartBtn.addEventListener("click", openCart);
  elements.floatingCart.addEventListener("click", openCart);
  elements.closeCartBtn.addEventListener("click", closeCart);

  elements.cartDrawer.addEventListener("click", (event) => {
    if (event.target === elements.cartDrawer) {
      closeCart();
    }
  });
}

async function init() {
  await loadRuntimeConfig();
  elements.backendInput.value = state.backendBase || defaultBackendBase;
  loadCachedLocation();
  renderDelivery();
  const cachedConfig = loadCachedConfig();
  if (cachedConfig) {
    applyConfig(cachedConfig, { persist: false, render: false });
  } else {
    applyConfig(DEFAULT_CONFIG, { persist: false, render: false });
  }
  setAuthMode("login");
  renderLoginButton();
  attachEvents();
  showView("home");
  renderAll();
  startLiveSync();
  detectLocation();
  void fetchConfig();
}

init();
