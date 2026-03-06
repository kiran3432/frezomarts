import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { studioService } from "./studio.service.js";

const productStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

const appMetaSchema = z.object({
  name: z.string().trim().min(1),
  subtitle: z.string().trim().min(1),
  tagline: z.string().trim().min(1)
});

const topFilterSchema = z.object({
  id: z.string().trim().min(1),
  label: z.string().trim().min(1),
  icon: z.string().trim().min(1)
});

const productSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  category: z.string().trim().min(1),
  qty: z.string().trim().min(1),
  price: z.coerce.number().min(0),
  mrp: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0),
  rating: z.string().trim().min(1),
  tags: z.array(z.string().trim().min(1)).default(["all"]),
  imageUrl: z.string().trim().default(""),
  imageFit: z.enum(["cover", "contain"]).default("cover"),
  imageScale: z.coerce.number().min(0.5).max(2).default(1),
  color: z.string().trim().default("#e9eef8"),
  status: productStatusSchema
});

const quickCategorySchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  category: z.string().trim().min(1),
  color: z.string().trim().default("#e9eef8")
});

const bannerSchema = z.object({
  id: z.string().trim().min(1),
  title: z.string().trim().min(1),
  subtitle: z.string().trim().min(1),
  cta: z.string().trim().min(1),
  code: z.string().trim().default(""),
  bgColor: z.string().trim().default("#daf6df"),
  textColor: z.string().trim().default("#0d6a2c")
});

const homeSectionSchema = z.object({
  id: z.string().trim().min(1),
  type: z.enum(["PRODUCT_GRID", "BANNER"]),
  layout: z.enum(["HORIZONTAL", "VERTICAL"]).default("HORIZONTAL"),
  title: z.string().trim().default(""),
  category: z.string().trim().default(""),
  bannerId: z.string().trim().default(""),
  limit: z.coerce.number().int().min(0).max(24).default(6)
});

const reorderSchema = z.object({
  id: z.string().trim().min(1),
  label: z.string().trim().min(1),
  date: z.string().trim().min(1),
  productIds: z.array(z.string().trim().min(1)).default([])
});

const invoiceSchema = z.object({
  id: z.string().trim().min(1),
  amount: z.coerce.number().min(0),
  date: z.string().trim().min(1)
});

const orderSchema = z.object({
  id: z.string().trim().min(1),
  user: z.string().trim().min(1),
  city: z.string().trim().min(1),
  amount: z.coerce.number().min(0),
  payment: z.string().trim().min(1),
  status: z.string().trim().min(1),
  createdAt: z.string().trim().min(1)
});

const couponSchema = z.object({
  id: z.string().trim().min(1),
  code: z.string().trim().min(1),
  type: z.enum(["FLAT", "PERCENT"]),
  value: z.coerce.number().min(0),
  minCart: z.coerce.number().min(0),
  active: z.boolean()
});

const userSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  email: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  city: z.string().trim().min(1),
  status: z.enum(["ACTIVE", "BLOCKED"])
});

const logSchema = z.object({
  id: z.string().trim().min(1),
  text: z.string().trim().min(1)
});

const studioConfigSchema = z.object({
  version: z.coerce.number().int().min(1).default(1),
  updatedAt: z.string().trim().optional(),
  app: appMetaSchema,
  etaBaseMinutes: z.coerce.number().int().min(1).max(60).default(7),
  categories: z.array(z.string().trim().min(1)).min(1),
  topFilters: z.array(topFilterSchema).min(1),
  products: z.array(productSchema).default([]),
  quickCategories: z.array(quickCategorySchema).default([]),
  banners: z.array(bannerSchema).default([]),
  homeSections: z.array(homeSectionSchema).default([]),
  recentlyViewedProductIds: z.array(z.string().trim().min(1)).default([]),
  reorder: z.array(reorderSchema).default([]),
  invoices: z.array(invoiceSchema).default([]),
  orders: z.array(orderSchema).default([]),
  coupons: z.array(couponSchema).default([]),
  users: z.array(userSchema).default([]),
  logs: z.array(logSchema).default([])
});

export function registerStudioRoutes(app: FastifyInstance) {
  app.get("/studio/config", async () => {
    return studioService.getConfig();
  });

  app.put("/studio/config", async (request, reply) => {
    const parsed = studioConfigSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ message: "Invalid studio config", issues: parsed.error.issues });
    }

    const updated = await studioService.replaceConfig({
      ...parsed.data,
      updatedAt: parsed.data.updatedAt || new Date().toISOString()
    });
    return reply.send(updated);
  });

  app.post("/studio/reset", async () => {
    return studioService.resetConfig();
  });
}
