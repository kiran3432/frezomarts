# Hostinger Deploy Guide (FREZO Website)

Website source:
- `/Users/blackgdevil/Documents/New project/apps/quickcommerce-app`

## 0) Build latest upload package from Studio data
Run:
`/Users/blackgdevil/Documents/New project/apps/quickcommerce-app/publish-site.sh`

This copies latest studio data from backend into `studio-config.json` and creates:
- `/Users/blackgdevil/Documents/New project/frezo-site-upload.zip`

## Instant Live Updates (no re-upload for product changes)
For true live updates, host backend publicly and set:
- `apps/quickcommerce-app/runtime-config.json`
  - `backendBase`: your public backend URL (example: `https://api.frezomarts.com`)
  - `liveSyncIntervalMs`: polling interval in ms (default `4000`)

Website behavior:
- Loads latest backend config every few seconds.
- If backend is down, falls back to bundled `studio-config.json`.

## 1) First Deploy from hPanel (manual)
1. Open Hostinger `hPanel`.
2. Go to `Websites` -> your domain -> `File Manager`.
3. Open `public_html`.
4. Upload all files from:
   - `apps/quickcommerce-app/index.html`
   - `apps/quickcommerce-app/styles.css`
   - `apps/quickcommerce-app/main.js`
   - `apps/quickcommerce-app/runtime-config.json`
   - `apps/quickcommerce-app/studio-config.json`
   - `apps/quickcommerce-app/assets/` (full folder)
5. Verify site opens on your domain.

## 2) Recommended Auto Deploy (GitHub -> Hostinger)
This repo already includes:
- `.github/workflows/deploy-hostinger-website.yml`

### Add these GitHub secrets
In GitHub repo:
`Settings -> Secrets and variables -> Actions -> New repository secret`

Create:
- `HOSTINGER_FTP_HOST` (example: `ftp.yourdomain.com`)
- `HOSTINGER_FTP_USER`
- `HOSTINGER_FTP_PASSWORD`
- `HOSTINGER_FTP_PORT` (usually `21`)

### Where to find Hostinger FTP credentials
In hPanel:
`Websites -> Manage -> Files -> FTP Accounts`

### Deploy flow
- Push any website changes to `main`.
- GitHub Action uploads `apps/quickcommerce-app/*` to `/public_html/`.

## 3) Cache refresh after each update
If browser shows old layout:
1. Hard refresh (`Cmd+Shift+R`).
2. If needed, change asset version query in `index.html`:
   - `styles.css?v=...`
   - `main.js?v=...`

## 4) Quick rollback (manual)
Keep a backup zip of working files and re-upload to `public_html` if needed.
