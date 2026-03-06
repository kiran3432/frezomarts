# API Contract (MVP)

Base URL: `http://localhost:4000`

## Quick Commerce

### Catalog

- `GET /commerce/categories`
  - response: list of category summaries
- `GET /commerce/products`
  - query:
    - `q` optional search keyword
    - `category` optional exact category label
    - `sort` optional one of `popular | price_low | price_high | fast_delivery`
- `GET /commerce/products/:id`
  - response: product detail

### Cart

- `GET /commerce/cart/:customerId`
  - response: cart items + pricing summary
- `POST /commerce/cart/:customerId/items`
  - body: `{ "productId": "prd_milk_toned", "quantity": 2 }`
- `PATCH /commerce/cart/:customerId/items/:productId`
  - body: `{ "quantity": 3 }`
- `DELETE /commerce/cart/:customerId/items/:productId`
  - removes product from cart

### Orders

- `POST /commerce/orders`
  - body:
    - `{ "customerId": "cust_demo", "addressLine": "42 Market Street", "paymentMethod": "UPI", "tipAmount": 20 }`
  - response includes order status timeline and ETA
- `GET /commerce/orders`
  - query: `customerId`
- `GET /commerce/orders/:id`
  - response: live order state (`PLACED | PACKING | OUT_FOR_DELIVERY | DELIVERED | CANCELLED`)
- `POST /commerce/orders/:id/cancel`
  - allowed until order is out for delivery

## Auth

- `POST /auth/request-otp`
  - body: `{ "phoneNumber": "+919900112233" }`
  - response includes `devOtp` for local testing
- `POST /auth/verify-otp`
  - body: `{ "phoneNumber": "+919900112233", "otp": "123456", "role": "RIDER" }`
  - response includes JWT `accessToken` and `refreshToken`
- `POST /auth/refresh`
  - body: `{ "refreshToken": "<refresh-token>" }`
  - response: new `accessToken` and rotated `refreshToken`

## Authorization

- Send bearer token on protected endpoints:
  - `Authorization: Bearer <accessToken>`
- protected endpoints: `/rides/*` and `/captains/*`

## Rides

- `GET /rides` -> list rides
- `GET /rides/:id` -> ride detail
- `GET /rides/history`
  - query: `status`, `paymentStatus`, `riderId`, `captainId`, `q`, `limit`
- `GET /rides/history/export`
  - CSV export with same filters as `/rides/history`
  - role scope:
  - `RIDER` must pass `riderId`
  - `CAPTAIN` must pass `captainId`
  - `ADMIN` unrestricted
- `POST /rides`
  - body:
  - `{ "riderId": "rider_1", "pickup": { "lat": 12.97, "lng": 77.59 }, "drop": { "lat": 12.93, "lng": 77.62 } }`
  - behavior: auto-assigns nearest available captain if found, applies zone/time surge multiplier
- `POST /rides/:id/assign`
  - body: `{ "captainId": "captain_1" }`
- `POST /rides/:id/auto-assign`
  - auto-assigns nearest available captain for unassigned rides
- `POST /rides/:id/status`
  - body: `{ "status": "STARTED" }`
- `POST /rides/:id/cancel`
  - body: `{ "reason": "Plan changed" }`
  - rule: allowed before `STARTED` and by `RIDER`/`ADMIN`

## Captains

- `GET /captains/available` -> list online and available captains
- `GET /captains/:id` -> captain detail with current location
- `POST /captains/:id/location`
  - body: `{ "lat": 12.96, "lng": 77.60, "isOnline": true, "isAvailable": true }`

## Payments

- `GET /payments/rides/:rideId`
  - payment summary for a ride
- `POST /payments/rides/:rideId/collect`
  - body: `{ "method": "UPI" }`
  - rules: ride must be `COMPLETED`, and not already paid
- `GET /payments/pending`
  - admin endpoint for completed but unpaid rides

## Payouts

- `GET /payouts/captains/:captainId/summary`
  - captain/admin earnings summary (`pendingNet`, `settledNet`)
- `GET /payouts/captains/:captainId/entries`
  - captain/admin payout ledger rows
- `POST /payouts/captains/:captainId/settle`
  - admin settlement of all pending payouts for the captain

## Invoices

- `GET /invoices/rides/:rideId`
  - ride invoice payload with fare, payment, and payout breakdown

## Audit (Admin)

- `GET /admin/audit-logs`
  - query: `action`, `actorRole`, `status`, `limit`

## Socket Events

Server URL: `ws://localhost:4000`

- Client emit: `trip:subscribe` with ride id
- Client emit: `trip:unsubscribe` with ride id
- Server emit: `trip:update`
  - payload: `{ "rideId": "...", "status": "DRIVER_ASSIGNED", "timestamp": "..." }`
