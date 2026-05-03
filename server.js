// backend/server.js
// Updated CORS config to allow mobile devices on same WiFi network

const express   = require('express')
const dotenv    = require('dotenv')
const cors      = require('cors')
const connectDB = require('./config/db')

dotenv.config()
connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── CORS: Allow PC + All mobile devices on local network ──────
//
// OLD (broken for mobile):
//   origin: 'http://localhost:5173'   ← only allows localhost
//
// NEW (works for mobile):
//   Allows any origin that matches your local network pattern
//   192.168.x.x, 10.x.x.x, etc.
//
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true)

    const allowed = [
      // localhost development
      /^http:\/\/localhost:\d+$/,
      // Local network IPs (your home/office WiFi)
      // Covers 192.168.x.x (most home routers)
      /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/,
      // Covers 10.x.x.x (some routers, corporate networks)
      /^http:\/\/10\.\d+\.\d+\.\d+(:\d+)?$/,
      // Covers 172.16-31.x.x (Docker, some VPNs)
      /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+(:\d+)?$/,
    ]

    const isAllowed = allowed.some(pattern => pattern.test(origin))

    if (isAllowed) {
      callback(null, true)
    } else {
      console.log('⚠️  CORS blocked origin:', origin)
      // In development, allow anyway to avoid headaches
      // Remove this line in production!
      callback(null, true)
    }
  },
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status:  'healthy',
    message: '🏋️ GymPro API running',
    uptime:  Math.floor(process.uptime()),
  })
})

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/authRoutes'))
app.use('/api/members',   require('./routes/memberRoutes'))
app.use('/api/workouts',  require('./routes/workoutRoutes'))
app.use('/api/diet',      require('./routes/dietRoutes'))
app.use('/api/services',  require('./routes/serviceRoutes'))
app.use('/api/dashboard', require('./routes/dashboardRoutes'))

// ── 404 ───────────────────────────────────────────────────────
app.use((req, res) => {
  console.log(`❌ 404 — ${req.method} ${req.originalUrl}`)
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })
})

// ── Global error handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('💥 Server error:', err.message)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large. Max 3MB.' })
  }
  res.status(500).json({ message: err.message || 'Internal server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => {
  //            ^^^^^^^^^^
  //  '0.0.0.0' = listen on ALL network interfaces
  //  This is required so mobile devices can reach the server
  //  Default 'localhost' only accepts connections from the same machine
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Local:   http://localhost:${PORT}`)
  console.log(`📱 Network: http://<your-IP>:${PORT}`)
  console.log(`\n   Find your IP:`)
  console.log(`   Windows → CMD → ipconfig → IPv4 Address`)
  console.log(`   Mac     → Terminal → ipconfig getifaddr en0\n`)
})
