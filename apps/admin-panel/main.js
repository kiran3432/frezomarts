const API_BASE_KEY = "frezo_admin_api_base_v1";
const LOCAL_STATE_KEY = "frezo_admin_local_state_v2";
const RUNTIME_CONFIG_PATH = "./runtime-config.json";
const DEFAULT_REMOTE_API_BASE = "https://api.frezomarts.com";
const DEFAULT_RENDER_API_BASE = "https://frezo-backend12.onrender.com";
const REQUEST_TIMEOUT_MS = 15000;
const COLD_START_TIMEOUT_MS = 65000;
const IMAGE_PREVIEW_FETCH_TIMEOUT_MS = 12000;
const IMAGE_ASSET_PREFIX = "asset://";
const INLINE_IMAGE_PREFIX = "data:image/";

const DEFAULT_STATE = {
  version: 1,
  updatedAt: new Date().toISOString(),
  app: {
    name: "FREZO",
    subtitle: "india's next gen grocery app",
    tagline: '"fast fresh frezo"'
  },
  etaBaseMinutes: 7,
  imageAssets: {},
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
      imageUrl: "",
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
      imageUrl: "",
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
      imageUrl: "",
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
  exportCsvBtn: document.getElementById("exportCsvBtn"),
  importCsvBtn: document.getElementById("importCsvBtn"),
  exportBtn: document.getElementById("exportBtn"),
  csvFileInput: document.getElementById("csvFileInput"),
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
  productsSelectAllHead: document.getElementById("productsSelectAllHead"),
  productsSelectAllTop: document.getElementById("productsSelectAllTop"),
  productsSelectAllBottom: document.getElementById("productsSelectAllBottom"),
  productsBulkSaveTop: document.getElementById("productsBulkSaveTop"),
  productsBulkDeleteTop: document.getElementById("productsBulkDeleteTop"),
  productsBulkSaveBottom: document.getElementById("productsBulkSaveBottom"),
  productsBulkDeleteBottom: document.getElementById("productsBulkDeleteBottom"),
  productsBulkCountTop: document.getElementById("productsBulkCountTop"),
  productsBulkCountBottom: document.getElementById("productsBulkCountBottom"),
  productsTableBody: document.getElementById("productsTableBody"),
  imageResizerForm: document.getElementById("imageResizerForm"),
  resizeSource: document.getElementById("resizeSource"),
  resizeFile: document.getElementById("resizeFile"),
  resizeWidth: document.getElementById("resizeWidth"),
  resizeHeight: document.getElementById("resizeHeight"),
  resizeFit: document.getElementById("resizeFit"),
  resizeFormat: document.getElementById("resizeFormat"),
  resizeQuality: document.getElementById("resizeQuality"),
  resizeOutput: document.getElementById("resizeOutput"),
  resizeCopyBtn: document.getElementById("resizeCopyBtn"),
  resizeUseBtn: document.getElementById("resizeUseBtn"),
  resizeDownloadBtn: document.getElementById("resizeDownloadBtn"),
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
let runtimeApiBase = "";
let draggingCategoryIndex = -1;
const selectedProductIds = new Set();
let backendSupportsImageAssets = true;
const previewImageDataUrlCache = new Map();
const previewImageDataUrlPending = new Map();

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

function normalizeProductImageUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  if (/^(\/)?assets\//i.test(url) || /^\.\/assets\//i.test(url)) {
    return "";
  }
  return url;
}

function isImageAssetRef(value) {
  return String(value || "").startsWith(IMAGE_ASSET_PREFIX);
}

function parseImageAssetId(value) {
  if (!isImageAssetRef(value)) return "";
  return String(value).slice(IMAGE_ASSET_PREFIX.length).trim();
}

function isInlineImageUrl(value) {
  return String(value || "").toLowerCase().startsWith(INLINE_IMAGE_PREFIX);
}

function normalizeImageAssetsMap(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const normalized = {};
  for (const [rawKey, rawUrl] of Object.entries(value)) {
    const key = String(rawKey || "")
      .trim()
      .replace(/[^a-zA-Z0-9_-]+/g, "");
    const url = normalizeProductImageUrl(rawUrl);
    if (!key || !url) continue;
    normalized[key] = url;
  }
  return normalized;
}

function payloadHasImageAssetsSupport(payload) {
  return Boolean(payload && typeof payload === "object" && Object.prototype.hasOwnProperty.call(payload, "imageAssets"));
}

function createImageAssetId(assetStore) {
  let attempts = 0;
  while (attempts < 10) {
    const id = `img_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    if (!assetStore[id]) return id;
    attempts += 1;
  }
  return `img_${Date.now().toString(36)}_${Math.floor(Math.random() * 100000)}`;
}

function registerImageAsset(sourceUrl, assetStore = state.imageAssets) {
  const normalized = normalizeProductImageUrl(sourceUrl);
  if (!isInlineImageUrl(normalized)) return "";

  for (const [assetId, assetValue] of Object.entries(assetStore || {})) {
    if (normalizeProductImageUrl(assetValue) === normalized) {
      return `${IMAGE_ASSET_PREFIX}${assetId}`;
    }
  }

  const id = createImageAssetId(assetStore || {});
  assetStore[id] = normalized;
  return `${IMAGE_ASSET_PREFIX}${id}`;
}

function compactImageReference(rawValue, assetStore = state.imageAssets) {
  const normalized = normalizeProductImageUrl(rawValue);
  if (!normalized) return "";

  if (isImageAssetRef(normalized)) {
    const assetId = parseImageAssetId(normalized);
    return assetId && assetStore?.[assetId] ? `${IMAGE_ASSET_PREFIX}${assetId}` : "";
  }

  if (isInlineImageUrl(normalized)) {
    return registerImageAsset(normalized, assetStore);
  }

  return normalized;
}

function resolveImageReference(rawValue, assetStore = state.imageAssets) {
  const normalized = normalizeProductImageUrl(rawValue);
  if (!normalized) return "";

  if (!isImageAssetRef(normalized)) {
    if (window.location.protocol === "https:" && normalized.startsWith("http://")) {
      return `https://${normalized.slice("http://".length)}`;
    }
    return normalized;
  }

  const assetId = parseImageAssetId(normalized);
  if (!assetId) return "";
  return normalizeProductImageUrl(assetStore?.[assetId] || "");
}

function hasRenderableImage(rawValue, assetStore = state.imageAssets) {
  return Boolean(resolveImageReference(rawValue, assetStore));
}

function pruneUnusedImageAssets(assetStore = state.imageAssets, products = state.products) {
  const inUse = new Set();
  for (const product of Array.isArray(products) ? products : []) {
    const ref = normalizeProductImageUrl(product?.imageUrl);
    if (!isImageAssetRef(ref)) continue;
    const assetId = parseImageAssetId(ref);
    if (assetId) inUse.add(assetId);
  }

  const nextAssets = {};
  for (const [assetId, source] of Object.entries(assetStore || {})) {
    if (inUse.has(assetId)) {
      nextAssets[assetId] = normalizeProductImageUrl(source);
    }
  }
  return nextAssets;
}

function hasAssetRefProducts(products) {
  return (Array.isArray(products) ? products : []).some((product) => isImageAssetRef(normalizeProductImageUrl(product?.imageUrl)));
}

function unresolvedAssetRefCount(products, assetStore) {
  const assets = normalizeImageAssetsMap(assetStore);
  return (Array.isArray(products) ? products : []).reduce((count, product) => {
    const imageUrl = normalizeProductImageUrl(product?.imageUrl);
    if (!isImageAssetRef(imageUrl)) return count;
    return resolveImageReference(imageUrl, assets) ? count : count + 1;
  }, 0);
}

function materializeProductImages(products, assetStore) {
  const assets = normalizeImageAssetsMap(assetStore);
  return (Array.isArray(products) ? products : []).map((product) => {
    const imageUrl = normalizeProductImageUrl(product?.imageUrl);
    if (!isImageAssetRef(imageUrl)) {
      return {
        ...product,
        imageUrl
      };
    }
    const resolved = resolveImageReference(imageUrl, assets);
    return {
      ...product,
      imageUrl: resolved || imageUrl
    };
  });
}

function buildSavePayload(sourceState) {
  const normalized = normalizeState(sourceState);
  normalized.updatedAt = new Date().toISOString();

  if (backendSupportsImageAssets) {
    return normalized;
  }

  return {
    ...normalized,
    products: materializeProductImages(normalized.products, normalized.imageAssets),
    imageAssets: {}
  };
}

let apiBase = normalizeApiBaseInput(localStorage.getItem(API_BASE_KEY) || defaultApiBase) || defaultApiBase;

function getCloudApiBaseCandidate() {
  const host = String(window.location.hostname || "")
    .trim()
    .toLowerCase();
  if (host === "frezomarts.com" || host.endsWith(".frezomarts.com")) {
    return DEFAULT_REMOTE_API_BASE;
  }
  return "";
}

function apiCandidates(preferred = apiBase) {
  const queryBase = normalizeApiBaseInput(new URLSearchParams(window.location.search).get("api") || "");
  return [preferred, runtimeApiBase, queryBase, getCloudApiBaseCandidate(), DEFAULT_RENDER_API_BASE, defaultApiBase]
    .map((value) => normalizeApiBaseInput(value))
    .filter((value, index, list) => value && list.indexOf(value) === index);
}

function timeoutForBase(base) {
  const safeBase = String(base || "").toLowerCase();
  if (safeBase.includes(".onrender.com") || safeBase.includes("api.frezomarts.com")) {
    return COLD_START_TIMEOUT_MS;
  }
  return REQUEST_TIMEOUT_MS;
}

async function fetchJsonWithTimeout(url, timeoutMs = REQUEST_TIMEOUT_MS, options = {}) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }
    return await response.json();
  } finally {
    window.clearTimeout(timer);
  }
}

async function loadRuntimeConfig() {
  try {
    const payload = await fetchJsonWithTimeout(RUNTIME_CONFIG_PATH, 1400, { cache: "no-store" });
    const runtimeBase = normalizeApiBaseInput(payload?.backendBase || "");
    if (!runtimeBase) return;

    runtimeApiBase = runtimeBase;
    const hasStoredBase = Boolean(localStorage.getItem(API_BASE_KEY));
    if (!hasStoredBase || normalizeApiBaseInput(apiBase) === normalizeApiBaseInput(defaultApiBase)) {
      apiBase = runtimeBase;
    }
  } catch {
    // Runtime config file is optional.
  }
}

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
  merged.imageAssets = normalizeImageAssetsMap(merged.imageAssets);
  merged.categories = Array.isArray(merged.categories) ? merged.categories : clone(DEFAULT_STATE.categories);
  merged.topFilters = Array.isArray(merged.topFilters) && merged.topFilters.length ? merged.topFilters : clone(DEFAULT_STATE.topFilters);
  merged.products = Array.isArray(merged.products)
    ? merged.products.map((product) => ({
        imageFit: "cover",
        imageScale: 1,
        ...product,
        imageUrl: compactImageReference(product?.imageUrl, merged.imageAssets),
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

  merged.imageAssets = pruneUnusedImageAssets(merged.imageAssets, merged.products);

  return merged;
}

function toTimestamp(value) {
  const time = Date.parse(String(value || "").trim());
  return Number.isFinite(time) ? time : 0;
}

function productLookupKeys(product) {
  const keys = [];
  const id = String(product?.id || "").trim();
  if (id) {
    keys.push(`id:${id}`);
  }

  const name = String(product?.name || "")
    .trim()
    .toLowerCase();
  const category = String(product?.category || "")
    .trim()
    .toLowerCase();
  const qty = String(product?.qty || "")
    .trim()
    .toLowerCase();
  if (name || category || qty) {
    keys.push(`sig:${name}|${category}|${qty}`);
  }

  return keys;
}

function countProductImageLinks(config) {
  const products = Array.isArray(config?.products) ? config.products : [];
  const assets = normalizeImageAssetsMap(config?.imageAssets);
  return products.reduce((count, product) => (hasRenderableImage(product?.imageUrl, assets) ? count + 1 : count), 0);
}

function mergeStateWithImageFallback(primaryState, fallbackState) {
  const primary = normalizeState(primaryState);
  const fallback = normalizeState(fallbackState);
  const imageAssets = {
    ...normalizeImageAssetsMap(fallback.imageAssets),
    ...normalizeImageAssetsMap(primary.imageAssets)
  };
  if (!fallback.products.length || !primary.products.length) {
    return {
      ...primary,
      imageAssets
    };
  }

  const fallbackByKey = new Map();
  for (const product of fallback.products) {
    for (const key of productLookupKeys(product)) {
      if (!fallbackByKey.has(key)) {
        fallbackByKey.set(key, product);
      }
    }
  }

  const products = primary.products.map((product) => {
    if (hasRenderableImage(product.imageUrl, imageAssets)) {
      return product;
    }

    const fallbackProduct = productLookupKeys(product)
      .map((key) => fallbackByKey.get(key))
      .find((entry) => entry && hasRenderableImage(entry.imageUrl, imageAssets));
    if (!fallbackProduct) {
      return product;
    }

    return {
      ...product,
      imageUrl: normalizeProductImageUrl(fallbackProduct.imageUrl),
      imageFit: fallbackProduct.imageFit === "contain" ? "contain" : "cover",
      imageScale:
        typeof fallbackProduct.imageScale === "number" && Number.isFinite(fallbackProduct.imageScale)
          ? Math.max(0.5, Math.min(2, fallbackProduct.imageScale))
          : 1
    };
  });

  const merged = {
    ...primary,
    imageAssets,
    products
  };

  const primaryTs = toTimestamp(primary.updatedAt);
  const fallbackTs = toTimestamp(fallback.updatedAt);
  if (fallbackTs > primaryTs) {
    merged.updatedAt = fallback.updatedAt;
  }

  merged.imageAssets = pruneUnusedImageAssets(merged.imageAssets, merged.products);
  return merged;
}

function recoveredImageCount(baseState, mergedState) {
  return Math.max(0, countProductImageLinks(mergedState) - countProductImageLinks(baseState));
}

function setSyncStatus(text, tone = "neutral") {
  elements.syncStatus.textContent = text;
  elements.syncStatus.classList.remove("ok", "warn", "bad");
  if (tone !== "neutral") {
    elements.syncStatus.classList.add(tone);
  }
}

function asApiUrl(path, baseValue = apiBase) {
  const base = String(baseValue || apiBase)
    .trim()
    .replace(/\/$/, "");
  return `${base}${path}`;
}

function buildProxyImageUrl(sourceUrl, baseValue = apiBase) {
  const normalized = normalizeProductImageUrl(sourceUrl);
  if (!/^https?:\/\//i.test(normalized)) {
    return "";
  }
  return asApiUrl(`/studio/image?url=${encodeURIComponent(normalized)}`, baseValue);
}

function buildExternalImageProxyUrl(sourceUrl) {
  const normalized = normalizeProductImageUrl(sourceUrl);
  if (!/^https?:\/\//i.test(normalized)) {
    return "";
  }
  const withoutProtocol = normalized.replace(/^https?:\/\//i, "");
  return `https://images.weserv.nl/?url=${encodeURIComponent(withoutProtocol)}`;
}

async function fetchBinaryWithTimeout(url, timeoutMs = IMAGE_PREVIEW_FETCH_TIMEOUT_MS, options = {}) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    });
  } finally {
    window.clearTimeout(timer);
  }
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to convert image blob"));
    reader.readAsDataURL(blob);
  });
}

function cachePreviewDataUrl(key, dataUrl) {
  previewImageDataUrlCache.set(key, dataUrl);
  while (previewImageDataUrlCache.size > 200) {
    const firstKey = previewImageDataUrlCache.keys().next().value;
    if (!firstKey) break;
    previewImageDataUrlCache.delete(firstKey);
  }
}

async function resolvePreviewImageDataUrl(sourceUrl, baseValue = apiBase) {
  const normalized = normalizeProductImageUrl(sourceUrl);
  if (!normalized) return "";
  if (isInlineImageUrl(normalized)) return normalized;
  if (!/^https?:\/\//i.test(normalized)) return "";

  const cacheKey = `${baseValue || ""}|${normalized}`;
  if (previewImageDataUrlCache.has(cacheKey)) {
    return previewImageDataUrlCache.get(cacheKey) || "";
  }
  if (previewImageDataUrlPending.has(cacheKey)) {
    return previewImageDataUrlPending.get(cacheKey);
  }

  const loadPromise = (async () => {
    const candidates = [normalized, buildProxyImageUrl(normalized, baseValue), buildExternalImageProxyUrl(normalized)].filter(Boolean);

    for (const candidate of candidates) {
      try {
        const response = await fetchBinaryWithTimeout(candidate, IMAGE_PREVIEW_FETCH_TIMEOUT_MS, {
          cache: "no-store",
          mode: "cors"
        });
        if (!response.ok) continue;

        const type = String(response.headers.get("content-type") || "").toLowerCase();
        if (type && !type.startsWith("image/")) continue;

        const blob = await response.blob();
        if (!blob || blob.size <= 0) continue;

        const dataUrl = await blobToDataUrl(blob);
        if (!isInlineImageUrl(dataUrl)) continue;

        cachePreviewDataUrl(cacheKey, dataUrl);
        return dataUrl;
      } catch {
        // Try next candidate.
      }
    }

    return "";
  })();

  previewImageDataUrlPending.set(cacheKey, loadPromise);
  try {
    return await loadPromise;
  } finally {
    previewImageDataUrlPending.delete(cacheKey);
  }
}

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeoutMs = Number(options.timeoutMs) > 0 ? Number(options.timeoutMs) : REQUEST_TIMEOUT_MS;
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  let response = null;
  try {
    response = await fetch(asApiUrl(path, options.base), {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error(`Fetch timed out after ${Math.ceil(timeoutMs / 1000)}s`);
    }
    throw new Error(error?.message || "Network request failed");
  } finally {
    window.clearTimeout(timer);
  }

  let payload = null;
  if (response) {
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
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

function csvEscape(value) {
  const raw = String(value ?? "");
  if (!/[",\n\r]/.test(raw)) return raw;
  return `"${raw.replace(/"/g, '""')}"`;
}

function downloadTextFile(filename, text, contentType = "text/plain;charset=utf-8") {
  const blob = new Blob([text], { type: contentType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function productsToCsv(rows) {
  const headers = [
    "id",
    "name",
    "category",
    "qty",
    "price",
    "mrp",
    "stock",
    "rating",
    "tags",
    "imageUrl",
    "imageFit",
    "imageScale",
    "color",
    "status"
  ];
  const lines = [headers.join(",")];

  for (const row of rows) {
    const values = [
      row.id,
      row.name,
      row.category,
      row.qty,
      Number(row.price ?? 0),
      Number(row.mrp ?? 0),
      Number(row.stock ?? 0),
      row.rating,
      Array.isArray(row.tags) ? row.tags.join("|") : "",
      row.imageUrl || "",
      row.imageFit || "cover",
      Number(row.imageScale ?? 1),
      row.color || "#e9eef8",
      row.status || "ACTIVE"
    ];
    lines.push(values.map(csvEscape).join(","));
  }

  return lines.join("\n");
}

function parseCsv(text) {
  const rows = [];
  let current = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      current.push(field);
      field = "";
      continue;
    }

    if (char === "\n" || char === "\r") {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      current.push(field);
      field = "";
      if (current.some((cell) => String(cell).trim().length)) {
        rows.push(current);
      }
      current = [];
      continue;
    }

    field += char;
  }

  if (field.length || current.length) {
    current.push(field);
    if (current.some((cell) => String(cell).trim().length)) {
      rows.push(current);
    }
  }

  return rows;
}

function normalizeHeader(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

function buildProductFromCsvRow(row, headerMap) {
  const read = (name) => {
    const index = headerMap.get(normalizeHeader(name));
    return typeof index === "number" ? String(row[index] || "").trim() : "";
  };
  const readNumber = (name, fallback = 0) => {
    const raw = Number(read(name));
    return Number.isFinite(raw) ? raw : fallback;
  };

  const name = read("name");
  const category = read("category");
  const qty = read("qty");
  if (!name || !category || !qty) return null;

  const id = read("id") || `P${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 100)}`;
  const tagsRaw = read("tags");
  const tags = tagsRaw
    ? tagsRaw
        .split(/[|,]/)
        .map((entry) => entry.trim().toLowerCase())
        .filter(Boolean)
    : ["all"];

  return {
    id,
    name,
    category,
    qty,
    price: Math.max(1, readNumber("price", 1)),
    mrp: Math.max(1, readNumber("mrp", readNumber("price", 1))),
    stock: Math.max(0, Math.floor(readNumber("stock", 0))),
    rating: read("rating") || "4.5",
    tags: tags.length ? tags : ["all"],
    imageUrl: compactImageReference(read("imageUrl")),
    imageFit: read("imageFit") === "contain" ? "contain" : "cover",
    imageScale: Math.max(0.5, Math.min(2, readNumber("imageScale", 1))),
    color: read("color") || "#e9eef8",
    status: read("status") === "INACTIVE" ? "INACTIVE" : "ACTIVE"
  };
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read selected file"));
    reader.readAsDataURL(file);
  });
}

function loadImageFromDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load image"));
    image.src = dataUrl;
  });
}

async function resolveImageSourceDataUrl(sourceUrl, file) {
  if (file) {
    return fileToDataUrl(file);
  }
  if (!sourceUrl) {
    throw new Error("Provide a source URL or upload an image file");
  }

  try {
    const response = await fetch(sourceUrl, { mode: "cors" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const blob = await response.blob();
    return fileToDataUrl(new File([blob], "source-image", { type: blob.type || "image/png" }));
  } catch {
    const proxyCandidates = [buildProxyImageUrl(sourceUrl), buildExternalImageProxyUrl(sourceUrl)].filter(Boolean);
    for (const proxyUrl of proxyCandidates) {
      try {
        const response = await fetch(proxyUrl, { cache: "no-store" });
        if (!response.ok) {
          continue;
        }
        const blob = await response.blob();
        return fileToDataUrl(new File([blob], "source-image", { type: blob.type || "image/png" }));
      } catch {
        // Try next proxy candidate.
      }
    }
    throw new Error("Could not fetch URL image. Upload file instead or use a direct image URL.");
  }
}

async function resizeImageToDataUrl({ sourceUrl, file, width, height, fit, mimeType, quality }) {
  const sourceDataUrl = await resolveImageSourceDataUrl(sourceUrl, file);
  const image = await loadImageFromDataUrl(sourceDataUrl);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context unavailable");
  }

  ctx.clearRect(0, 0, width, height);

  const scale =
    fit === "contain"
      ? Math.min(width / image.width, height / image.height)
      : Math.max(width / image.width, height / image.height);

  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const dx = (width - drawWidth) / 2;
  const dy = (height - drawHeight) / 2;

  ctx.drawImage(image, dx, dy, drawWidth, drawHeight);
  return canvas.toDataURL(mimeType, quality);
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

  const candidates = apiCandidates(apiBase);
  const localDraft = loadLocalState();

  let lastError = null;
  for (const candidate of candidates) {
    try {
      apiBase = candidate;
      const data = await request("/studio/config", { base: candidate, timeoutMs: timeoutForBase(candidate) });
      backendSupportsImageAssets = payloadHasImageAssetsSupport(data);
      const remoteState = normalizeState(data);
      if (!backendSupportsImageAssets && hasAssetRefProducts(remoteState.products)) {
        const fallbackAssets = localDraft?.imageAssets || {};
        const rebuiltProducts = materializeProductImages(remoteState.products, fallbackAssets);
        remoteState.products = rebuiltProducts;
        remoteState.imageAssets = {};
      }
      const mergedState = localDraft ? mergeStateWithImageFallback(remoteState, localDraft) : remoteState;
      const recovered = recoveredImageCount(remoteState, mergedState);

      state = mergedState;
      persistLocalState();
      localStorage.setItem(API_BASE_KEY, apiBase);
      elements.apiBaseInput.value = apiBase;

      const unresolvedAssets = unresolvedAssetRefCount(state.products, state.imageAssets);
      if (!backendSupportsImageAssets) {
        if (recovered > 0) {
          setSyncStatus(
            `Connected: ${apiBase}. Legacy backend mode enabled. Recovered ${recovered} product image link(s).`,
            "warn"
          );
        } else if (unresolvedAssets > 0) {
          setSyncStatus(
            `Connected: ${apiBase}. Legacy backend mode. ${unresolvedAssets} image link(s) need re-upload.`,
            "warn"
          );
        } else {
          setSyncStatus(`Connected: ${apiBase}. Legacy backend mode (image assets compatibility active).`, "warn");
        }
        renderAll();
        return;
      }

      if (recovered > 0) {
        setSyncStatus(`Connected: ${apiBase}. Recovered ${recovered} product image link(s) from local draft.`, "warn");
        try {
          const healed = await request("/studio/config", {
            method: "PUT",
            body: state,
            base: candidate,
            timeoutMs: timeoutForBase(candidate)
          });
          state = mergeStateWithImageFallback(normalizeState(healed), state);
          persistLocalState();
          setSyncStatus(`Connected: ${apiBase}. Recovered image links were synced back to backend.`, "ok");
        } catch (healError) {
          setSyncStatus(
            `Connected: ${apiBase}. Recovered images locally (sync back failed: ${healError?.message || "unknown"}).`,
            "warn"
          );
        }
      } else {
        setSyncStatus(`Connected: ${apiBase}`, "ok");
      }
      renderAll();
      return;
    } catch (error) {
      lastError = error;
    }
  }

  {
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
  state.imageAssets = pruneUnusedImageAssets(state.imageAssets, state.products);
  const snapshotBeforeSave = normalizeState(state);
  const payload = buildSavePayload(state);
  state.updatedAt = payload.updatedAt;

  const candidates = apiCandidates(apiBase);

  let saved = false;
  let lastError = null;

  for (const candidate of candidates) {
    try {
      apiBase = candidate;
      const updated = await request("/studio/config", {
        method: "PUT",
        body: payload,
        base: candidate,
        timeoutMs: timeoutForBase(candidate)
      });
      backendSupportsImageAssets = payloadHasImageAssetsSupport(updated);
      const normalizedServerState = normalizeState(updated);
      state = mergeStateWithImageFallback(normalizedServerState, snapshotBeforeSave);
      const recovered = recoveredImageCount(normalizedServerState, state);
      persistLocalState();
      localStorage.setItem(API_BASE_KEY, apiBase);
      elements.apiBaseInput.value = apiBase;
      if (!backendSupportsImageAssets) {
        setSyncStatus(
          `Saved to ${apiBase} at ${new Date().toLocaleTimeString()} (legacy backend mode: stored full image URLs)`,
          "warn"
        );
      } else if (recovered > 0) {
        setSyncStatus(
          `Saved to ${apiBase} at ${new Date().toLocaleTimeString()} (protected ${recovered} image link(s))`,
          "warn"
        );
      } else {
        setSyncStatus(`Saved to ${apiBase} at ${new Date().toLocaleTimeString()}`, "ok");
      }
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
  const candidates = apiCandidates(apiBase);
  let lastError = null;

  for (const candidate of candidates) {
    try {
      apiBase = candidate;
      const updated = await request("/studio/reset", {
        method: "POST",
        base: candidate,
        timeoutMs: timeoutForBase(candidate)
      });
      backendSupportsImageAssets = payloadHasImageAssetsSupport(updated);
      state = normalizeState(updated);
      localStorage.setItem(API_BASE_KEY, apiBase);
      elements.apiBaseInput.value = apiBase;
      addLog("Studio data reset from backend defaults");
      setSyncStatus("Reset complete", "ok");
      renderAll();
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Reset failed");
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
    const compactImageUrl = compactImageReference(product.imageUrl);
    product.imageUrl = compactImageUrl;
    const safeImageUrl = escapeHtml(compactImageUrl || "");
    const safeColor = escapeHtml(product.color || "#e9eef8");
    const safeRating = escapeHtml(product.rating || "4.5");
    const resolvedImageUrl = resolveImageReference(product.imageUrl);
    const proxyImageUrl = buildProxyImageUrl(resolvedImageUrl);
    const externalProxyImageUrl = buildExternalImageProxyUrl(resolvedImageUrl);
    const safeResolvedImageUrl = escapeHtml(resolvedImageUrl || "");
    const safeProxyImageUrl = escapeHtml(proxyImageUrl || "");
    const safeExternalProxyImageUrl = escapeHtml(externalProxyImageUrl || "");

    const image = resolvedImageUrl
      ? `
        <div class="thumb-wrap">
          <img class="thumb product-preview-image" src="${safeResolvedImageUrl}" data-proxy="${safeProxyImageUrl}" data-proxy2="${safeExternalProxyImageUrl}" alt="${safeName}" loading="lazy" referrerpolicy="no-referrer" onerror="if(!this.dataset.retry&&this.dataset.proxy){this.dataset.retry='1';this.src=this.dataset.proxy;return;}if(!this.dataset.retry2&&this.dataset.proxy2){this.dataset.retry2='1';this.src=this.dataset.proxy2;return;}this.style.display='none';this.nextElementSibling.style.display='grid';" />
          <div class="thumb placeholder thumb-fallback product-preview-fallback" style="background:${safeColor}">${safeQty || "--"}</div>
        </div>
      `
      : `
        <div class="thumb-wrap">
          <img class="thumb product-preview-image" src="" data-proxy="" data-proxy2="" alt="${safeName}" loading="lazy" referrerpolicy="no-referrer" style="display:none" />
          <div class="thumb placeholder thumb-fallback product-preview-fallback" style="display:grid;background:${safeColor}">${safeQty || "--"}</div>
        </div>
      `;

    const tr = document.createElement("tr");
    tr.dataset.productId = product.id;
    tr.innerHTML = `
      <td><input class="row-selector" type="checkbox" data-product-select="${product.id}" ${selectedProductIds.has(product.id) ? "checked" : ""} /></td>
      <td>${image}</td>
      <td><input class="table-input" data-field="name" value="${safeName}" /></td>
      <td><input class="table-input" data-field="category" value="${safeCategory}" /></td>
      <td><input class="table-input short" data-field="qty" value="${safeQty}" /></td>
      <td><input class="table-input short" data-field="price" type="number" min="1" value="${Number(product.price || 1)}" /></td>
      <td><input class="table-input short" data-field="mrp" type="number" min="1" value="${Number(product.mrp || 1)}" /></td>
      <td><input class="table-input short" data-field="stock" type="number" min="0" value="${Number(product.stock || 0)}" /></td>
      <td><input class="table-input short" data-field="rating" value="${safeRating}" /></td>
      <td><input class="table-input medium" data-field="tags" value="${safeTags}" /></td>
      <td><input class="table-input wide" data-field="imageUrl" value="${safeImageUrl}" placeholder="https://... or asset://img_xxx" /></td>
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
    `;
    elements.productsTableBody.append(tr);
    refreshProductRowPreview(tr);
  }

  const validProductIds = new Set(state.products.map((product) => product.id));
  for (const selectedId of [...selectedProductIds]) {
    if (!validProductIds.has(selectedId)) {
      selectedProductIds.delete(selectedId);
    }
  }
  syncProductSelectionUi();
}

function getVisibleProductRows() {
  return Array.from(elements.productsTableBody.querySelectorAll("tr[data-product-id]"));
}

function getSelectedProductRows() {
  return getVisibleProductRows().filter((row) => {
    const productId = String(row.dataset.productId || "").trim();
    return productId && selectedProductIds.has(productId);
  });
}

function syncProductSelectionUi() {
  const selectedCount = selectedProductIds.size;
  const summary = `${selectedCount} selected`;
  if (elements.productsBulkCountTop) elements.productsBulkCountTop.textContent = summary;
  if (elements.productsBulkCountBottom) elements.productsBulkCountBottom.textContent = summary;

  const visibleRows = getVisibleProductRows();
  let selectedVisible = 0;
  for (const row of visibleRows) {
    const productId = String(row.dataset.productId || "").trim();
    const checkbox = row.querySelector("input[data-product-select]");
    if (!checkbox) continue;
    const isSelected = Boolean(productId && selectedProductIds.has(productId));
    checkbox.checked = isSelected;
    if (isSelected) selectedVisible += 1;
  }

  const allVisibleSelected = visibleRows.length > 0 && selectedVisible === visibleRows.length;
  const hasPartialVisible = selectedVisible > 0 && selectedVisible < visibleRows.length;
  for (const checkbox of [elements.productsSelectAllHead, elements.productsSelectAllTop, elements.productsSelectAllBottom].filter(Boolean)) {
    checkbox.checked = allVisibleSelected;
    checkbox.indeterminate = hasPartialVisible;
  }

  const disableBulk = selectedCount === 0;
  for (const button of [
    elements.productsBulkSaveTop,
    elements.productsBulkSaveBottom,
    elements.productsBulkDeleteTop,
    elements.productsBulkDeleteBottom
  ].filter(Boolean)) {
    button.disabled = disableBulk;
  }
}

function setVisibleRowsSelection(checked) {
  for (const row of getVisibleProductRows()) {
    const productId = String(row.dataset.productId || "").trim();
    if (!productId) continue;
    if (checked) {
      selectedProductIds.add(productId);
    } else {
      selectedProductIds.delete(productId);
    }
  }
  syncProductSelectionUi();
}

function readProductRowField(row, field) {
  const input = row.querySelector(`[data-field="${field}"]`);
  return input ? String(input.value || "").trim() : "";
}

function refreshProductRowPreview(row) {
  if (!row) return;

  const imageInputValue = readProductRowField(row, "imageUrl");
  const qty = readProductRowField(row, "qty") || "--";
  const color = readProductRowField(row, "color") || "#e9eef8";

  const compactRef = compactImageReference(imageInputValue);
  const resolvedImageUrl = resolveImageReference(compactRef);
  const proxyImageUrl = buildProxyImageUrl(resolvedImageUrl);
  const externalProxyImageUrl = buildExternalImageProxyUrl(resolvedImageUrl);

  const imageEl = row.querySelector(".product-preview-image");
  const fallbackEl = row.querySelector(".product-preview-fallback");

  if (fallbackEl) {
    fallbackEl.textContent = qty;
    fallbackEl.style.background = color;
  }

  if (!imageEl) return;

  if (!resolvedImageUrl) {
    imageEl.style.display = "none";
    imageEl.src = "";
    imageEl.dataset.proxy = "";
    imageEl.dataset.proxy2 = "";
    if (fallbackEl) {
      fallbackEl.style.display = "grid";
    }
    return;
  }

  imageEl.dataset.retry = "";
  imageEl.dataset.retry2 = "";
  imageEl.dataset.proxy = proxyImageUrl || "";
  imageEl.dataset.proxy2 = externalProxyImageUrl || "";
  imageEl.style.display = "block";
  imageEl.src = resolvedImageUrl;
  const previewToken = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  imageEl.dataset.previewToken = previewToken;
  if (fallbackEl) {
    fallbackEl.style.display = "none";
  }

  void resolvePreviewImageDataUrl(resolvedImageUrl, apiBase)
    .then((dataUrl) => {
      if (!dataUrl) return;
      if (imageEl.dataset.previewToken !== previewToken) return;
      imageEl.dataset.retry = "";
      imageEl.dataset.retry2 = "";
      imageEl.src = dataUrl;
      imageEl.style.display = "block";
      if (fallbackEl) fallbackEl.style.display = "none";
    })
    .catch(() => {});
}

function applyProductRowDraft(product, row) {
  const nextName = readProductRowField(row, "name");
  const nextCategory = readProductRowField(row, "category");
  const nextQty = readProductRowField(row, "qty");

  if (!nextName || !nextCategory || !nextQty) {
    throw new Error("Name, category and qty are required");
  }

  product.name = nextName;
  product.category = nextCategory;
  product.qty = nextQty;
  product.price = Math.max(1, Number(readProductRowField(row, "price")) || product.price || 1);
  product.mrp = Math.max(1, Number(readProductRowField(row, "mrp")) || product.mrp || 1);
  product.stock = Math.max(0, Math.floor(Number(readProductRowField(row, "stock")) || product.stock || 0));
  product.rating = readProductRowField(row, "rating") || product.rating || "4.5";
  product.tags = toTags(readProductRowField(row, "tags"));
  if (!product.tags.length) {
    product.tags = ["all"];
  }
  product.imageUrl = compactImageReference(readProductRowField(row, "imageUrl"));
  product.imageFit = readProductRowField(row, "imageFit") === "contain" ? "contain" : "cover";
  product.imageScale = Math.max(
    0.5,
    Math.min(2, Number(readProductRowField(row, "imageScale")) || product.imageScale || 1)
  );
  product.color = readProductRowField(row, "color") || product.color || "#e9eef8";
  product.status = readProductRowField(row, "status") === "INACTIVE" ? "INACTIVE" : "ACTIVE";
  ensureCategory(product.category);
}

async function saveSelectedProducts() {
  const selectedRows = getSelectedProductRows();
  if (!selectedRows.length) {
    alert("Select at least one visible product row.");
    return;
  }

  let updated = 0;
  const failures = [];

  for (const row of selectedRows) {
    const productId = String(row.dataset.productId || "").trim();
    const product = state.products.find((item) => item.id === productId);
    if (!product) {
      failures.push(`Missing product: ${productId}`);
      continue;
    }

    try {
      applyProductRowDraft(product, row);
      updated += 1;
    } catch (error) {
      failures.push(`${product.name}: ${error.message}`);
    }
  }

  if (failures.length) {
    alert(`Some rows were not saved:\n${failures.slice(0, 5).join("\n")}`);
  }
  if (!updated) return;

  await commit(`Products updated (bulk): ${updated}`);
}

async function deleteSelectedProducts() {
  const selectedIds = [...selectedProductIds].filter((id) => state.products.some((product) => product.id === id));
  if (!selectedIds.length) {
    alert("Select at least one product to delete.");
    return;
  }

  const proceed = confirm(`Delete ${selectedIds.length} selected product(s)?`);
  if (!proceed) return;

  const selectedSet = new Set(selectedIds);
  state.products = state.products.filter((item) => !selectedSet.has(item.id));
  state.recentlyViewedProductIds = state.recentlyViewedProductIds.filter((id) => !selectedSet.has(id));
  state.reorder = state.reorder.map((row) => ({
    ...row,
    productIds: row.productIds.filter((id) => !selectedSet.has(id))
  }));
  selectedProductIds.clear();
  state.imageAssets = pruneUnusedImageAssets(state.imageAssets, state.products);

  await commit(`Products deleted (bulk): ${selectedIds.length}`);
}

function renderCategories() {
  elements.categoriesGrid.innerHTML = "";
  state.categories.forEach((category, index) => {
    const count = state.products.filter((product) => product.category === category).length;
    const card = document.createElement("article");
    card.className = "chip-card";
    card.setAttribute("draggable", "true");
    card.dataset.categoryIndex = String(index);
    card.dataset.categoryName = category;
    card.innerHTML = `
      <div class="chip-card-main">
        <h4>${escapeHtml(category)}</h4>
        <p>${count} products</p>
      </div>
      <div class="chip-card-actions">
        <span class="drag-label">Drag</span>
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

  elements.exportCsvBtn.addEventListener("click", () => {
    const csv = productsToCsv(state.products);
    downloadTextFile(`frezo-products-${Date.now()}.csv`, csv, "text/csv;charset=utf-8");
    addLog("Products exported as CSV");
    renderLogs();
  });

  elements.importCsvBtn.addEventListener("click", () => {
    elements.csvFileInput.value = "";
    elements.csvFileInput.click();
  });

  elements.csvFileInput.addEventListener("change", async () => {
    const file = elements.csvFileInput.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const rows = parseCsv(content);
      if (rows.length < 2) {
        alert("CSV is empty or invalid");
        return;
      }

      const headerMap = new Map(rows[0].map((header, index) => [normalizeHeader(header), index]));
      const requiredHeaders = ["name", "category", "qty"];
      const missingRequired = requiredHeaders.filter((key) => !headerMap.has(key));
      if (missingRequired.length) {
        alert(`Missing required CSV columns: ${missingRequired.join(", ")}`);
        return;
      }

      const existingById = new Map(state.products.map((row) => [row.id, row]));
      let added = 0;
      let updated = 0;
      let skipped = 0;

      for (const row of rows.slice(1)) {
        const nextProduct = buildProductFromCsvRow(row, headerMap);
        if (!nextProduct) {
          skipped += 1;
          continue;
        }

        ensureCategory(nextProduct.category);
        const existing = existingById.get(nextProduct.id);
        if (existing) {
          Object.assign(existing, nextProduct);
          updated += 1;
          continue;
        }

        state.products.push(nextProduct);
        existingById.set(nextProduct.id, nextProduct);
        added += 1;
      }

      await commit(`CSV imported: ${added} added, ${updated} updated, ${skipped} skipped`);
    } catch (error) {
      alert(`CSV import failed: ${error.message}`);
    } finally {
      elements.csvFileInput.value = "";
    }
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
      imageUrl: compactImageReference(elements.productImage.value.trim()),
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

  elements.imageResizerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const source = elements.resizeSource.value.trim();
    const file = elements.resizeFile.files?.[0] || null;
    const width = Math.max(50, Number(elements.resizeWidth.value) || 400);
    const height = Math.max(50, Number(elements.resizeHeight.value) || 400);
    const fit = elements.resizeFit.value === "contain" ? "contain" : "cover";
    const mimeType = String(elements.resizeFormat.value || "image/webp");
    const quality = Math.max(0.1, Math.min(1, Number(elements.resizeQuality.value) || 0.9));

    try {
      const output = await resizeImageToDataUrl({
        sourceUrl: source,
        file,
        width,
        height,
        fit,
        mimeType,
        quality
      });
      const extension = mimeType === "image/png" ? "png" : mimeType === "image/jpeg" ? "jpg" : "webp";
      const compactRef = compactImageReference(output) || output;
      elements.resizeOutput.value = compactRef;
      elements.resizePreview.src = output;
      elements.resizeDownloadBtn.href = output;
      elements.resizeDownloadBtn.download = `frezo-product-${width}x${height}.${extension}`;
      persistLocalState();
      addLog(`Image resized: ${width}x${height} (${fit}, ${extension}) -> ${compactRef.slice(0, 28)}...`);
      renderLogs();
    } catch (error) {
      alert(error.message);
    }
  });

  elements.resizeCopyBtn.addEventListener("click", async () => {
    const value = elements.resizeOutput.value.trim();
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      addLog("Resized image URL copied");
      renderLogs();
    } catch {
      elements.resizeOutput.select();
      document.execCommand("copy");
    }
  });

  elements.resizeUseBtn.addEventListener("click", () => {
    const value = elements.resizeOutput.value.trim();
    if (!value) return;
    elements.productImage.value = value;
    addLog("Resized image inserted into product form");
    renderLogs();
  });

  elements.productSearch.addEventListener("input", () => {
    renderProducts();
  });

  elements.productsTableBody.addEventListener("change", (event) => {
    const checkbox = event.target.closest("input[data-product-select]");
    if (checkbox) {
      const productId = String(checkbox.dataset.productSelect || "").trim();
      if (!productId) return;

      if (checkbox.checked) {
        selectedProductIds.add(productId);
      } else {
        selectedProductIds.delete(productId);
      }
      syncProductSelectionUi();
      return;
    }

    const row = event.target.closest("tr[data-product-id]");
    if (!row) return;
    const productId = String(row.dataset.productId || "").trim();
    if (productId) {
      selectedProductIds.add(productId);
      syncProductSelectionUi();
    }
    refreshProductRowPreview(row);
  });

  elements.productsTableBody.addEventListener("input", (event) => {
    const field = event.target.closest("[data-field]");
    if (!field) return;
    const row = event.target.closest("tr[data-product-id]");
    if (!row) return;

    const productId = String(row.dataset.productId || "").trim();
    if (productId) {
      selectedProductIds.add(productId);
      syncProductSelectionUi();
    }

    const name = String(field.dataset.field || "");
    if (name === "imageUrl" || name === "qty" || name === "color") {
      refreshProductRowPreview(row);
    }
  });

  for (const checkbox of [elements.productsSelectAllHead, elements.productsSelectAllTop, elements.productsSelectAllBottom].filter(Boolean)) {
    checkbox.addEventListener("change", () => {
      setVisibleRowsSelection(checkbox.checked);
    });
  }

  for (const button of [
    elements.productsBulkSaveTop,
    elements.productsBulkSaveBottom,
    elements.productsBulkDeleteTop,
    elements.productsBulkDeleteBottom
  ].filter(Boolean)) {
    button.addEventListener("click", async () => {
      if (button.dataset.bulkProductAction === "save") {
        await saveSelectedProducts();
        return;
      }
      if (button.dataset.bulkProductAction === "delete") {
        await deleteSelectedProducts();
      }
    });
  }

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

  elements.categoriesGrid.addEventListener("dragstart", (event) => {
    const card = event.target.closest(".chip-card");
    if (!card) return;
    draggingCategoryIndex = Number(card.dataset.categoryIndex);
    card.classList.add("dragging");
  });

  elements.categoriesGrid.addEventListener("dragover", (event) => {
    event.preventDefault();
    const card = event.target.closest(".chip-card");
    if (!card) return;
    card.classList.add("drop-target");
  });

  elements.categoriesGrid.addEventListener("dragleave", (event) => {
    const card = event.target.closest(".chip-card");
    if (!card) return;
    card.classList.remove("drop-target");
  });

  elements.categoriesGrid.addEventListener("dragend", () => {
    draggingCategoryIndex = -1;
    elements.categoriesGrid.querySelectorAll(".chip-card").forEach((card) => {
      card.classList.remove("dragging");
      card.classList.remove("drop-target");
    });
  });

  elements.categoriesGrid.addEventListener("drop", async (event) => {
    event.preventDefault();
    const targetCard = event.target.closest(".chip-card");
    if (!targetCard) return;
    const targetIndex = Number(targetCard.dataset.categoryIndex);
    targetCard.classList.remove("drop-target");

    if (!Number.isInteger(draggingCategoryIndex) || draggingCategoryIndex < 0) return;
    if (!Number.isInteger(targetIndex) || targetIndex < 0) return;
    if (draggingCategoryIndex === targetIndex) return;

    const next = [...state.categories];
    const [moved] = next.splice(draggingCategoryIndex, 1);
    next.splice(targetIndex, 0, moved);
    state.categories = next;

    await commit(`Category reordered: ${moved}`);
    draggingCategoryIndex = -1;
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

async function bootstrap() {
  await loadRuntimeConfig();
  attachEvents();
  const initialView = new URLSearchParams(window.location.search).get("view") || "home";
  navigateToView(initialView, { replace: true });
  await loadState();
}

void bootstrap();
