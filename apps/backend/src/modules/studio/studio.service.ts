import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDefaultStudioConfig } from "./studio.defaults.js";
import type { StudioConfig } from "./studio.types.js";

const DATA_FILE = fileURLToPath(new URL("../../../data/studio-config.json", import.meta.url));

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function normalizeConfig(input: unknown): StudioConfig {
  const fallback = buildDefaultStudioConfig();
  if (!input || typeof input !== "object") {
    return fallback;
  }

  const partial = input as Partial<StudioConfig>;
  const normalizedProducts: StudioConfig["products"] = Array.isArray(partial.products)
    ? partial.products.map((product, index) => ({
        ...fallback.products[Math.min(index, fallback.products.length - 1)],
        ...product,
        imageFit: product?.imageFit === "contain" ? "contain" : "cover",
        imageScale:
          typeof product?.imageScale === "number" && Number.isFinite(product.imageScale)
            ? Math.max(0.5, Math.min(2, product.imageScale))
            : 1
      }))
    : fallback.products;
  const normalizedSections: StudioConfig["homeSections"] = Array.isArray(partial.homeSections)
    ? partial.homeSections.map((section) => {
        const layout = section?.layout === "VERTICAL" ? "VERTICAL" : "HORIZONTAL";
        return {
          ...section,
          layout
        };
      })
    : fallback.homeSections;

  const normalized: StudioConfig = {
    ...fallback,
    ...partial,
    app: {
      ...fallback.app,
      ...(partial.app || {})
    },
    categories: Array.isArray(partial.categories) && partial.categories.length ? partial.categories : fallback.categories,
    topFilters: Array.isArray(partial.topFilters) && partial.topFilters.length ? partial.topFilters : fallback.topFilters,
    products: normalizedProducts.length ? normalizedProducts : fallback.products,
    quickCategories:
      Array.isArray(partial.quickCategories) && partial.quickCategories.length
        ? partial.quickCategories
        : fallback.quickCategories,
    banners: Array.isArray(partial.banners) && partial.banners.length ? partial.banners : fallback.banners,
    homeSections: normalizedSections.length ? normalizedSections : fallback.homeSections,
    recentlyViewedProductIds:
      Array.isArray(partial.recentlyViewedProductIds) && partial.recentlyViewedProductIds.length
        ? partial.recentlyViewedProductIds
        : fallback.recentlyViewedProductIds,
    reorder: Array.isArray(partial.reorder) ? partial.reorder : fallback.reorder,
    invoices: Array.isArray(partial.invoices) ? partial.invoices : fallback.invoices,
    orders: Array.isArray(partial.orders) ? partial.orders : fallback.orders,
    coupons: Array.isArray(partial.coupons) ? partial.coupons : fallback.coupons,
    users: Array.isArray(partial.users) ? partial.users : fallback.users,
    logs: Array.isArray(partial.logs) ? partial.logs : fallback.logs,
    version: typeof partial.version === "number" ? partial.version : fallback.version,
    etaBaseMinutes:
      typeof partial.etaBaseMinutes === "number" && Number.isFinite(partial.etaBaseMinutes)
        ? partial.etaBaseMinutes
        : fallback.etaBaseMinutes,
    updatedAt:
      typeof partial.updatedAt === "string" && partial.updatedAt.trim().length
        ? partial.updatedAt
        : fallback.updatedAt
  };

  if (!normalized.categories.length) {
    normalized.categories = fallback.categories;
  }

  return normalized;
}

class StudioService {
  private cache: StudioConfig | null = null;

  private async ensureDataDir() {
    await mkdir(dirname(DATA_FILE), { recursive: true });
  }

  private async readFromDisk(): Promise<StudioConfig> {
    await this.ensureDataDir();

    try {
      const raw = await readFile(DATA_FILE, "utf8");
      const parsed = JSON.parse(raw) as unknown;
      return normalizeConfig(parsed);
    } catch {
      const fallback = buildDefaultStudioConfig();
      await this.writeToDisk(fallback);
      return fallback;
    }
  }

  private async writeToDisk(config: StudioConfig) {
    await this.ensureDataDir();
    await writeFile(DATA_FILE, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  }

  async getConfig(): Promise<StudioConfig> {
    if (!this.cache) {
      this.cache = await this.readFromDisk();
    }
    return clone(this.cache);
  }

  async replaceConfig(config: StudioConfig): Promise<StudioConfig> {
    const normalized = normalizeConfig(config);
    normalized.updatedAt = new Date().toISOString();
    normalized.version = Math.max(1, Math.floor(normalized.version || 1));

    this.cache = normalized;
    await this.writeToDisk(normalized);
    return clone(normalized);
  }

  async resetConfig(): Promise<StudioConfig> {
    const fallback = buildDefaultStudioConfig();
    fallback.updatedAt = new Date().toISOString();

    this.cache = fallback;
    await this.writeToDisk(fallback);
    return clone(fallback);
  }
}

export const studioService = new StudioService();
