# 🏋️ GymPro — Gym Management System


<div align="center">

![GymPro Banner](https://img.shields.io/badge/GymPro-Management%20System-orange?style=for-the-badge&logo=lightning&logoColor=white)

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express)](https://expressjs.com)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.3-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**A full-stack MERN application to manage gym members, workouts, diet plans, services, and payments — with dark/light mode, mobile responsiveness, and cloud image uploads.**

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📸 Screenshots

| Dashboard | Members | Member Detail |
|-----------|---------|---------------|
| Analytics & charts | Search, filter, CRUD | Profile photo, plans |

| Workouts | Diet Plans | Services |
|----------|------------|---------|
| Level-based plans | Veg/Non-veg meals | Image upload cards |

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [DevOps](#-devops)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 👥 Member Management
- Add, edit, delete gym members with profile photos
- Store name, age, gender, phone, email, address, weight, height
- Track membership status (active / expired / pending)
- Auto-calculate BMI from weight and height
- Assign workout and diet plans to each member
- Search members by name, phone, or email (debounced, real-time)
- Filter by membership status
- Paginated member list

### 🏋️ Workout Plans
- Predefined plans: Beginner, Intermediate, Advanced
- Detailed schedule with exercises, sets, reps, rest time, muscle groups
- Assign workout plans to members
- Filter by level and fitness goal

### 🥗 Diet Plans
- Create veg, non-veg, and vegan plans
- Track calories and protein targets per day
- Detailed meal breakdown (breakfast, lunch, dinner, snacks)
- Filter by diet type and fitness goal
- Assign diet plans to members

### 💳 Services & Membership Plans
- Membership pricing plans (monthly, quarterly, yearly)
- Additional services (personal training, yoga, zumba, etc.)
- Upload service images via Cloudinary
- Track features included in each plan

### 💰 Payment Management
- Auto-record payment when member joins with a plan
- Auto-record payment on membership renewal
- Manual payment recording from Payments page
- Filter by payment type and status
- Payment history with member details

### 📊 Dashboard Analytics
- Total members, active members, expired count
- Total revenue and monthly revenue
- Members by gender (donut chart)
- Revenue overview (bar chart — last 6 months)
- Members expiring this week alert
- Recent payments list

### 🔐 Authentication
- Admin login with JWT tokens
- Protected routes (all pages require login)
- Auto-logout on token expiry
- Password hashing with bcrypt

### 🎨 UI/UX
- Dark mode and Light mode toggle (saved to localStorage)
- Fully responsive — works on mobile, tablet, desktop
- Smooth animations and transitions
- Bottom-sheet modals on mobile
- Functional search bar with 300ms debounce
- Toast notifications for actions

### 📸 Image Upload
- Member profile photos via Cloudinary
- Service images via Cloudinary
- Drag & drop upload support
- Auto face-detection crop for profile photos
- Fallback: saves member without photo if Cloudinary fails

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React.js | 18.2 | UI framework |
| React Router DOM | 6.20 | Client-side routing |
| Axios | 1.6 | HTTP requests + interceptors |
| Tailwind CSS | 3.3 | Utility-first styling |
| Lucide React | 0.294 | Icon library |
| Vite | 5.0 | Build tool + dev server |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express.js | 4.18 | Web framework |
| Mongoose | 8.0 | MongoDB ODM |
| JSON Web Token | 9.0 | Authentication |
| bcryptjs | 2.4 | Password hashing |
| Multer | 1.4 | File upload handling |
| Cloudinary | 1.41 | Cloud image storage |
| multer-storage-cloudinary | 4.0 | Multer + Cloudinary bridge |
| CORS | 2.8 | Cross-origin requests |
| dotenv | 16.3 | Environment variables |
| Nodemon | 3.0 | Dev auto-restart |

### Database
| Technology | Purpose |
|-----------|---------|
| MongoDB | NoSQL document database |
| MongoDB Atlas | Cloud-hosted MongoDB (production) |

### DevOps
| Technology | Purpose |
|-----------|---------|
| Docker | Containerisation |
| Docker Compose | Multi-container orchestration |
| GitHub Actions | CI/CD pipeline |
| Render | Backend hosting |
| Vercel | Frontend hosting |

---

## 📁 Project Structure

```
gym-management/
│
├── backend/                          # Node.js + Express API
│   ├── config/
│   │   ├── db.js                     # MongoDB connection
│   │   └── cloudinary.js             # Cloudinary + Multer setup
│   ├── controllers/
│   │   ├── authController.js         # Login, register
│   │   ├── memberController.js       # Member CRUD + photo
│   │   ├── workoutController.js      # Workout plans
│   │   ├── dietController.js         # Diet plans
│   │   ├── serviceController.js      # Services, plans, payments
│   │   └── dashboardController.js    # Analytics
│   ├── middlewares/
│   │   ├── authMiddleware.js         # JWT verification
│   │   └── errorMiddleware.js        # Global error handler
│   ├── models/
│   │   ├── Admin.js                  # Admin schema
│   │   ├── Member.js                 # Member schema
│   │   ├── MembershipPlan.js         # Pricing plans schema
│   │   ├── WorkoutPlan.js            # Workout schema
│   │   ├── DietPlan.js               # Diet schema
│   │   ├── Service.js                # Services schema
│   │   └── Payment.js                # Payment schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── memberRoutes.js
│   │   ├── workoutRoutes.js
│   │   ├── dietRoutes.js
│   │   ├── serviceRoutes.js
│   │   └── dashboardRoutes.js
│   ├── utils/
│   │   ├── generateToken.js          # JWT token helper
│   │   ├── seed.js                   # Database seeder
│   │   ├── dropEmailIndex.js         # Fix email index
│   │   └── testUpload.js             # Test Cloudinary connection
│   ├── .env.example                  # Environment variable template
│   ├── package.json
│   └── server.js                     # App entry point
│
├── frontend/                         # React + Vite application
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js              # Axios instance + all API calls
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Global authentication state
│   │   │   ├── ThemeContext.jsx      # Dark/Light mode state
│   │   │   └── SearchContext.jsx     # Global search state
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Layout.jsx        # Sidebar + Navbar shell
│   │   │   │   ├── Sidebar.jsx       # Navigation sidebar
│   │   │   │   ├── Navbar.jsx        # Top navigation bar
│   │   │   │   ├── Modal.jsx         # Responsive modal/bottom-sheet
│   │   │   │   ├── StatCard.jsx      # Dashboard stat card
│   │   │   │   ├── Loader.jsx        # Loading spinner
│   │   │   │   ├── EmptyState.jsx    # Empty list placeholder
│   │   │   │   └── ThemeToggle.jsx   # Theme switcher components
│   │   │   └── members/
│   │   │       └── MemberForm.jsx    # Add/Edit member form
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Login page
│   │   │   ├── Dashboard.jsx         # Analytics dashboard
│   │   │   ├── Members.jsx           # Member list + CRUD
│   │   │   ├── MemberDetail.jsx      # Single member profile
│   │   │   ├── Workouts.jsx          # Workout plans
│   │   │   ├── DietPlans.jsx         # Diet plans
│   │   │   ├── Services.jsx          # Services + membership plans
│   │   │   └── Payments.jsx          # Payment history
│   │   ├── utils/
│   │   │   └── helpers.js            # formatDate, formatCurrency, etc.
│   │   ├── App.jsx                   # Routes setup
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Global styles + CSS variables
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml                 # GitHub Actions pipeline
│
├── docker-compose.yml                # Local dev with Docker
├── docker-compose.prod.yml           # Production Docker config
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:
- **Node.js** v18 or higher → [nodejs.org](https://nodejs.org)
- **MongoDB** v6 or higher → [mongodb.com](https://mongodb.com/try/download/community)
- **Git** → [git-scm.com](https://git-scm.com)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/gym-management.git
cd gym-management
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/gymmanagement
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Optional — only needed for photo uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Seed the Database

```bash
# Creates admin account + sample data
node utils/seed.js
```

Expected output:
```
✅ MongoDB Connected
✅ Admin created → admin@gym.com / admin123
✅ 3 membership plans created
✅ 3 workout plans created
✅ 2 diet plans created
✅ 5 services created
✅ 5 sample members created
🎉 DATABASE SEEDED SUCCESSFULLY!
```

### 4. Start Backend Server

```bash
npm run dev
# Server running on http://localhost:5000
# ✅ MongoDB Connected: localhost
```

### 5. Setup Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 6. Start Frontend

```bash
npm run dev
# App running on http://localhost:5173
```

### 7. Open in Browser

```
http://localhost:5173

Login credentials:
  Email:    admin@gym.com
  Password: admin123
```

---

## 🌐 Mobile Access (Same WiFi)

To test on your phone while developing:

**Find your PC's IP address:**
```bash
# Windows
ipconfig
# Look for: IPv4 Address → e.g. 192.168.1.105

# Mac
ipconfig getifaddr en0

# Linux
hostname -I
```

**Start frontend with host flag:**
```bash
cd frontend
npm run dev -- --host
```

**On your phone**, open:
```
http://192.168.1.105:5173
```

> Both PC and phone must be on the same WiFi network.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | ✅ | Server port | `5000` |
| `MONGO_URI` | ✅ | MongoDB connection string | `mongodb://localhost:27017/gymmanagement` |
| `JWT_SECRET` | ✅ | JWT signing secret (min 32 chars) | `your_secret_key_here` |
| `JWT_EXPIRE` | ✅ | Token expiry | `30d` |
| `FRONTEND_URL` | ✅ | Allowed CORS origin | `http://localhost:5173` |
| `NODE_ENV` | ✅ | Environment | `development` or `production` |
| `CLOUDINARY_CLOUD_NAME` | ⚡ | Cloudinary cloud name | `dxyz123` |
| `CLOUDINARY_API_KEY` | ⚡ | Cloudinary API key | `123456789012` |
| `CLOUDINARY_API_SECRET` | ⚡ | Cloudinary API secret | `abc_xyz_secret` |

> ⚡ Required only for photo upload feature

### Frontend (`frontend/.env`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | ✅ | Backend API base URL | `http://localhost:5000/api` |

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create admin account | Public |
| POST | `/api/auth/login` | Admin login → returns JWT | Public |
| GET | `/api/auth/profile` | Get logged-in admin | 🔒 |

### Members
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/members` | List all (search, filter, paginate) | 🔒 |
| GET | `/api/members/:id` | Single member with populated refs | 🔒 |
| POST | `/api/members` | Create member (multipart/form-data) | 🔒 |
| PUT | `/api/members/:id` | Update member + optional new photo | 🔒 |
| DELETE | `/api/members/:id` | Delete member + payments + photo | 🔒 |
| DELETE | `/api/members/:id/photo` | Remove profile photo only | 🔒 |
| POST | `/api/members/:id/renew` | Renew membership + record payment | 🔒 |
| POST | `/api/members/:id/assign-workout` | Assign workout plan | 🔒 |
| POST | `/api/members/:id/assign-diet` | Assign diet plan | 🔒 |

### Workouts
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/workouts` | All plans (`?level=beginner`) | 🔒 |
| GET | `/api/workouts/:id` | Single plan | 🔒 |
| POST | `/api/workouts` | Create plan | 🔒 |
| PUT | `/api/workouts/:id` | Update plan | 🔒 |

### Diet Plans
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/diet` | All plans (`?type=veg&goal=weight_loss`) | 🔒 |
| GET | `/api/diet/:id` | Single plan | 🔒 |
| POST | `/api/diet` | Create plan | 🔒 |
| PUT | `/api/diet/:id` | Update plan | 🔒 |

### Services & Plans
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/services` | All services | 🔒 |
| POST | `/api/services` | Create service (with image) | 🔒 |
| PUT | `/api/services/:id` | Update service | 🔒 |
| DELETE | `/api/services/:id` | Delete service | 🔒 |
| GET | `/api/services/membership-plans` | All pricing plans | 🔒 |
| POST | `/api/services/membership-plans` | Create pricing plan | 🔒 |
| GET | `/api/services/payments` | Payment history | 🔒 |
| POST | `/api/services/payments` | Record manual payment | 🔒 |

### Dashboard
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/dashboard/stats` | All analytics data | 🔒 |
| GET | `/api/health` | Server health check | Public |

> 🔒 = Requires `Authorization: Bearer <token>` header

---

## 🗃️ Database Schema

```
Admin
  ├── name (String, required)
  ├── email (String, unique, required)
  ├── password (String, bcrypt hashed)
  └── role (String, default: 'admin')

Member
  ├── name, phone, email, age, gender
  ├── address, weight, height, goal, notes
  ├── profilePhoto, photoPublicId (Cloudinary)
  ├── membershipPlan → ref: MembershipPlan
  ├── membershipExpiry (Date), membershipStatus
  ├── assignedWorkout → ref: WorkoutPlan
  └── assignedDiet → ref: DietPlan

MembershipPlan
  ├── name, duration (days), price
  ├── features ([String])
  └── isActive

WorkoutPlan
  ├── name, level, goal, daysPerWeek
  ├── description
  └── schedule [{day, focus, exercises:[{name,sets,reps,muscleGroup}]}]

DietPlan
  ├── name, type (veg/non-veg/vegan), goal
  ├── dailyCalorieTarget, dailyProteinTarget
  └── meals [{mealType, time, items:[{name,quantity,calories,protein}]}]

Service
  ├── name, description, pricePerMonth
  ├── category (fitness/wellness/nutrition/other)
  ├── image, imagePublicId (Cloudinary)
  └── isActive

Payment
  ├── member → ref: Member
  ├── amount, paymentDate, paymentMethod
  ├── paymentFor (membership/service/other)
  ├── membershipPlan → ref: MembershipPlan
  ├── service → ref: Service
  ├── notes, status (completed/pending/failed)
```

---

## ☁️ Deployment

### Free Stack Used

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| [MongoDB Atlas](https://mongodb.com/atlas) | Cloud database | 512MB |
| [Render](https://render.com) | Backend hosting | 750 hrs/month |
| [Vercel](https://vercel.com) | Frontend hosting | 100GB bandwidth |
| [Cloudinary](https://cloudinary.com) | Image storage | 25GB |

### Quick Deploy Steps

**1. Database — MongoDB Atlas**
```
1. Create free account at mongodb.com/atlas
2. Create M0 (free) cluster
3. Create database user
4. Allow all IPs (0.0.0.0/0)
5. Copy connection string
6. Run: node utils/seed.js (with Atlas MONGO_URI)
```

**2. Backend — Render**
```
1. Push code to GitHub
2. Create account at render.com
3. New Web Service → connect GitHub repo
4. Root Directory: backend
5. Build: npm install | Start: node server.js
6. Add all environment variables
7. Deploy
```

**3. Frontend — Vercel**
```
1. Create account at vercel.com
2. Import GitHub repo
3. Root Directory: frontend
4. Add VITE_API_URL = https://your-render-url.onrender.com/api
5. Deploy
```

**Production URLs:**
```
Frontend : https://your-app.vercel.app
Backend  : https://your-app.onrender.com
Health   : https://your-app.onrender.com/api/health
```

---

## 🐳 DevOps

### Run with Docker (Local)

```bash
# Start everything (MongoDB + Backend + Frontend)
docker-compose up -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f backend
```

### CI/CD Pipeline (GitHub Actions)

The `.github/workflows/ci-cd.yml` pipeline runs automatically on every push:

```
Push to GitHub
     ↓
Lint check (ESLint)
     ↓
Run tests (Jest + Supertest)
     ↓
Build Docker images
     ↓
Push to Docker Hub
     ↓
Deploy to production (main branch only)
```

---

## 🧪 Running Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Watch mode (re-runs on file change)
npm run test:watch
```

---

## 🛡️ Security Features

- ✅ JWT authentication on all protected routes
- ✅ Passwords hashed with bcrypt (12 salt rounds)
- ✅ Token auto-expiry (30 days) with auto-logout
- ✅ CORS restricted to frontend URL
- ✅ Input validation on all endpoints
- ✅ `.env` files excluded from git
- ✅ Mongoose sanitization prevents NoSQL injection
- ✅ File type validation (images only)
- ✅ File size limits (3MB for photos, 5MB for service images)

---

## 🐛 Common Issues & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `ECONNREFUSED 127.0.0.1:27017` | MongoDB not running | Run `mongod` in terminal |
| `Invalid email or password` | Admin doesn't exist | Run `node utils/seed.js` |
| `Route not found: POST /api/services/payments` | Old serviceRoutes.js | Replace with latest version |
| `Failed to save member` from mobile | Cloudinary network issue | Member saves without photo automatically |
| `ENOTFOUND api.cloudinary.com` | No internet / firewall | Check internet, try `node utils/testUpload.js` |
| Login works on PC but not mobile | API URL still `localhost` | Update axios.js with smart hostname detection |
| Dark mode cards not changing | Hardcoded Tailwind classes | Replace with `var(--bg2)` CSS variables |

---

## 📜 Scripts Reference

### Backend Scripts

```bash
npm start          # Production server
npm run dev        # Development with nodemon (auto-restart)
npm test           # Run Jest tests
npm run test:coverage  # Tests + coverage report
npm run lint       # ESLint code check
npm run lint:fix   # ESLint auto-fix
```

### Frontend Scripts

```bash
npm run dev        # Start Vite dev server
npm run dev -- --host   # Start with LAN access (mobile testing)
npm run build      # Production build
npm run preview    # Preview production build locally
npm run lint       # ESLint check
```

### Utility Scripts

```bash
# From backend/ folder
node utils/seed.js          # Seed database with sample data
node utils/dropEmailIndex.js # Fix duplicate email index issue
node utils/testUpload.js    # Test Cloudinary connection
```

---

## 📱 Responsive Design

The app is fully responsive across all devices:

| Breakpoint | Screen | Layout |
|-----------|--------|--------|
| Mobile | < 640px | Single column, bottom-sheet modals, sidebar overlay |
| Tablet | 640px - 1024px | 2-column grids, condensed sidebar |
| Desktop | > 1024px | Full layout, persistent sidebar, 3-4 column grids |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'feat: add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

### Commit Convention

```
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Formatting changes
refactor: Code refactoring
test:     Adding tests
chore:    Maintenance tasks
```

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your@email.com

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License — free to use, modify, and distribute.
```

---

## 🙏 Acknowledgements

- [React.js](https://reactjs.org) — Frontend framework
- [Express.js](https://expressjs.com) — Backend framework
- [MongoDB](https://mongodb.com) — Database
- [Tailwind CSS](https://tailwindcss.com) — Styling
- [Lucide Icons](https://lucide.dev) — Icon library
- [Cloudinary](https://cloudinary.com) — Image hosting
- [Render](https://render.com) — Backend hosting
- [Vercel](https://vercel.com) — Frontend hosting

---

<div align="center">

Made with ❤️ for the fitness community

⭐ **Star this repo if it helped you!** ⭐

</div>