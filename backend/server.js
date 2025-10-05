const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const apiRoutes = require('./routes/api');

// Robust .env loading: prefer project root .env, fallback to backend/.env
(() => {
  const candidates = [
    path.join(__dirname, '..', '.env'),
    path.join(__dirname, '.env')
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      require('dotenv').config({ path: p });
      console.log('[env] loaded', p);
      break;
    }
  }
})();

console.log('[boot] MONGO_URI present:', !!process.env.MONGO_URI);

const app = express();

app.use(cors());
app.use(express.json());

// Centralized startup with awaited Mongo connection and better diagnostics
async function start() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('[boot] ERROR: MONGO_URI missing. Create .env with MONGO_URI=...');
    process.exit(1);
  }
  try {
    console.log('[boot] Connecting to Mongo...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 20000
    });
    console.log('[boot] Mongo connected. readyState=', mongoose.connection.readyState);
  } catch (err) {
    console.error('[boot] Mongo connection FAILED:', err.message);
    // Helpful hints
    if (/ENOTFOUND|ECONNREFUSED/.test(err.message)) {
      console.error('[boot] Hint: Is MongoDB running and accessible at this host/port?');
    }
    if (/authentication/i.test(err.message)) {
      console.error('[boot] Hint: Check username/password in the URI');
    }
    process.exit(1);
  }

  // Connection event listeners for runtime visibility
  mongoose.connection.on('disconnected', () => console.warn('[mongo] disconnected'));
  mongoose.connection.on('reconnected', () => console.log('[mongo] reconnected'));
  mongoose.connection.on('error', (e) => console.error('[mongo] error event:', e.message));

  app.use('/api', apiRoutes);

  app.get('/healthz', (req, res) => {
    res.json({ ok: true, db: mongoose.connection.readyState });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`[boot] Server running on port ${PORT}`));
}

start();