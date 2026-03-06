# FREZO Web

Blinkit-style web storefront for FREZO, synced from Studio config (`/studio/config`).

## Included

- Sticky desktop top bar (brand, delivery ETA/address, search, login, cart)
- Promotion banner strip
- Category image strip
- Horizontal product shelves with `see all`
- Category page with left category sidebar + product grid
- Cart drawer with quantity controls
- Auto location detection and dynamic ETA

## Run

1. Start backend:

```bash
npm run dev:backend
```

2. Start website server (absolute path recommended):

```bash
python3 -m http.server 8083 --directory '/Users/blackgdevil/Documents/New project/apps/quickcommerce-app'
```

3. Open:

`http://10.108.131.248:8083`

## Deploy to Hostinger

See:

`/Users/blackgdevil/Documents/New project/apps/quickcommerce-app/HOSTINGER_DEPLOY.md`
