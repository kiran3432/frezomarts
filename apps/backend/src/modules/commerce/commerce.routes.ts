import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { commerceService } from "./commerce.service.js";

const productQuerySchema = z.object({
  q: z.string().trim().optional(),
  category: z.string().trim().optional(),
  sort: z.enum(["popular", "price_low", "price_high", "fast_delivery"]).optional()
});

const customerParamSchema = z.object({
  customerId: z.string().trim().min(1)
});

const itemPayloadSchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.coerce.number().int().min(1).max(20).default(1)
});

const updateItemPayloadSchema = z.object({
  quantity: z.coerce.number().int().min(0).max(20)
});

const createOrderSchema = z.object({
  customerId: z.string().trim().min(1),
  addressLine: z.string().trim().min(5).max(180),
  paymentMethod: z.enum(["COD", "UPI", "CARD"]),
  tipAmount: z.coerce.number().min(0).max(250).optional(),
  instructions: z.string().trim().max(160).optional(),
  customerLocation: z
    .object({
      lat: z.number(),
      lng: z.number()
    })
    .optional()
});

const listOrdersQuerySchema = z.object({
  customerId: z.string().trim().min(1)
});

function replyCartMutationError(error: string | undefined, reply: { status: (code: number) => { send: (payload: unknown) => unknown } }) {
  if (error === "PRODUCT_NOT_FOUND") {
    return reply.status(404).send({ message: "Product not found" });
  }
  if (error === "INSUFFICIENT_STOCK") {
    return reply.status(409).send({ message: "Requested quantity exceeds available stock" });
  }
  return reply.status(400).send({ message: "Invalid quantity" });
}

export function registerCommerceRoutes(app: FastifyInstance) {
  app.get("/commerce/categories", async () => commerceService.listCategories());

  app.get("/commerce/products", async (request, reply) => {
    const parsed = productQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.status(400).send({ message: "Invalid query", issues: parsed.error.issues });
    }
    return commerceService.listProducts(parsed.data);
  });

  app.get<{ Params: { id: string } }>("/commerce/products/:id", async (request, reply) => {
    const product = commerceService.getProduct(request.params.id);
    if (!product) {
      return reply.status(404).send({ message: "Product not found" });
    }
    return product;
  });

  app.get<{ Params: { customerId: string } }>("/commerce/cart/:customerId", async (request, reply) => {
    const parsed = customerParamSchema.safeParse(request.params);
    if (!parsed.success) {
      return reply.status(400).send({ message: "Invalid customer id" });
    }
    return commerceService.getCart(parsed.data.customerId);
  });

  app.post<{ Params: { customerId: string } }>("/commerce/cart/:customerId/items", async (request, reply) => {
    const customer = customerParamSchema.safeParse(request.params);
    const payload = itemPayloadSchema.safeParse(request.body);
    if (!customer.success || !payload.success) {
      return reply.status(400).send({ message: "Invalid payload" });
    }

    const result = commerceService.setCartItem(
      customer.data.customerId,
      payload.data.productId,
      payload.data.quantity
    );
    if (!result.cart) {
      return replyCartMutationError(result.error, reply);
    }
    return reply.status(201).send(result.cart);
  });

  app.patch<{ Params: { customerId: string; productId: string } }>(
    "/commerce/cart/:customerId/items/:productId",
    async (request, reply) => {
      const customer = customerParamSchema.safeParse(request.params);
      const payload = updateItemPayloadSchema.safeParse(request.body);
      if (!customer.success || !payload.success) {
        return reply.status(400).send({ message: "Invalid payload" });
      }

      const result = commerceService.setCartItem(
        customer.data.customerId,
        request.params.productId,
        payload.data.quantity
      );
      if (!result.cart) {
        return replyCartMutationError(result.error, reply);
      }
      return result.cart;
    }
  );

  app.delete<{ Params: { customerId: string; productId: string } }>(
    "/commerce/cart/:customerId/items/:productId",
    async (request, reply) => {
      const customer = customerParamSchema.safeParse(request.params);
      if (!customer.success) {
        return reply.status(400).send({ message: "Invalid customer id" });
      }
      return commerceService.removeCartItem(customer.data.customerId, request.params.productId);
    }
  );

  app.post("/commerce/orders", async (request, reply) => {
    const parsed = createOrderSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ message: "Invalid payload", issues: parsed.error.issues });
    }
    const result = commerceService.createOrder(parsed.data);
    if (!result.order && result.error === "CART_EMPTY") {
      return reply.status(409).send({ message: "Cart is empty" });
    }
    if (!result.order) {
      return reply.status(500).send({ message: "Order could not be created" });
    }
    return reply.status(201).send(result.order);
  });

  app.get("/commerce/orders", async (request, reply) => {
    const parsed = listOrdersQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.status(400).send({ message: "Invalid query", issues: parsed.error.issues });
    }
    return commerceService.listOrders(parsed.data.customerId);
  });

  app.get<{ Params: { id: string } }>("/commerce/orders/:id", async (request, reply) => {
    const order = commerceService.getOrder(request.params.id);
    if (!order) {
      return reply.status(404).send({ message: "Order not found" });
    }
    return order;
  });

  app.post<{ Params: { id: string } }>("/commerce/orders/:id/cancel", async (request, reply) => {
    const result = commerceService.cancelOrder(request.params.id);
    if (!result.order && result.error === "ORDER_NOT_FOUND") {
      return reply.status(404).send({ message: "Order not found" });
    }
    if (!result.order && result.error === "ORDER_NOT_CANCELLABLE") {
      return reply.status(409).send({ message: "Order can no longer be cancelled" });
    }
    if (!result.order) {
      return reply.status(500).send({ message: "Order cancellation failed" });
    }
    return result.order;
  });
}
