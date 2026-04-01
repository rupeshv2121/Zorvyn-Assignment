# 💰 Finance Dashboard - Full Stack Application

A production-quality Finance Dashboard system with clean architecture, role-based access control (RBAC), and modern tech stack.

![Tech Stack](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 🎯 Project Overview

This is a **full-stack finance dashboard** that allows users to manage financial records, view analytics, and control access based on roles. Built with production-grade architecture and best practices.

### Key Features

✨ **User Authentication** - JWT-based auth with refresh tokens  
🔐 **Role-Based Access Control** - Viewer, Analyst, Admin roles  
📊 **Financial Analytics** - Dashboard with charts and insights  
💸 **Record Management** - CRUD operations for income/expense  
👥 **User Management** - Admin panel for user administration  
📱 **Responsive Design** - Mobile-first, works on all devices  
🎨 **Modern UI** - Clean Tailwind CSS design  

---

## 🏗️ Architecture

### Tech Stack

#### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Auth:** JWT + Bcrypt
- **Validation:** Zod
- **Logging:** Winston
- **Security:** Helmet, CORS, Rate Limiting

#### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State:** React Query + Zustand
- **HTTP:** Axios
- **Charts:** Recharts
- **Routing:** React Router v6

### Architecture Pattern

```
┌─────────────────────────────────────┐
│         Frontend (React)            │
│                                     │
│  Pages → Components → Hooks        │
│     ↓                               │
│  React Query ← API Client          │
└─────────────────────────────────────┘
                 ↓ REST API
┌─────────────────────────────────────┐
│      Backend (Express)              │
│                                     │
│  Routes → Controllers               │
│     ↓                               │
│  Middleware (Auth, RBAC)           │
│     ↓                               │
│  Services (Business Logic)         │
│     ↓                               │
│  Repositories (Data Access)        │
└─────────────────────────────────────┘
                 ↓
        ┌──────────────┐
        │   Supabase   │
        │  PostgreSQL  │
        └──────────────┘
```

---

## 📁 Project Structure

```
Zorvyn/
├── backend/               # Node.js/Express backend
│   ├── src/
│   │   ├── config/       # Configuration (DB, Logger)
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Auth, RBAC, Validation
│   │   ├── repositories/ # Data access layer
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── types/        # TypeScript types
│   │   ├── utils/        # Helpers
│   │   └── validations/  # Zod schemas
│   ├── schema.sql        # Database schema
│   ├── seed.sql          # Test data
│   └── package.json
│
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Route pages
│   │   ├── services/     # API client
│   │   ├── store/        # State management
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Helpers
│   ├── index.html
│   └── package.json
│
├── QUICK_START.md         # Quick setup guide
└── README.md             # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

### Setup Instructions

**See [QUICK_START.md](./QUICK_START.md) for detailed setup guide.**

Quick version:

```bash
# 1. Backend setup
cd backend
node create-structure.js
npm install
cp .env.example .env
# Edit .env with Supabase credentials
# Run schema.sql in Supabase SQL Editor
npm run dev

# 2. Frontend setup
cd ../frontend
node create-structure.js
npm install
cp .env.example .env
npm run dev
```

### Test Credentials

After running `seed.sql`:

- **Admin:** admin@example.com / password123
- **Analyst:** analyst@example.com / password123
- **Viewer:** viewer@example.com / password123

---

## 🔐 Role-Based Access

### Roles

| Role | Dashboard | Records | User Mgmt |
|------|-----------|---------|-----------|
| **Viewer** | ✅ View | ❌ | ❌ |
| **Analyst** | ✅ View | ✅ CRUD | ❌ |
| **Admin** | ✅ View | ✅ CRUD | ✅ Manage |

### Permission Implementation

Backend enforces permissions via middleware:
```typescript
router.get('/records', requireAuth, requireRole(['analyst', 'admin']), getRecords);
```

Frontend conditionally renders based on role:
```tsx
{user.role === 'admin' && <AdminPanel />}
```

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token

### Users (Admin only)
- `GET /api/users` - List all users
- `PATCH /api/users/:id/role` - Update user role
- `PATCH /api/users/:id/status` - Update user status

### Financial Records (Analyst/Admin)
- `POST /api/records` - Create record
- `GET /api/records` - List records (with filters)
- `GET /api/records/:id` - Get single record
- `PATCH /api/records/:id` - Update record
- `DELETE /api/records/:id` - Delete record

### Dashboard (All authenticated)
- `GET /api/dashboard/summary` - Financial summary
- `GET /api/dashboard/category-breakdown` - Category totals
- `GET /api/dashboard/trends` - Monthly trends
- `GET /api/dashboard/recent` - Recent transactions

**Full API documentation in [backend/README.md](./backend/README.md)**

---

## 🗄️ Database Schema

### Users
- id (UUID)
- email (unique)
- password_hash
- role (viewer | analyst | admin)
- status (active | inactive)
- timestamps

### Financial Records
- id (UUID)
- user_id (FK → users)
- amount (decimal)
- type (income | expense)
- category
- date
- notes
- timestamps

**Optimized with indexes on:**
- Email lookups
- User + date queries
- Category aggregations
- Type filtering

---

## 🎨 Screenshots

*(Add screenshots here after implementation)*

- Login Page
- Dashboard with Charts
- Records Management
- Admin Panel

---

## 🚢 Deployment

### Backend (Vercel/Railway/Render)

```bash
# Build
npm run build

# Deploy
vercel --prod
```

### Frontend (Vercel/Netlify)

```bash
# Build
npm run build

# Deploy dist/
vercel --prod
```

**Environment Variables:**
- Backend: Supabase credentials, JWT secrets
- Frontend: `VITE_API_URL` (backend URL)

---

## 🧪 Testing

### Manual Testing
1. Start both backend and frontend
2. Login with test users
3. Test each role's permissions
4. Create/edit/delete records
5. View dashboard analytics

### Test Scenarios
- ✅ Authentication flow
- ✅ Role-based access control
- ✅ CRUD operations
- ✅ Dashboard aggregations
- ✅ Filtering and pagination
- ✅ Error handling

---

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Setup guide
- **[backend/README.md](./backend/README.md)** - Backend docs
- **[frontend/README.md](./frontend/README.md)** - Frontend docs
- **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Architecture details

---

## 🛠️ Development Workflow

### Adding a New Feature

1. **Backend:**
   - Add validation schema in `validations/`
   - Create repository method in `repositories/`
   - Add business logic in `services/`
   - Create controller in `controllers/`
   - Wire route in `routes/`

2. **Frontend:**
   - Add API call in `services/api/`
   - Create React Query hook in `hooks/`
   - Build UI component in `components/`
   - Add to page in `pages/`

### Code Style

- TypeScript strict mode
- Functional components (React)
- Async/await over promises
- Descriptive variable names
- Comments only where needed

---

## 📈 Future Enhancements

- [ ] Dark mode toggle
- [ ] Export data (CSV, PDF)
- [ ] Email notifications
- [ ] Budget planning features
- [ ] Recurring transactions
- [ ] Multi-currency support
- [ ] Mobile app (React Native)
- [ ] Real-time updates (WebSockets)

---

## 🤝 Contributing

1. Follow the existing code structure
2. Write type-safe TypeScript
3. Keep controllers thin, services fat
4. Add validation for all inputs
5. Test thoroughly before committing

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👨‍💻 Author

Built as a demonstration of production-quality full-stack development with clean architecture and best practices.

---

## 🙏 Acknowledgments

- Supabase for managed PostgreSQL
- Vercel for deployment platform
- Open source libraries and frameworks

---

**Ready to build a production-quality finance dashboard! 🚀**
