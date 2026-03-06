# Mobility + Quick Commerce MVP Scaffold

This workspace contains starter architecture for:

- bike taxi / ride-hailing workflows
- quick-commerce (Blinkit/Zepto-like) grocery delivery workflows

- `apps/backend` - TypeScript backend API + Socket.IO realtime events
- `apps/rider-app` - rider mobile app placeholder and contracts
- `apps/captain-app` - captain mobile app placeholder and contracts
- `apps/admin-panel` - admin web placeholder and contracts
- `apps/quickcommerce-app` - quick-commerce customer web app
- `apps/rider-native` - Expo React Native rider app
- `apps/captain-native` - Expo React Native captain app
- `apps/frezo-native` - Expo React Native quick-commerce customer app

## MVP Scope

- Quick-commerce catalog, cart, checkout, and order tracking APIs
- Quick-commerce storefront with category browsing, cart, and live order tracker
- OTP login (stubbed endpoints in backend)
- Ride request and driver acceptance flow
- Automatic nearest-captain matching
- Ride lifecycle updates
- Live trip event stream over WebSockets
- Shared data contracts to keep all apps aligned

## Quick Start

1. Copy environment file:

```bash
cp .env.example apps/backend/.env
```

2. Start local infra:

```bash
docker compose up -d
```

3. Start backend:

```bash
cd apps/backend
npm install
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
npm run dev
```

4. Check health:

```bash
curl http://localhost:4000/health
```

5. Open quick-commerce web app:

```bash
npx serve apps/quickcommerce-app
```

## Next Build Steps

1. Replace OTP stubs with Firebase Auth or Twilio Verify.
2. Add Redis-backed geospatial indexing for high-throughput matching.
3. Add payment, payout, and settlement modules.
4. Build Flutter/RN screens for rider and captain based on shared API contracts.
5. Add production concerns: idempotency keys, retries, fraud controls, observability, and CI/CD.

## Render Deploy (Backend)

For hosted backend + instant website sync, use:

- `render.yaml` (blueprint)
- `docs/RENDER_BACKEND_DEPLOY.md` (step-by-step)

## Native Mobile (Expo)

1. Install dependencies:

```bash
npm install
```

2. Run backend:

```bash
npm run dev:backend
```

3. Run rider native app:

```bash
npm run dev:rider-native
```

4. Run captain native app:

```bash
npm run dev:captain-native
```

### Backend URL for emulator/device

- Android Emulator: `http://10.0.2.2:4000`
- iOS Simulator: `http://127.0.0.1:4000`
- Physical phone: `http://<YOUR_MAC_LAN_IP>:4000`
