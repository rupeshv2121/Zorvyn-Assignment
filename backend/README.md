# Finance Dashboard Backend

Production-quality Finance Dashboard Backend with clean architecture, RBAC, and scalable design.

## 🏗️ Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Authentication:** JWT (jsonwebtoken + bcrypt)
- **Validation:** Zod
- **Logging:** Winston
- **Security:** Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration (database, logger, env)
│   ├── types/           # TypeScript type definitions
│   ├── validations/     # Zod validation schemas
│   ├── middleware/      # Express middleware (auth, RBAC, validation)
│   ├── repositories/    # Data access layer
│   ├── services/        # Business logic layer
│   ├── controllers/     # Request handlers
│   ├── routes/          # Route definitions
│   ├── utils/           # Utility functions
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── database/
│   ├── schema.sql       # Database schema
│   └── seed.sql         # Seed data
├── .env.example
├── package.json
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- Supabase account (or PostgreSQL database)
- npm or yarn

### Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
   - `JWT_ACCESS_SECRET`: Strong random secret for access tokens
   - `JWT_REFRESH_SECRET`: Strong random secret for refresh tokens
   - `FRONTEND_URL`: Your frontend URL (for CORS)

4. **Setup database:**
   
   Go to your Supabase SQL Editor and run:
   ```bash
   # Run schema.sql first (creates tables)
   # Then run seed.sql (adds test data - optional)
   ```

   Test users (password: `password123`):
   - `admin@example.com` (admin role)
   - `analyst@example.com` (analyst role)
   - `viewer@example.com` (viewer role)

5. **Start development server:**
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

## 📚 API Documentation

### Authentication

#### POST /api/auth/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "viewer"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "viewer",
      "status": "active"
    },
    "accessToken": "jwt-token",
    "refreshToken": "jwt-token"
  }
}
```

#### POST /api/auth/login
Login existing user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "jwt-token",
    "refreshToken": "jwt-token"
  }
}
```

#### POST /api/auth/refresh
Refresh access token.

**Request:**
```json
{
  "refreshToken": "jwt-token"
}
```

### Users (Admin Only)

#### GET /api/users
Get all users (paginated).

**Query params:** `page`, `limit`

**Headers:** `Authorization: Bearer <token>`

#### PATCH /api/users/:id/role
Update user role.

**Request:**
```json
{
  "role": "analyst"
}
```

#### PATCH /api/users/:id/status
Update user status.

**Request:**
```json
{
  "status": "inactive"
}
```

### Financial Records

#### POST /api/records
Create a new financial record.

**Permissions:** Analyst, Admin

**Request:**
```json
{
  "amount": 1500.00,
  "type": "income",
  "category": "Salary",
  "date": "2024-03-15",
  "notes": "Monthly salary"
}
```

#### GET /api/records
Get all records (with filters).

**Permissions:** Analyst, Admin

**Query params:** 
- `type`: income | expense
- `category`: string
- `dateFrom`: YYYY-MM-DD
- `dateTo`: YYYY-MM-DD
- `page`: number
- `limit`: number

#### GET /api/records/:id
Get single record by ID.

#### PATCH /api/records/:id
Update a record.

#### DELETE /api/records/:id
Delete a record.

### Dashboard

#### GET /api/dashboard/summary
Get financial summary.

**Permissions:** All authenticated users

**Response:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 15000.00,
    "totalExpense": 8500.00,
    "netBalance": 6500.00,
    "period": "all-time"
  }
}
```

#### GET /api/dashboard/category-breakdown
Get spending by category.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "category": "Rent",
      "total": 3600.00,
      "percentage": 42.35
    },
    ...
  ]
}
```

#### GET /api/dashboard/trends
Get monthly trends.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "month": "2024-01",
      "income": 5500.00,
      "expense": 1700.00,
      "net": 3800.00
    },
    ...
  ]
}
```

#### GET /api/dashboard/recent
Get recent transactions.

**Query params:** `limit` (default: 10)

## 🔐 Role-Based Access Control

### Roles

- **Viewer:** Can only view dashboard data
- **Analyst:** Can view dashboard + manage own financial records
- **Admin:** Full access (user management + all analyst features)

### Permission Matrix

| Endpoint | Viewer | Analyst | Admin |
|----------|--------|---------|-------|
| Dashboard (GET) | ✅ | ✅ | ✅ |
| Records (GET) | ❌ | ✅ | ✅ |
| Records (CREATE/UPDATE/DELETE) | ❌ | ✅ | ✅ |
| Users (GET/UPDATE) | ❌ | ❌ | ✅ |

## 🏛️ Architecture

### Layered Architecture

```
Controller → Service → Repository → Database
     ↓
  Middleware (Auth, RBAC, Validation)
```

**Benefits:**
- Clear separation of concerns
- Easy to test (mock layers)
- Reusable business logic
- Database-agnostic services

### Key Design Patterns

1. **Repository Pattern:** Abstracts data access
2. **Service Layer:** Contains business logic
3. **Middleware Chain:** Auth → Role → Validation → Controller
4. **DTOs:** Request/Response data shaping
5. **Error Handling:** Centralized error middleware

## 🛠️ Development

### Scripts

```bash
npm run dev        # Start development server with hot reload
npm run build      # Compile TypeScript to JavaScript
npm start          # Run production server
npm run lint       # Lint code with ESLint
npm run type-check # Check TypeScript types
```

### Code Style

- **TypeScript strict mode** enabled
- **ESLint** for code quality
- **Functional programming** preferred
- **Async/await** over promises
- **Explicit return types** on functions

## 🚢 Deployment (Vercel)

### Option 1: Deploy Backend on Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Create `vercel.json`:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "src/server.ts",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "src/server.ts"
       }
     ]
   }
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

### Option 2: Other Platforms

- **Railway:** Connect GitHub repo, auto-deploy
- **Render:** Connect repo, set build command
- **Heroku:** Use Procfile

### Environment Variables

Set in deployment platform:
- `NODE_ENV=production`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `FRONTEND_URL` (your deployed frontend URL)

## 🧪 Testing

### Manual Testing with Curl

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","role":"analyst"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get Dashboard (with token)
curl http://localhost:5000/api/dashboard/summary \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📝 License

MIT

## 👥 Contributing

1. Follow the existing code structure
2. Write clean, typed TypeScript
3. Keep controllers thin, services fat
4. Use repositories for all database access
5. Add validation schemas for new endpoints
