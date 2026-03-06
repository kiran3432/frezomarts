# Captain App MVP

Simple captain web client for:

- ride queue monitoring
- manual captain assignment
- trip status progression (`DRIVER_ARRIVING` -> `STARTED` -> `COMPLETED`)

## Run

1. Start backend at `http://localhost:4000`.
2. Serve this folder:

```bash
cd /Users/blackgdevil/Documents/New\ project/apps/captain-app
python3 -m http.server 5174
```

3. Open:

`http://localhost:5174`

4. In UI:

- Click `Request OTP`
- Click `Login` (uses `123456` in dev mode)
- Refresh rides and progress trip statuses
