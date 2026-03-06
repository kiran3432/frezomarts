# Render Backend Deploy (Frezo Live Sync)

This guide deploys `apps/backend` to Render for instant live updates on `frezomarts.com`.

## 1) Push this repo to GitHub

Render deploys from GitHub. Make sure latest code is pushed.

## 2) Create Web Service in Render

1. Open Render dashboard.
2. Click `New` -> `Blueprint`.
3. Select your GitHub repo.
4. Render will detect `render.yaml`.
5. Create service.

The backend service name is `frezo-backend` and health endpoint is `/health`.

## 3) Set required secret

In Render service settings, add:

- `JWT_SECRET` (required, long random string)

`PORT` is provided automatically by Render.

## 4) DNS for API domain

You already created:

- `A` record: `api.frezomarts.com` -> `152.57.173.104`

If using Render, replace that with either:

- `CNAME` record: `api` -> `<your-render-service>.onrender.com`

or add Custom Domain in Render first and follow Render DNS instructions exactly.

## 5) Point website runtime config

Update:

- `apps/quickcommerce-app/runtime-config.json`

Set:

```json
{
  "backendBase": "https://api.frezomarts.com",
  "liveSyncIntervalMs": 4000
}
```

Then upload latest website package to Hostinger.

## 6) Verify live sync

1. Open Studio and connect to `https://api.frezomarts.com`.
2. Add/edit product and save.
3. Open `frezomarts.com`.
4. Changes should appear within ~4 seconds.

## Important note about Render free plan

Studio config is stored in `apps/backend/data/studio-config.json` (file-based storage).
On free hosting, file storage can reset on restart/redeploy.
For durable production data, move Studio config to database storage (recommended next step).
