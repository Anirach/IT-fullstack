# Books client

React frontend for the Express `CRUDBookNoDB.js` backend.

## Run

In one terminal, start the backend (from repo root):

```bash
node src/CRUDBookNoDB.js   # listens on :5500
```

In another terminal, start the client:

```bash
cd client
npm install
npm run dev                # opens http://localhost:3000
```

Vite proxies `/books` to `http://localhost:5500`, so no CORS config is needed in dev.

## Build

```bash
npm run build              # outputs dist/
npm run preview            # serves the build locally
```

For production, either:
- Serve `dist/` from the Express app, or
- Add `cors` middleware to the backend and host the client separately.
