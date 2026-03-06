const API_BASE_KEY = "frezo_admin_api_base_v1";
const LOCAL_STATE_KEY = "frezo_admin_local_state_v2";

const DEFAULT_STATE = {
  version: 1,
  updatedAt: new Date().toISOString(),
  app: {
    name: "FREZO",
    subtitle: "india's next gen grocery app",
    tagline: '"fast fresh frezo"'
  },
  etaBaseMinutes: 7,
  categories: [
    "Fruits & Vegetables (fresh produce)",
    "Dairy & Eggs",
    "Bakery & Breads",
    "Rice & Pulses",
    "Snacks & Namkeen",
    "Beverages (Tea, Coffee, Juices, Soft Drinks)",
    "Household Essentials (cleaning supplies, detergents)",
    "Personal Care & Hygiene (soaps, shampoos, toothpaste)",
    "Frozen Foods & Ice-creams",
    "Medicines & Health Supplies (OTC meds, first-aid, vitamins)"
  ],
  topFilters: [
    { id: "all", label: "All", icon: "A" },
    { id: "maxxsaver", label: "MaxxSaver", icon: "M" },
    { id: "ramzan", label: "Ramzan", icon: "R" },
    { id: "fresh", label: "Fresh", icon: "F" },
    { id: "summer", label: "Summer", icon: "S" }
  ],
  products: [
    {
      id: "p_1",
      name: "Amul Taaza Milk",
      category: "Dairy & Eggs",
      qty: "1 L",
      price: 72,
      mrp: 78,
      stock: 85,
      rating: "4.6",
      tags: ["all", "fresh"],
      imageUrl: "/assets/products/p1.jpg",
      imageFit: "cover",
      imageScale: 1,
      color: "#e9eef8",
      status: "ACTIVE"
    },
    {
      id: "p_2",
      name: "Farm Fresh Banana",
      category: "Fruits & Vegetables (fresh produce)",
      qty: "1 dozen",
      price: 59,
      mrp: 66,
      stock: 42,
      rating: "4.5",
      tags: ["all", "maxxsaver"],
      imageUrl: "/assets/products/p2.jpg",
      imageFit: "cover",
      imageScale: 1,
      color: "#f8ecdf",
      status: "ACTIVE"
    },
    {
      id: "p_3",
      name: "Basmati Rice",
      category: "Rice & Pulses",
      qty: "5 kg",
      price: 429,
      mrp: 470,
      stock: 14,
      rating: "4.7",
      tags: ["all", "maxxsaver"],
      imageUrl: "/assets/products/p3.jpg",
      imageFit: "cover",
      imageScale: 1,
      color: "#e6f2e2",
      status: "ACTIVE"
    }
  ],
  quickCategories: [
    { id: "qc_1", name: "Fruits", category: "Fruits & Vegetables (fresh produce)", color: "#e9eef8" },
    { id: "qc_2", name: "Dairy", category: "Dairy & Eggs", color: "#f8ecdf" },
    { id: "qc_3", name: "Snacks", category: "Snacks & Namkeen", color: "#e6f2e2" }
  ],
  banners: [
    {
      id: "bnr_1",
      title: "Limited Period Offer",
      subtitle: "Up to 60% off on groceries",
      cta: "Use code FREZO60",
      code: "FREZO60",
      bgColor: "#daf6df",
      textColor: "#0d6a2c"
    }
  ],
  homeSections: [
    { id: "sec_1", type: "PRODUCT_GRID", layout: "HORIZONTAL", title: "Popular right now", category: "Dairy & Eggs", bannerId: "", limit: 6 },
    { id: "sec_2", type: "PRODUCT_GRID", layout: "HORIZONTAL", title: "Fresh picks", category: "Fruits & Vegetables (fresh produce)", bannerId: "", limit: 6 },
    { id: "sec_3", type: "BANNER", layout: "HORIZONTAL", title: "Promo", category: "", bannerId: "bnr_1", limit: 0 }
  ],
  recentlyViewedProductIds: ["p_1", "p_2"],
  reorder: [
    { id: "r_1", label: "Friday Basket", date: "Mar 1", productIds: ["p_1", "p_2"] }
  ],
  invoices: [
    { id: "INV-2014", amount: 564, date: "Mar 1" },
    { id: "INV-1987", amount: 1024, date: "Feb 24" }
  ],
  orders: [
    { id: "O-501", user: "Aarav", city: "Bangalore", amount: 386, payment: "UPI", status: "DELIVERED", createdAt: "2026-03-01T09:30:00.000Z" },
    { id: "O-502", user: "Isha", city: "Hyderabad", amount: 564, payment: "CARD", status: "OUT_FOR_DELIVERY", createdAt: "2026-03-01T10:05:00.000Z" },
    { id: "O-503", user: "Kabir", city: "Pune", amount: 224, payment: "COD", status: "PACKING", createdAt: "2026-03-01T10:15:00.000Z" }
  ],
  coupons: [
    { id: "C-1", code: "FREZO50", type: "FLAT", value: 50, minCart: 299, active: true },
    { id: "C-2", code: "FAST10", type: "PERCENT", value: 10, minCart: 199, active: true }
  ],
  users: [
    { id: "U-1", name: "Aarav Sharma", email: "aarav@example.com", phone: "+91 9900112233", city: "Bangalore", status: "ACTIVE" },
    { id: "U-2", name: "Isha Verma", email: "isha@example.com", phone: "+91 9911223344", city: "Hyderabad", status: "ACTIVE" }
  ],
  logs: [{ id: "L-1", text: "Frezo studio booted" }]
};

const viewMeta = {
  home: { title: "Studio Home", subtitle: "Switch modules instantly from the left navigation" },
  dashboard: { title: "Dashboard", subtitle: "Live snapshot of Frezo operations" },
  products: { title: "Products", subtitle: "Catalog, stock, images and activation control" },
  categories: { title: "Categories", subtitle: "Manage category taxonomy" },
  studio: { title: "Studio Layout", subtitle: "Manage banners and home product-container sections" },
  orders: { title: "Orders", subtitle: "Track and update order lifecycle" },
  coupons: { title: "Coupons", subtitle: "Configure discounts and cart rules" },
  users: { title: "Users", subtitle: "Monitor customer activity and status" }
};

const elements = {
  nav: document.getElementById("mainNav"),
  viewTitle: document.getElementById("viewTitle"),
  viewSubtitle: document.getElementById("viewSubtitle"),
  syncStatus: document.getElementById("syncStatus"),
  apiBaseInput: document.getElementById("apiBaseInput"),
  connectBtn: document.getElementById("connectBtn"),
  seedBtn: document.getElementById("seedBtn"),
  exportBtn: document.getElementById("exportBtn"),
  logList: document.getElementById("logList"),

  dashboardView: document.getElementById("dashboardView"),
  kpiProducts: document.getElementById("kpiProducts"),
  kpiLowStock: document.getElementById("kpiLowStock"),
  kpiActiveOrders: document.getElementById("kpiActiveOrders"),
  kpiRevenue: document.getElementById("kpiRevenue"),
  statusBars: document.getElementById("statusBars"),
  stockAlerts: document.getElementById("stockAlerts"),

  productForm: document.getElementById("productForm"),
  productName: document.getElementById("productName"),
  productCategory: document.getElementById("productCategory"),
  productQty: document.getElementById("productQty"),
  productPrice: document.getElementById("productPrice"),
  productMrp: document.getElementById("productMrp"),
  productStock: document.getElementById("productStock"),
  productRating: document.getElementById("productRating"),
  productTags: document.getElementById("productTags"),
  productImage: document.getElementById("productImage"),
  productImageFit: document.getElementById("productImageFit"),
  productImageScale: document.getElementById("productImageScale"),
  productColor: document.getElementById("productColor"),
  productStatus: document.getElementById("productStatus"),
  productSearch: document.getElementById("productSearch"),
  productsTableBody: document.getElementById("productsTableBody"),
  imageResizerForm: document.getElementById("imageResizerForm"),
  resizeSource: document.getElementById("resizeSource"),
  resizeWidth: document.getElementById("resizeWidth"),
  resizeHeight: document.getElementById("resizeHeight"),
  resizeFit: document.getElementById("resizeFit"),
  resizeOutput: document.getElementById("resizeOutput"),
  resizePreview: document.getElementById("resizePreview"),

  categoryForm: document.getElementById("categoryForm"),
  categoryName: document.getElementById("categoryName"),
  categoriesGrid: document.getElementById("categoriesGrid"),

  appMetaForm: document.getElementById("appMetaForm"),
  appName: document.getElementById("appName"),
  appSubtitle: document.getElementById("appSubtitle"),
  appTagline: document.getElementById("appTagline"),
  etaBase: document.getElementById("etaBase"),

  bannerForm: document.getElementById("bannerForm"),
  bannerTitle: document.getElementById("bannerTitle"),
  bannerSubtitle: document.getElementById("bannerSubtitle"),
  bannerCta: document.getElementById("bannerCta"),
  bannerCode: document.getElementById("bannerCode"),
  bannerBg: document.getElementById("bannerBg"),
  bannerText: document.getElementById("bannerText"),
  bannersTableBody: document.getElementById("bannersTableBody"),

  sectionForm: document.getElementById("sectionForm"),
  sectionType: document.getElementById("sectionType"),
  sectionLayout: document.getElementById("sectionLayout"),
  sectionTitle: document.getElementById("sectionTitle"),
  sectionCategory: document.getElementById("sectionCategory"),
  sectionBannerId: document.getElementById("sectionBannerId"),
  sectionLimit: document.getElementById("sectionLimit"),
  sectionsTableBody: document.getElementById("sectionsTableBody"),

  orderFilter: document.getElementById("orderFilter"),
  orderSearch: document.getElementById("orderSearch"),
  ordersTableBody: document.getElementById("ordersTableBody"),

  couponForm: document.getElementById("couponForm"),
  couponCode: document.getElementById("couponCode"),
  couponType: document.getElementById("couponType"),
  couponValue: document.getElementById("couponValue"),
  couponMinCart: document.getElementById("couponMinCart"),
  couponsTableBody: document.getElementById("couponsTableBody"),

  usersTableBody: document.getElementById("usersTableBody")
};

let state = clone(DEFAULT_STATE);
let activeView = "home";

const defaultApiBase = (() => {
  const protocol = window.location.protocol.startsWith("http") ? window.location.protocol : "http:";
  const host = window.location.hostname || "localhost";
  return `${protocol}//${host}:4000`;
})();

function normalizeApiBaseInput(value) {
  const cleaned = String(value || "")
    .trim()
    .replace(/\/studio\/config\/?$/i, "")
    .replace(/\/$/, "");

  if (!cleaned) {
    return "";
  }

  try {
    const parsed = new URL(cleaned);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return cleaned;
  }
}

let apiBase = normalizeApiBaseInput(localStorage.getItem(API_BASE_KEY) || defaultApiBase) || defaultApiBase;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadLocalState() {
  try {
    const raw = localStorage.getItem(LOCAL_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return normalizeState(parsed);
  } catch {
    return null;
  }
}

function persistLocalState() {
  localStorage.setItem(LOCAL_STATE_KEY, JSON.stringify(state));
}

function normalizeState(value) {
  const merged = {
    ...clone(DEFAULT_STATE),
    ...(value || {})
  };

  merged.app = { ...DEFAULT_STATE.app, ...(merged.app || {}) };
  merged.categories = Array.isArray(merged.categories) ? merged.categories : clone(DEFAULT_STATE.categories);
  merged.topFilters = Array.isArray(merged.topFilters) && merged.topFilters.length ? merged.topFilters : clone(DEFAULT_STATE.topFilters);
  merged.products = Array.isArray(merged.products)
    ? merged.products.map((product) => ({
        imageFit: "cover",
        imageScale: 1,
        ...product,
        imageFit: product?.imageFit === "contain" ? "contain" : "cover",
        imageScale:
          typeof product?.imageScale === "number" && Number.isFinite(product.imageScale)
            ? Math.max(0.5, Math.min(2, product.imageScale))
            : 1
      }))
    : [];
  merged.quickCategories = Array.isArray(merged.quickCategories) ? merged.quickCategories : [];
  merged.banners = Array.isArray(merged.banners) ? merged.banners : [];
  merged.homeSections = Array.isArray(merged.homeSections)
    ? merged.homeSections.map((section) => ({
        layout: "HORIZONTAL",
        ...section,
        layout: section?.layout === "VERTICAL" ? "VERTICAL" : "HORIZONTAL"
      }))
    : [];
  merged.recentlyViewedProductIds = Array.isArray(merged.recentlyViewedProductIds) ? merged.recentlyViewedProductIds : [];
  merged.reorder = Array.isArray(merged.reorder) ? merged.reorder : [];
  merged.invoices = Array.isArray(merged.invoices) ? merged.invoices : [];
  merged.orders = Array.isArray(merged.orders) ? merged.orders : [];
  merged.coupons = Array.isArray(merged.coupons) ? merged.coupons : [];
  merged.users = Array.isArray(merged.users) ? merged.users : [];
  merged.logs = Array.isArray(merged.logs) ? merged.logs : [];

  if (!merged.categories.length) {
    merged.categories = clone(DEFAULT_STATE.categories);
  }

  return merged;
}

function setSyncStatus(text, tone = "neutral") {
  elements.syncStatus.textContent = text;
  elements.syncStatus.classList.remove("ok", "warn", "bad");
  if (tone !== "neutral") {
    elements.syncStatus.classList.add(tone);
  }
}

function asApiUrl(path) {
  const base = apiBase.trim().replace(/\/$/, "");
  return `${base}${path}`;
}

async function request(path, options = {}) {
  const response = await fetch(asApiUrl(path), {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return payload;
}

function formatCurrency(value) {
  return `Rs ${Number(value).toLocaleString("en-IN")}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function ensureCategory(category) {
  if (!category) return;
  if (!state.categories.includes(category)) {
    state.categories.unshift(category);
  }
}

function renameCategoryReferences(fromCategory, toCategory) {
  if (!fromCategory || !toCategory || fromCategory === toCategory) {
    return;
  }

  state.products = state.products.map((product) =>
    product.category === fromCategory
      ? {
          ...product,
          category: toCategory
        }
      : product
  );

  state.quickCategories = state.quickCategories.map((entry) =>
    entry.category === fromCategory
      ? {
          ...entry,
          category: toCategory,
          name: entry.name === fromCategory ? toCategory.slice(0, 18) : entry.name
        }
      : entry
  );

  state.homeSections = state.homeSections.map((section) =>
    section.type === "PRODUCT_GRID" && section.category === fromCategory
      ? {
          ...section,
          category: toCategory,
          title: section.title === fromCategory ? toCategory : section.title
        }
      : section
  );
}

function removeCategoryReferences(category, fallbackCategory) {
  if (!category || !fallbackCategory || category === fallbackCategory) {
    return;
  }

  renameCategoryReferences(category, fallbackCategory);
  state.quickCategories = state.quickCategories.filter((entry) => entry.category !== category);
}

function addLog(text) {
  state.logs.unshift({ id: `L-${Date.now()}`, text: `${new Date().toLocaleTimeString()} - ${text}` });
  state.logs = state.logs.slice(0, 30);
}

async function loadState() {
  setSyncStatus("Connecting to studio backend...", "warn");

  const candidates = [apiBase, defaultApiBase]
    .map((value) => normalizeApiBaseInput(value))
    .filter((value, index, list) => value && list.indexOf(value) === index);

  let lastError = null;
  for (const candidate of candidates) {
    try {
      apiBase = candidate;
      const data = await request("/studio/config");
      state = normalizeState(data);
      persistLocalState();
      localStorage.setItem(API_BASE_KEY, apiBase);
      elements.apiBaseInput.value = apiBase;
      setSyncStatus(`Connected: ${apiBase}`, "ok");
      renderAll();
      return;
    } catch (error) {
      lastError = error;
    }
  }

  {
    const localDraft = loadLocalState();
    if (localDraft) {
      state = localDraft;
      setSyncStatus(`Backend unreachable (${lastError?.message || "unknown"}). Loaded local draft data.`, "warn");
    } else {
      state = normalizeState(DEFAULT_STATE);
      persistLocalState();
      setSyncStatus(`Backend unreachable (${lastError?.message || "unknown"}). Showing default local data.`, "bad");
    }
    renderAll();
  }
}

async function saveState(note) {
  state.updatedAt = new Date().toISOString();

  const candidates = [apiBase, defaultApiBase]
    .map((value) => normalizeApiBaseInput(value))
    .filter((value, index, list) => value && list.indexOf(value) === index);

  let saved = false;
  let lastError = null;

  for (const candidate of candidates) {
    try {
      apiBase = candidate;
      const updated = await request("/studio/config", { method: "PUT", body: state });
      state = normalizeState(updated);
      persistLocalState();
      localStorage.setItem(API_BASE_KEY, apiBase);
      elements.apiBaseInput.value = apiBase;
      setSyncStatus(`Saved to ${apiBase} at ${new Date().toLocaleTimeString()}`, "ok");
      saved = true;
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!saved) {
    persistLocalState();
    setSyncStatus(`Backend save failed (${lastError?.message || "unknown"}). Changes saved locally only.`, "warn");
  }

  if (note) {
    addLog(note);
  }

  renderAll();
}

async function resetServerData() {
  setSyncStatus("Resetting data on backend...", "warn");
  const updated = await request("/studio/reset", { method: "POST" });
  state = normalizeState(updated);
  addLog("Studio data reset from backend defaults");
  setSyncStatus("Reset complete", "ok");
  renderAll();
}

function setView(view) {
  activeView = viewMeta[view] ? view : "home";

  document.querySelectorAll(".nav-link").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === activeView);
  });

  document.querySelectorAll(".view").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `${activeView}View`);
  });

  const meta = viewMeta[activeView];
  elements.viewTitle.textContent = meta.title;
  elements.viewSubtitle.textContent = meta.subtitle;
}

function navigateToView(view, options = {}) {
  const nextView = viewMeta[view] ? view : "home";
  const replace = options.replace === true;

  setView(nextView);

  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set("view", nextView);
  const nextHref = `${nextUrl.pathname}?${nextUrl.searchParams.toString()}`;

  if (replace) {
    window.history.replaceState({ view: nextView }, "", nextHref);
  } else {
    window.history.pushState({ view: nextView }, "", nextHref);
  }
}

function renderLogs() {
  elements.logList.innerHTML = "";
  for (const row of state.logs) {
    const li = document.createElement("li");
    li.textContent = row.text;
    elements.logList.append(li);
  }
}

function renderDashboard() {
  const lowStock = state.products.filter((p) => Number(p.stock) <= 10 && p.status === "ACTIVE").length;
  const activeOrders = state.orders.filter((o) => ["PLACED", "PACKING", "OUT_FOR_DELIVERY"].includes(o.status)).length;
  const revenue = state.orders
    .filter((o) => o.status === "DELIVERED")
    .reduce((sum, row) => sum + Number(row.amount || 0), 0);

  elements.kpiProducts.textContent = String(state.products.length);
  elements.kpiLowStock.textContent = String(lowStock);
  elements.kpiActiveOrders.textContent = String(activeOrders);
  elements.kpiRevenue.textContent = formatCurrency(revenue);

  const statusCount = state.orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const max = Math.max(1, ...Object.values(statusCount));
  elements.statusBars.innerHTML = "";
  for (const [status, count] of Object.entries(statusCount)) {
    const row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `
      <span>${status.replaceAll("_", " ")}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${(count / max) * 100}%"></div></div>
      <strong>${count}</strong>
    `;
    elements.statusBars.append(row);
  }

  elements.stockAlerts.innerHTML = "";
  const alerts = state.products.filter((p) => Number(p.stock) <= 10 && p.status === "ACTIVE");
  if (!alerts.length) {
    elements.stockAlerts.innerHTML = "<li>No low-stock products</li>";
  } else {
    for (const item of alerts) {
      const li = document.createElement("li");
      li.textContent = `${item.name} (${item.category}) - stock ${item.stock}`;
      elements.stockAlerts.append(li);
    }
  }
}

function renderProducts() {
  const query = elements.productSearch.value.trim().toLowerCase();
  const rows = state.products.filter((product) => {
    if (!query) return true;
    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      String(product.tags || "").toLowerCase().includes(query)
    );
  });

  elements.productsTableBody.innerHTML = "";
  for (const product of rows) {
    const safeName = escapeHtml(product.name);
    const safeCategory = escapeHtml(product.category);
    const safeQty = escapeHtml(product.qty || "");
    const safeTags = escapeHtml(Array.isArray(product.tags) ? product.tags.join(",") : String(product.tags || ""));
    const safeImageUrl = escapeHtml(product.imageUrl || "");
    const safeColor = escapeHtml(product.color || "#e9eef8");
    const safeRating = escapeHtml(product.rating || "4.5");

    const image = product.imageUrl
      ? `<img class="thumb" src="${safeImageUrl}" alt="${safeName}" />`
      : `<div class="thumb placeholder" style="background:${safeColor}">${safeQty || "--"}</div>`;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${image}</td>
      <td><input class="table-input" data-field="name" value="${safeName}" /></td>
      <td><input class="table-input" data-field="category" value="${safeCategory}" /></td>
      <td><input class="table-input short" data-field="qty" value="${safeQty}" /></td>
      <td><input class="table-input short" data-field="price" type="number" min="1" value="${Number(product.price || 1)}" /></td>
      <td><input class="table-input short" data-field="mrp" type="number" min="1" value="${Number(product.mrp || 1)}" /></td>
      <td><input class="table-input short" data-field="stock" type="number" min="0" value="${Number(product.stock || 0)}" /></td>
      <td><input class="table-input short" data-field="rating" value="${safeRating}" /></td>
      <td><input class="table-input medium" data-field="tags" value="${safeTags}" /></td>
      <td><input class="table-input wide" data-field="imageUrl" value="${safeImageUrl}" placeholder="https://..." /></td>
      <td>
        <select class="table-input short" data-field="imageFit">
          <option value="cover" ${product.imageFit === "cover" ? "selected" : ""}>cover</option>
          <option value="contain" ${product.imageFit === "contain" ? "selected" : ""}>contain</option>
        </select>
      </td>
      <td><input class="table-input short" data-field="imageScale" type="number" min="0.5" max="2" step="0.1" value="${Number(product.imageScale || 1)}" /></td>
      <td><input class="table-input short" data-field="color" value="${safeColor}" /></td>
      <td>
        <select class="table-input short" data-field="status">
          <option value="ACTIVE" ${product.status === "ACTIVE" ? "selected" : ""}>ACTIVE</option>
          <option value="INACTIVE" ${product.status === "INACTIVE" ? "selected" : ""}>INACTIVE</option>
        </select>
      </td>
      <td class="actions-cell">
        <button class="tiny secondary" data-action="save" data-id="${product.id}">Save</button>
        <button class="tiny danger" data-action="delete" data-id="${product.id}">Delete</button>
      </td>
    `;
    elements.productsTableBody.append(tr);
  }
}

function renderCategories() {
  elements.categoriesGrid.innerHTML = "";
  state.categories.forEach((category, index) => {
    const count = state.products.filter((product) => product.category === category).length;
    const card = document.createElement("article");
    card.className = "chip-card";
    card.innerHTML = `
      <div class="chip-card-main">
        <h4>${escapeHtml(category)}</h4>
        <p>${count} products</p>
      </div>
      <div class="chip-card-actions">
        <button class="tiny secondary" data-category-action="move-up" data-category="${escapeHtml(category)}" ${index === 0 ? "disabled" : ""}>Up</button>
        <button class="tiny secondary" data-category-action="move-down" data-category="${escapeHtml(category)}" ${index === state.categories.length - 1 ? "disabled" : ""}>Down</button>
        <button class="tiny secondary" data-category-action="edit" data-category="${escapeHtml(category)}">Edit</button>
        <button class="tiny danger" data-category-action="delete" data-category="${escapeHtml(category)}">Delete</button>
      </div>
    `;
    elements.categoriesGrid.append(card);
  });
}

function renderStudioHeaderForm() {
  elements.appName.value = state.app?.name || "";
  elements.appSubtitle.value = state.app?.subtitle || "";
  elements.appTagline.value = state.app?.tagline || "";
  elements.etaBase.value = String(state.etaBaseMinutes || 7);
}

function renderBanners() {
  elements.bannersTableBody.innerHTML = "";
  for (const banner of state.banners) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <strong>${banner.title}</strong><br/>
        <small class="muted">${banner.subtitle}</small>
      </td>
      <td>
        <span class="color-dot" style="background:${banner.bgColor}"></span>
        <span class="color-dot" style="background:${banner.textColor}"></span>
      </td>
      <td>${banner.code || "-"}</td>
      <td class="actions-cell">
        <button class="tiny secondary" data-banner-action="edit" data-id="${banner.id}">Edit</button>
        <button class="tiny danger" data-banner-action="delete" data-id="${banner.id}">Delete</button>
      </td>
    `;
    elements.bannersTableBody.append(tr);
  }
}

function renderSections() {
  elements.sectionsTableBody.innerHTML = "";

  state.homeSections.forEach((section, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${section.type}</td>
      <td>${section.layout || "HORIZONTAL"}</td>
      <td>${section.title || "-"}</td>
      <td>${section.type === "BANNER" ? section.bannerId || "-" : section.category || "-"}</td>
      <td>${section.limit || 0}</td>
      <td class="actions-cell">
        <button class="tiny secondary" data-section-action="up" data-id="${section.id}" ${index === 0 ? "disabled" : ""}>Up</button>
        <button class="tiny secondary" data-section-action="down" data-id="${section.id}" ${index === state.homeSections.length - 1 ? "disabled" : ""}>Down</button>
        <button class="tiny secondary" data-section-action="edit" data-id="${section.id}">Edit</button>
        <button class="tiny danger" data-section-action="delete" data-id="${section.id}">Delete</button>
      </td>
    `;
    elements.sectionsTableBody.append(tr);
  });
}

function renderOrders() {
  const filter = elements.orderFilter.value;
  const query = elements.orderSearch.value.trim().toLowerCase();

  const rows = state.orders.filter((order) => {
    const passFilter = filter === "ALL" || order.status === filter;
    const searchBlob = `${order.id} ${order.user} ${order.city}`.toLowerCase();
    const passSearch = !query || searchBlob.includes(query);
    return passFilter && passSearch;
  });

  elements.ordersTableBody.innerHTML = "";
  for (const order of rows) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${order.id}</td>
      <td>${order.user}<br/><small class="muted">${order.city}</small></td>
      <td>${formatCurrency(order.amount)}</td>
      <td>${order.payment}</td>
      <td><span class="badge">${order.status.replaceAll("_", " ")}</span></td>
      <td>
        <select class="status-select" data-id="${order.id}">
          <option value="PLACED" ${order.status === "PLACED" ? "selected" : ""}>PLACED</option>
          <option value="PACKING" ${order.status === "PACKING" ? "selected" : ""}>PACKING</option>
          <option value="OUT_FOR_DELIVERY" ${order.status === "OUT_FOR_DELIVERY" ? "selected" : ""}>OUT_FOR_DELIVERY</option>
          <option value="DELIVERED" ${order.status === "DELIVERED" ? "selected" : ""}>DELIVERED</option>
          <option value="CANCELLED" ${order.status === "CANCELLED" ? "selected" : ""}>CANCELLED</option>
        </select>
      </td>
    `;
    elements.ordersTableBody.append(tr);
  }
}

function renderCoupons() {
  elements.couponsTableBody.innerHTML = "";
  for (const coupon of state.coupons) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${coupon.code}</td>
      <td>${coupon.type === "FLAT" ? formatCurrency(coupon.value) : `${coupon.value}%`} OFF</td>
      <td>${formatCurrency(coupon.minCart)}</td>
      <td><span class="badge ${coupon.active ? "good" : "bad"}">${coupon.active ? "ACTIVE" : "INACTIVE"}</span></td>
      <td><button class="tiny secondary" data-coupon="${coupon.id}">${coupon.active ? "Disable" : "Enable"}</button></td>
    `;
    elements.couponsTableBody.append(tr);
  }
}

function renderUsers() {
  elements.usersTableBody.innerHTML = "";
  for (const user of state.users) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td>${user.city}</td>
      <td><span class="badge ${user.status === "ACTIVE" ? "good" : "bad"}">${user.status}</span></td>
      <td><button class="tiny secondary" data-user="${user.id}">${user.status === "ACTIVE" ? "Block" : "Unblock"}</button></td>
    `;
    elements.usersTableBody.append(tr);
  }
}

function renderAll() {
  renderLogs();
  renderDashboard();
  renderProducts();
  renderCategories();
  renderStudioHeaderForm();
  renderBanners();
  renderSections();
  renderOrders();
  renderCoupons();
  renderUsers();
}

function toTags(value) {
  return String(value || "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

async function commit(note) {
  await saveState(note);
}

function attachEvents() {
  elements.apiBaseInput.value = apiBase;

  window.addEventListener("popstate", () => {
    const fromUrl = new URLSearchParams(window.location.search).get("view") || "home";
    setView(fromUrl);
  });

  document.querySelectorAll("a[data-view]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const view = link.dataset.view || "";
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      event.preventDefault();
      navigateToView(view);
    });
  });

  elements.connectBtn.addEventListener("click", async () => {
    const next = normalizeApiBaseInput(elements.apiBaseInput.value);
    if (!next) return;
    apiBase = next;
    localStorage.setItem(API_BASE_KEY, apiBase);
    elements.apiBaseInput.value = apiBase;
    await loadState();
    addLog(`Connected to ${apiBase}`);
    renderLogs();
  });

  elements.seedBtn.addEventListener("click", async () => {
    try {
      await resetServerData();
    } catch (error) {
      setSyncStatus(`Reset failed: ${error.message}`, "bad");
    }
  });

  elements.exportBtn.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `frezo-studio-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    addLog("State exported as JSON");
    renderLogs();
  });

  elements.productForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const category = elements.productCategory.value.trim();

    const product = {
      id: `P${Date.now().toString().slice(-8)}`,
      name: elements.productName.value.trim(),
      category,
      qty: elements.productQty.value.trim(),
      price: Number(elements.productPrice.value),
      mrp: Number(elements.productMrp.value),
      stock: Number(elements.productStock.value),
      rating: elements.productRating.value.trim() || "4.5",
      tags: toTags(elements.productTags.value),
      imageUrl: elements.productImage.value.trim(),
      imageFit: elements.productImageFit.value === "contain" ? "contain" : "cover",
      imageScale: Math.max(0.5, Math.min(2, Number(elements.productImageScale.value) || 1)),
      color: elements.productColor.value.trim() || "#e9eef8",
      status: elements.productStatus.value
    };

    if (!product.tags.length) {
      product.tags = ["all"];
    }

    state.products.unshift(product);
    ensureCategory(category);

    elements.productForm.reset();
    elements.productStatus.value = "ACTIVE";
    elements.productRating.value = "4.5";
    elements.productColor.value = "#e9eef8";
    elements.productImageFit.value = "cover";
    elements.productImageScale.value = "1";

    await commit(`Product added: ${product.name}`);
  });

  elements.imageResizerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const source = elements.resizeSource.value.trim();
    const width = Math.max(50, Number(elements.resizeWidth.value) || 400);
    const height = Math.max(50, Number(elements.resizeHeight.value) || 400);
    const fit = elements.resizeFit.value === "contain" ? "contain" : "cover";

    if (!source) {
      return;
    }

    try {
      const url = new URL(source);
      url.searchParams.set("w", String(width));
      url.searchParams.set("h", String(height));
      url.searchParams.set("fit", fit);
      const output = url.toString();
      elements.resizeOutput.value = output;
      elements.resizePreview.src = output;
      addLog(`Image resized: ${width}x${height} (${fit})`);
      renderLogs();
    } catch {
      elements.resizeOutput.value = source;
      elements.resizePreview.src = source;
    }
  });

  elements.productSearch.addEventListener("input", renderProducts);

  elements.productsTableBody.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const product = state.products.find((item) => item.id === button.dataset.id);
    if (!product) return;

    if (button.dataset.action === "delete") {
      state.products = state.products.filter((item) => item.id !== product.id);
      state.recentlyViewedProductIds = state.recentlyViewedProductIds.filter((id) => id !== product.id);
      state.reorder = state.reorder.map((row) => ({
        ...row,
        productIds: row.productIds.filter((id) => id !== product.id)
      }));
      await commit(`Product deleted: ${product.name}`);
      return;
    }

    if (button.dataset.action === "save") {
      const row = button.closest("tr");
      if (!row) return;

      const readField = (field) => {
        const input = row.querySelector(`[data-field="${field}"]`);
        return input ? String(input.value || "").trim() : "";
      };

      const nextName = readField("name");
      const nextCategory = readField("category");
      const nextQty = readField("qty");

      if (!nextName || !nextCategory || !nextQty) {
        alert("Name, category and qty are required");
        return;
      }

      product.name = nextName;
      product.category = nextCategory;
      product.qty = nextQty;
      product.price = Math.max(1, Number(readField("price")) || product.price || 1);
      product.mrp = Math.max(1, Number(readField("mrp")) || product.mrp || 1);
      product.stock = Math.max(0, Math.floor(Number(readField("stock")) || product.stock || 0));
      product.rating = readField("rating") || product.rating || "4.5";
      product.tags = toTags(readField("tags"));
      if (!product.tags.length) {
        product.tags = ["all"];
      }
      product.imageUrl = readField("imageUrl");
      product.imageFit = readField("imageFit") === "contain" ? "contain" : "cover";
      product.imageScale = Math.max(0.5, Math.min(2, Number(readField("imageScale")) || product.imageScale || 1));
      product.color = readField("color") || product.color || "#e9eef8";
      product.status = readField("status") === "INACTIVE" ? "INACTIVE" : "ACTIVE";
      ensureCategory(product.category);

      await commit(`Product updated: ${product.name}`);
      return;
    }
  });

  elements.categoryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const category = elements.categoryName.value.trim();
    if (!category) return;

    if (!state.categories.includes(category)) {
      state.categories.unshift(category);

      state.quickCategories.unshift({
        id: `qc_${Date.now().toString().slice(-6)}`,
        name: category.slice(0, 18),
        category,
        color: "#e9eef8"
      });

      await commit(`Category added: ${category}`);
    }

    elements.categoryForm.reset();
  });

  elements.categoriesGrid.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-category-action]");
    if (!button) return;

    const category = (button.dataset.category || "").trim();
    if (!category || !state.categories.includes(category)) return;
    const action = button.dataset.categoryAction;

    if (action === "move-up" || action === "move-down") {
      const index = state.categories.findIndex((entry) => entry === category);
      if (index === -1) return;

      const targetIndex = action === "move-up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= state.categories.length) return;

      const temp = state.categories[targetIndex];
      state.categories[targetIndex] = state.categories[index];
      state.categories[index] = temp;
      await commit(`Category reordered: ${category}`);
      return;
    }

    if (action === "edit") {
      const next = prompt("Rename category", category);
      if (next === null) return;

      const nextCategory = next.trim();
      if (!nextCategory || nextCategory === category) return;

      if (state.categories.includes(nextCategory)) {
        alert("Category already exists");
        return;
      }

      state.categories = state.categories.map((entry) => (entry === category ? nextCategory : entry));
      renameCategoryReferences(category, nextCategory);
      await commit(`Category renamed: ${category} -> ${nextCategory}`);
      return;
    }

    if (action === "delete") {
      if (state.categories.length <= 1) {
        alert("At least one category is required");
        return;
      }

      const proceed = confirm(`Delete category "${category}"? Products will move to another category.`);
      if (!proceed) return;

      const fallbackCategory = state.categories.find((entry) => entry !== category) || state.categories[0];
      removeCategoryReferences(category, fallbackCategory);
      state.categories = state.categories.filter((entry) => entry !== category);
      await commit(`Category deleted: ${category}`);
    }
  });

  elements.appMetaForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    state.app.name = elements.appName.value.trim();
    state.app.subtitle = elements.appSubtitle.value.trim();
    state.app.tagline = elements.appTagline.value.trim();
    state.etaBaseMinutes = Math.max(1, Math.min(60, Number(elements.etaBase.value) || 7));

    await commit("App header updated");
  });

  elements.bannerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const banner = {
      id: `bnr_${Date.now().toString().slice(-7)}`,
      title: elements.bannerTitle.value.trim(),
      subtitle: elements.bannerSubtitle.value.trim(),
      cta: elements.bannerCta.value.trim(),
      code: elements.bannerCode.value.trim().toUpperCase(),
      bgColor: elements.bannerBg.value.trim() || "#daf6df",
      textColor: elements.bannerText.value.trim() || "#0d6a2c"
    };

    state.banners.unshift(banner);
    elements.bannerForm.reset();
    elements.bannerBg.value = "#daf6df";
    elements.bannerText.value = "#0d6a2c";

    await commit(`Banner added: ${banner.title}`);
  });

  elements.bannersTableBody.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-banner-action]");
    if (!button) return;

    const banner = state.banners.find((row) => row.id === button.dataset.id);
    if (!banner) return;

    if (button.dataset.bannerAction === "delete") {
      state.banners = state.banners.filter((row) => row.id !== banner.id);
      state.homeSections = state.homeSections.filter((section) => section.bannerId !== banner.id);
      await commit(`Banner deleted: ${banner.title}`);
      return;
    }

    if (button.dataset.bannerAction === "edit") {
      const nextTitle = prompt("Banner title", banner.title);
      const nextSubtitle = prompt("Banner subtitle", banner.subtitle);
      const nextCta = prompt("Banner CTA", banner.cta);
      const nextCode = prompt("Coupon code", banner.code || "");

      if (nextTitle !== null) banner.title = nextTitle.trim() || banner.title;
      if (nextSubtitle !== null) banner.subtitle = nextSubtitle.trim() || banner.subtitle;
      if (nextCta !== null) banner.cta = nextCta.trim() || banner.cta;
      if (nextCode !== null) banner.code = nextCode.trim().toUpperCase();

      await commit(`Banner updated: ${banner.title}`);
    }
  });

  elements.sectionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const type = elements.sectionType.value;
    const section = {
      id: `sec_${Date.now().toString().slice(-7)}`,
      type,
      layout: elements.sectionLayout.value === "VERTICAL" ? "VERTICAL" : "HORIZONTAL",
      title: elements.sectionTitle.value.trim(),
      category: elements.sectionCategory.value.trim(),
      bannerId: elements.sectionBannerId.value.trim(),
      limit: Math.max(1, Math.min(24, Number(elements.sectionLimit.value) || 6))
    };

    if (type === "PRODUCT_GRID" && !section.category) {
      alert("Category is required for PRODUCT_GRID section");
      return;
    }

    if (type === "BANNER" && !section.bannerId) {
      alert("Banner Id is required for BANNER section");
      return;
    }

    if (type === "PRODUCT_GRID") {
      ensureCategory(section.category);
      section.bannerId = "";
    }

    if (type === "BANNER") {
      section.category = "";
      section.limit = 0;
      section.layout = "HORIZONTAL";
    }

    state.homeSections.push(section);
    elements.sectionForm.reset();
    elements.sectionType.value = "PRODUCT_GRID";
    elements.sectionLayout.value = "HORIZONTAL";
    elements.sectionLimit.value = "6";

    await commit(`Home section added: ${section.type}`);
  });

  elements.sectionsTableBody.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-section-action]");
    if (!button) return;

    const index = state.homeSections.findIndex((section) => section.id === button.dataset.id);
    if (index === -1) return;

    const section = state.homeSections[index];
    const action = button.dataset.sectionAction;

    if (action === "delete") {
      state.homeSections.splice(index, 1);
      await commit(`Section deleted: ${section.id}`);
      return;
    }

    if (action === "up" && index > 0) {
      const temp = state.homeSections[index - 1];
      state.homeSections[index - 1] = state.homeSections[index];
      state.homeSections[index] = temp;
      await commit(`Section moved up: ${section.id}`);
      return;
    }

    if (action === "down" && index < state.homeSections.length - 1) {
      const temp = state.homeSections[index + 1];
      state.homeSections[index + 1] = state.homeSections[index];
      state.homeSections[index] = temp;
      await commit(`Section moved down: ${section.id}`);
      return;
    }

    if (action === "edit") {
      const nextTitle = prompt("Section title", section.title || "");
      const nextLayout = prompt("Layout (HORIZONTAL/VERTICAL)", section.layout || "HORIZONTAL");

      if (nextTitle !== null) {
        section.title = nextTitle.trim();
      }
      if (nextLayout !== null) {
        const layout = nextLayout.trim().toUpperCase();
        section.layout = layout === "VERTICAL" ? "VERTICAL" : "HORIZONTAL";
      }

      if (section.type === "PRODUCT_GRID") {
        const nextCategory = prompt("Section category", section.category || "");
        const nextLimit = prompt("Item limit", String(section.limit || 6));

        if (nextCategory !== null) {
          section.category = nextCategory.trim() || section.category;
          ensureCategory(section.category);
        }

        if (nextLimit !== null) {
          section.limit = Math.max(1, Math.min(24, Number(nextLimit) || section.limit || 6));
        }
      } else {
        const nextBannerId = prompt("Banner id", section.bannerId || "");
        if (nextBannerId !== null) {
          section.bannerId = nextBannerId.trim() || section.bannerId;
        }
        section.layout = "HORIZONTAL";
      }

      await commit(`Section updated: ${section.id}`);
    }
  });

  elements.orderFilter.addEventListener("change", renderOrders);
  elements.orderSearch.addEventListener("input", renderOrders);

  elements.ordersTableBody.addEventListener("change", async (event) => {
    const select = event.target.closest("select.status-select");
    if (!select) return;

    const order = state.orders.find((row) => row.id === select.dataset.id);
    if (!order) return;

    order.status = select.value;
    await commit(`Order ${order.id} moved to ${order.status}`);
  });

  elements.couponForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const coupon = {
      id: `C-${Date.now().toString().slice(-5)}`,
      code: elements.couponCode.value.trim().toUpperCase(),
      type: elements.couponType.value,
      value: Number(elements.couponValue.value),
      minCart: Number(elements.couponMinCart.value),
      active: true
    };

    state.coupons.unshift(coupon);
    elements.couponForm.reset();
    elements.couponType.value = "FLAT";

    await commit(`Coupon created: ${coupon.code}`);
  });

  elements.couponsTableBody.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-coupon]");
    if (!button) return;

    const coupon = state.coupons.find((row) => row.id === button.dataset.coupon);
    if (!coupon) return;

    coupon.active = !coupon.active;
    await commit(`Coupon ${coupon.code} ${coupon.active ? "enabled" : "disabled"}`);
  });

  elements.usersTableBody.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-user]");
    if (!button) return;

    const user = state.users.find((row) => row.id === button.dataset.user);
    if (!user) return;

    user.status = user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    await commit(`User ${user.name} set to ${user.status}`);
  });
}

attachEvents();
const initialView = new URLSearchParams(window.location.search).get("view") || "home";
navigateToView(initialView, { replace: true });
loadState();
