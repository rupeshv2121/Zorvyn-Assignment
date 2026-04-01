# Finance Dashboard Frontend

Modern Finance Dashboard built with React, TypeScript, and Tailwind CSS.

## 🏗️ Tech Stack

- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:**
  - React Query (TanStack Query) - Server state
  - Zustand - Client state
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Routing:** React Router v6
- **Notifications:** React Hot Toast
- **Date Handling:** date-fns

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/        # Reusable UI components (Button, Card, Input, etc.)
│   │   ├── layout/        # Layout components (Navbar, Sidebar, Layout)
│   │   ├── charts/        # Chart components (CategoryPie, TrendsLine, etc.)
│   │   └── records/       # Record-specific components
│   ├── pages/             # Page components (routes)
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── RecordsPage.tsx
│   │   └── AdminPage.tsx
│   ├── hooks/             # Custom React hooks
│   ├── services/api/      # API communication layer
│   ├── store/             # Zustand stores
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Backend server running (see backend README)

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   App will run on `http://localhost:5173`

## 🎨 Features

### Authentication
- Login/Register pages
- JWT token management
- Automatic token refresh
- Protected routes

### Dashboard
- Financial summary cards (income, expense, balance)
- Category breakdown pie chart
- Monthly trends line chart
- Recent transactions

### Records Management
- Create/Edit/Delete records
- Filter by date, category, type
- Pagination
- Search functionality

### User Management (Admin Only)
- View all users
- Update user roles
- Activate/Deactivate users

### Role-Based UI
- Dynamic navigation based on user role
- Conditional component rendering
- Access control enforcement

## 🎯 User Roles & Permissions

### Viewer
- ✅ View dashboard
- ❌ Manage records
- ❌ User management

### Analyst
- ✅ View dashboard
- ✅ Manage own records
- ❌ User management

### Admin
- ✅ Full access to all features
- ✅ User management
- ✅ All analyst features

## 🛠️ Development

### Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Lint code
npm run type-check # Check TypeScript types
```

### Code Organization

#### Components
- Keep components small and focused
- Use TypeScript interfaces for props
- Prefer functional components with hooks

#### State Management
- **React Query:** API data fetching, caching
- **Zustand:** Auth state, UI state (modals, theme)

#### API Calls
- All API calls in `services/api/`
- Use React Query hooks in components
- Axios interceptors for auth headers

## 🚢 Deployment (Vercel)

### Quick Deploy

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Build project:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Vercel Dashboard

1. Connect GitHub repository
2. Set framework preset: **Vite**
3. Set environment variables:
   - `VITE_API_URL`: Your deployed backend URL

### Other Platforms

#### Netlify
```bash
npm run build
# Deploy dist/ folder
```

#### GitHub Pages
```bash
npm run build
# Deploy dist/ folder to gh-pages branch
```

## 📱 Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interactions
- Optimized for tablets and phones

## 🎨 Tailwind CSS

### Custom Configuration

Tailwind is configured with:
- Custom color palette
- Utility classes for buttons, cards, inputs
- Responsive breakpoints
- Dark mode support (optional)

### Usage Example

```tsx
<button className="btn btn-primary">
  Click Me
</button>

<div className="card">
  <h2 className="text-2xl font-bold">Title</h2>
</div>

<input className="input" placeholder="Enter text" />
```

## 🧪 Testing

### Manual Testing

1. Start backend server
2. Start frontend dev server
3. Login with test credentials:
   - `admin@example.com` / `password123`
   - `analyst@example.com` / `password123`
   - `viewer@example.com` / `password123`

### Test Scenarios

- [ ] Login with different roles
- [ ] View dashboard summary
- [ ] Create income record (analyst/admin)
- [ ] Filter records by date
- [ ] View charts
- [ ] Update user role (admin)
- [ ] Logout and token expiry

## 📊 Charts

Using Recharts library:
- **Pie Chart:** Category breakdown
- **Line Chart:** Monthly income/expense trends
- **Bar Chart:** Custom data visualization

## 🔐 Security

- XSS protection (React escaping)
- CSRF token handling
- Secure token storage
- HTTP-only cookies for refresh tokens
- Environment variable for API URL

## 📝 License

MIT

## 👥 Contributing

1. Follow existing code structure
2. Use TypeScript strictly
3. Follow Tailwind utility-first approach
4. Keep components reusable
5. Add proper error handling
