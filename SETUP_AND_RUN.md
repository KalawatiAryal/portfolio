# Complete Setup & Run Guide

This guide walks you through setting up and running both the backend and frontend of the portfolio application with dynamic hero and newsletter APIs.

## Table of Contents
1. [Backend Setup](#backend-setup)
2. [Frontend Setup](#frontend-setup)
3. [Running the Project](#running-the-project)
4. [Testing](#testing)
5. [Troubleshooting](#troubleshooting)

---

## Backend Setup

### Prerequisites
- Python 3.8+
- pip (Python package manager)
- PostgreSQL or SQLite (SQLite for development)

### Step 1: Navigate to Backend
```powershell
cd "c:\Users\Dell\Downloads\Sample Web\Backend"
```

### Step 2: Create Virtual Environment
```powershell
python -m venv venv
```

### Step 3: Activate Virtual Environment
```powershell
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# Windows CMD
venv\Scripts\activate.bat
```

### Step 4: Install Dependencies
```powershell
pip install -r requirements.txt
```

**Note:** If `psycopg2-binary` fails on Windows, it's safe to skip. The project uses SQLite by default for development.

### Step 5: Configure Environment
Create/Update `.env` file:
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
JWT_SECRET_KEY=your-jwt-secret-key
```

### Step 6: Apply Migrations
```powershell
python manage.py makemigrations
python manage.py migrate
```

### Step 7: Create Superuser (Admin)
```powershell
python manage.py createsuperuser
```

Example:
```
Username: admin
Email: admin@example.com
Password: admin123
Password (again): admin123
```

**Important:** This admin user will have `is_staff=True` needed for accessing the HeroAdmin page.

### Step 8: Start Backend Server
```powershell
python manage.py runserver 8000
```

Expected output:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

Backend is now running at `http://localhost:8000`

---

## Frontend Setup

### Prerequisites
- Node.js 16+
- npm (comes with Node.js)

### Step 1: Navigate to Frontend (New Terminal)
```powershell
cd "c:\Users\Dell\Downloads\Sample Web\Frontend"
```

### Step 2: Install Dependencies
```powershell
npm install
```

### Step 3: Configure Environment
Check/Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8000/api/auth
VITE_PORTFOLIO_API_URL=http://localhost:8000/api/portfolio
```

These should already be set, but verify they match your backend URLs.

### Step 4: Start Frontend Dev Server
```powershell
npm run dev
```

Expected output:
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

Frontend is now running at `http://localhost:5173`

---

## Running the Project

### Complete Workflow

**Terminal 1 - Backend:**
```powershell
cd "c:\Users\Dell\Downloads\Sample Web\Backend"
.\venv\Scripts\Activate.ps1  # Activate virtual environment
python manage.py runserver 8000
```

**Terminal 2 - Frontend:**
```powershell
cd "c:\Users\Dell\Downloads\Sample Web\Frontend"
npm run dev
```

### Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | User interface |
| Backend API | http://localhost:8000 | REST API |
| Django Admin | http://localhost:8000/admin | Admin panel |
| API Docs | http://localhost:8000/api/schema/swagger | API documentation |

---

## Testing

### Test 1: Verify Backend APIs

**Using Browser or Postman:**

1. **Get Latest Hero:**
   ```
   GET http://localhost:8000/api/portfolio/hero/latest/
   ```
   Expected: 200 OK with hero data or 404 if none created

2. **Subscribe to Newsletter:**
   ```
   POST http://localhost:8000/api/portfolio/newsletter/subscribe/
   Content-Type: application/json
   
   {
     "email": "test@example.com",
     "first_name": "Test"
   }
   ```
   Expected: 201 Created with message

### Test 2: Homepage Dynamic Content

1. Open `http://localhost:5173`
2. Homepage should load with hero section
3. If no hero exists in DB, shows default content
4. Newsletter form should be visible

### Test 3: Admin Access

1. Click "Sign Up" → Register new account
2. Open Django Admin: `http://localhost:8000/admin`
3. Login with superuser (admin/admin123)
4. Find the registered user
5. Check `is_staff` checkbox
6. Save
7. Go back to homepage and login with that user
8. "Admin" link should appear in navbar
9. Click "Admin" → Should go to `/admin/hero`

### Test 4: Create Hero Section

1. Go to Admin: `http://localhost:5173/admin/hero`
2. Fill form:
   ```
   Title: Hello, I'm Kala
   Subtitle: Full-Stack Developer
   Description: I build modern web applications...
   Primary Button: Get Started
   Secondary Button: Sign In
   Statistics:
     - Label: Active Users, Value: 1000+
     - Label: Projects, Value: 5000+
   ```
3. Click "Create Hero"
4. Should show success message
5. Hero appears in list below

### Test 5: Homepage Reflects Changes

1. Go back to `http://localhost:5173`
2. Refresh page
3. Hero content should update with created hero
4. Stats should display correctly

### Test 6: Newsletter Subscription

1. Scroll to newsletter section
2. Enter:
   ```
   Name: John Doe
   Email: john@example.com
   ```
3. Click "Subscribe"
4. Should show success message
5. Check Django Admin: Portfolio > Newsletter Subscribers
6. New entry should appear

---

## Troubleshooting

### Backend Issues

**Error: "psycopg2-binary" failed to install**
- Solution: It's optional. Remove from requirements.txt if using SQLite
- SQLite is the default database for development

**Error: "Port 8000 already in use"**
- Solution: Kill the process or use different port:
```powershell
python manage.py runserver 8001
```

**Error: "Module not found"**
- Solution: Make sure virtual environment is activated
```powershell
.\venv\Scripts\Activate.ps1
```

**Error: "Migrations pending"**
- Solution: Run migrations:
```powershell
python manage.py migrate
```

**Admin user can't access admin panel**
- Solution: Ensure `is_staff=True` is checked in Django Admin

### Frontend Issues

**Error: "Cannot find module"**
- Solution: Install dependencies:
```powershell
npm install
```

**Error: "Port 5173 already in use"**
- Solution: Frontend will auto-select next available port, or:
```powershell
npm run dev -- --port 5174
```

**"Admin link not showing"**
- Solution: 
  1. User must be logged in
  2. User must have `is_staff=True`
  3. Try logout/login again
  4. Check browser console for errors

**"API calls failing"**
- Solution:
  1. Verify backend is running on port 8000
  2. Check `.env` file API URLs
  3. Check browser console for error messages
  4. Verify CORS settings in backend

**"Hero content not loading"**
- Solution:
  1. Check backend console for errors
  2. No heroes created yet? Create one via admin
  3. Check if API endpoint returns data: 
  ```
  GET http://localhost:8000/api/portfolio/hero/latest/
  ```

### Database Issues

**Error: "database is locked" (SQLite)**
- Solution: Close any other processes accessing the database:
```powershell
# Close all terminals and restart
```

**Need to reset database:**
```powershell
# Delete db.sqlite3
Remove-Item db.sqlite3

# Run migrations again
python manage.py migrate
python manage.py createsuperuser
```

---

## Project Structure

```
Sample Web/
├── Backend/
│   ├── apps/
│   │   ├── auth_api/          # Authentication
│   │   └── portfolio/         # Portfolio APIs (NEW)
│   ├── config/                # Django configuration
│   ├── manage.py
│   ├── requirements.txt
│   └── db.sqlite3
│
└── Frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── HomePage.jsx    # Updated with dynamic content
    │   │   ├── HeroAdmin.jsx   # NEW Admin panel
    │   │   ├── LoginPage.jsx
    │   │   └── RegisterPage.jsx
    │   ├── services/
    │   │   ├── authService.js
    │   │   └── homeService.js  # NEW API service
    │   ├── styles/
    │   │   ├── HomePage.css    # Updated
    │   │   └── HeroAdmin.css   # NEW Admin styles
    │   ├── components/
    │   │   └── ProtectedRoute.jsx  # NEW Route protection
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── config/
    │   │   └── env.js          # Configuration
    │   └── App.jsx             # Updated with admin route
    ├── package.json
    └── .env
```

---

## API Endpoints Summary

### Portfolio Endpoints (Dynamic)
```
GET    /api/portfolio/hero/latest/
GET    /api/portfolio/hero/
POST   /api/portfolio/hero/
PUT    /api/portfolio/hero/{id}/
GET    /api/portfolio/hero/{id}/

GET    /api/portfolio/newsletter/check/?email=...
POST   /api/portfolio/newsletter/subscribe/
POST   /api/portfolio/newsletter/unsubscribe/
GET    /api/portfolio/newsletter/count/
```

### Auth Endpoints
```
POST   /api/auth/register/
POST   /api/auth/login/
POST   /api/auth/logout/
GET    /api/auth/me/
POST   /api/auth/refresh/
```

See `Backend/HERO_NEWSLETTER_API.md` for detailed payload examples.

---

## Next Steps

1. **Customize Hero Content**
   - Create multiple hero sections in admin
   - Test switching between them

2. **Add More Features**
   - Delete hero functionality
   - Hero scheduling/publishing
   - Newsletter analytics
   - Email notifications on subscribe

3. **Production Deployment**
   - Set up with production database (PostgreSQL)
   - Configure environment variables
   - Deploy to hosting service
   - Update API URLs in `.env`

4. **Security**
   - Set `DEBUG=False` in production
   - Use strong JWT secret keys
   - Enable HTTPS
   - Configure CSRF settings

---

## Quick Reference

### Start Both Services (New Terminals)
```powershell
# Terminal 1 - Backend
cd "c:\Users\Dell\Downloads\Sample Web\Backend"
.\venv\Scripts\Activate.ps1
python manage.py runserver 8000

# Terminal 2 - Frontend
cd "c:\Users\Dell\Downloads\Sample Web\Frontend"
npm run dev
```

### Access Points
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Admin Panel: http://localhost:5173/admin/hero (after login as staff)

### Key Files to Know
- Backend models: `Backend/apps/portfolio/models.py`
- Backend views: `Backend/apps/portfolio/views.py`
- Frontend API service: `Frontend/src/services/homeService.js`
- Frontend admin: `Frontend/src/pages/HeroAdmin.jsx`

---

**Status**: ✓ Complete setup guide
**Last Updated**: August 5, 2026
