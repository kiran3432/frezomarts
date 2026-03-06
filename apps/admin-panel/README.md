# Admin Panel MVP

Web admin dashboard for:

- live ride monitoring
- cancellation reason tracking
- available captain visibility
- realtime updates via socket events

## Run

1. Start backend at `http://localhost:4000`
2. Serve this folder:

```bash
cd /Users/blackgdevil/Documents/New\ project/apps/admin-panel
python3 -m http.server 5175
```

3. Open:

`http://127.0.0.1:5175`

4. In UI:

- Click `Request OTP`
- Click `Login` (`123456` in dev mode)

