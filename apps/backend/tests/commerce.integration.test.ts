import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app.js";
import { commerceService } from "../src/modules/commerce/commerce.service.js";

let app: FastifyInstance;

describe("Quick commerce integration", () => {
  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  beforeEach(() => {
    commerceService.resetState();
  });

  afterAll(async () => {
    await app.close();
  });

  it("serves categories and product search", async () => {
    const categoriesResp = await app.inject({ method: "GET", url: "/commerce/categories" });
    expect(categoriesResp.statusCode).toBe(200);
    const categories = categoriesResp.json();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(3);

    const productsResp = await app.inject({
      method: "GET",
      url: "/commerce/products?q=milk&sort=popular"
    });
    expect(productsResp.statusCode).toBe(200);
    const products = productsResp.json();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  it("runs cart to checkout flow and supports cancellation", async () => {
    const productsResp = await app.inject({ method: "GET", url: "/commerce/products" });
    const products = productsResp.json();
    const productId = products[0].id as string;
    const customerId = "cust_demo";

    const addItem = await app.inject({
      method: "POST",
      url: `/commerce/cart/${customerId}/items`,
      payload: { productId, quantity: 2 }
    });
    expect(addItem.statusCode).toBe(201);

    const cartResp = await app.inject({ method: "GET", url: `/commerce/cart/${customerId}` });
    expect(cartResp.statusCode).toBe(200);
    expect(cartResp.json().pricing.itemCount).toBe(2);

    const createOrder = await app.inject({
      method: "POST",
      url: "/commerce/orders",
      payload: {
        customerId,
        addressLine: "42 Market Street, Koramangala, Bengaluru",
        paymentMethod: "UPI",
        tipAmount: 15
      }
    });
    expect(createOrder.statusCode).toBe(201);
    const order = createOrder.json();
    expect(order.id).toBeTruthy();
    expect(order.status).toBe("PLACED");

    const postCheckoutCart = await app.inject({ method: "GET", url: `/commerce/cart/${customerId}` });
    expect(postCheckoutCart.statusCode).toBe(200);
    expect(postCheckoutCart.json().items.length).toBe(0);

    const listOrders = await app.inject({
      method: "GET",
      url: `/commerce/orders?customerId=${customerId}`
    });
    expect(listOrders.statusCode).toBe(200);
    expect(listOrders.json().length).toBe(1);

    const cancelOrder = await app.inject({
      method: "POST",
      url: `/commerce/orders/${order.id}/cancel`
    });
    expect(cancelOrder.statusCode).toBe(200);
    expect(cancelOrder.json().status).toBe("CANCELLED");
  });
});
