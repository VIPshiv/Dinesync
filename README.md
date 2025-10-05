# DineSync

A full‑stack restaurant ordering platform with a polished cart experience, secure checkout, order tracking, and a newsletter subscription system.

## Overview
- Single‑page app (React + Vite) with animated landing sections and smooth in‑page navigation
- Express.js + MongoDB backend with JWT‑based auth and resilient DB readiness handling
- Smart cart drawer: per‑item quantity controls, inline list, keyboard accessibility, and auth‑gated checkout
- Order lifecycle: place orders and track by order number
- Newsletter: idempotent subscribe endpoint with duplicate detection and friendly UI states

## Tech Stack
- Frontend: React, Vite, Context API, CSS, GSAP (animations)
- Backend: Node.js, Express.js, Mongoose/MongoDB, JWT
- Tooling: Postman (API tests), Git/GitHub

## Project Structure
```
backend/
  server.js
  middleware/
    auth.js
  models/
    Contact.js
    MenuItem.js
    Order.js
    User.js
  routes/
    api.js
res frontend/
  index.html
  package.json
  vite.config.js
  src/
    main.jsx
    App.jsx
    components/
      ...
    Pages/
      Home/
      Menu/
      Admin/
      ...
```

## Prerequisites
- Node.js 18+ and npm
- MongoDB (Atlas URI or local instance)
- Windows PowerShell (commands below use PowerShell syntax)

## Environment Variables
Create a `.env` file in `backend/` with:
```
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-strong-secret
PORT=5000
```
Notes:
- For local Mongo: `MONGO_URI=mongodb://127.0.0.1:27017/dinesync`
- If using Atlas and you see TLS/SSL errors, verify the exact connection string from Atlas and that your IP is allowed.

## Setup & Run
Install dependencies and start backend and frontend in separate terminals.

Backend:
```powershell
cd "c:\Users\parma\OneDrive\Desktop\programming\web projects\full stack web\restaurent web\backend"
npm install
# start server (adjust if you have a script)
node server.js
```

Frontend (Vite dev server):
```powershell
cd "c:\Users\parma\OneDrive\Desktop\programming\web projects\full stack web\restaurent web\res frontend"
npm install
npm run dev
```

Default dev URLs:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API (selected)
- GET `/api/menu` — list menu items
- POST `/api/orders` — place an order (auth required)
- GET `/api/orders/track/:orderNumber` — track order status
- POST `/api/subscribe` — subscribe to newsletter (idempotent)
- GET `/api/subscribe/check?email=you@example.com` — check if email is already subscribed

## Key Features
- Cart Drawer UX: inline items, per‑item adjust, remove, total, keyboard support; opens from multiple sections
- Auth‑aware Checkout: unauthenticated users are redirected to Register before checkout
- Order Tracking: fetches live status by order number
- Newsletter: duplicate‑safe subscription with conditional UI (hides form after success)
- Smooth Navigation: footer quick links (Home, Menu, Specials section, Contact) with hash/offset scrolling
- Accessibility: Escape to close cart, aria labels, focus management

## Troubleshooting
- Mongo SSL internal error (TLS alert 80):
  - Double‑check your `MONGO_URI` (Atlas SRV vs standard). Use the exact string from Atlas and whitelist your IP.
  - Ensure internet/DNS access for SRV lookups or switch to the standard connection string variant.
- Database not ready (503): wait for the DB to connect; the backend guards routes until `readyState=1`.
- CORS/Ports: make sure frontend calls the correct `http://localhost:5000` origin in development.

## Scripts (suggested)
Consider adding these to `backend/package.json` and `res frontend/package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## License
MIT (optional — add a LICENSE file if you plan to open source)

---

Made with ❤️ for great dining experiences.
