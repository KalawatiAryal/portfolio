# File Reference - Complete Guide to All Files

## 📂 Project Structure Overview

```
Sample Web/
├── Backend/                          # Django REST Framework API
│   ├── apps/
│   │   ├── auth_api/                # Authentication APIs
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   ├── urls.py
│   │   │   └── tests.py
│   │   └── portfolio/               # Portfolio/Hero/Newsletter APIs
│   │       ├── models.py
│   │       ├── serializers.py
│   │       ├── views.py
│   │       ├── urls.py
│   │       └── admin.py
│   ├── config/                      # Django configuration
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── manage.py                    # Django management
│   ├── requirements.txt             # Python dependencies
│   ├── db.sqlite3                   # SQLite database
│   ├── HERO_NEWSLETTER_API.md       # Complete API documentation
│   ├── SETUP_DYNAMIC_APIS.md        # Backend setup guide
│   └── QUICK_API_REFERENCE.md       # API quick reference
│
└── Frontend/                         # React + Vite Application
    ├── src/
    │   ├── pages/                   # Page components
    │   │   ├── HomePage.jsx         # ✨ UPDATED: Dynamic hero & newsletter
    │   │   ├── HeroAdmin.jsx        # ✨ NEW: Admin panel
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   └── ...
    │   ├── services/                # API services
    │   │   ├── homeService.js       # ✨ NEW: Hero & Newsletter API
    │   │   ├── authService.js
    │   │   └── ...
    │   ├── components/              # Reusable components
    │   │   ├── ProtectedRoute.jsx   # ✨ NEW: Route protection
    │   │   └── ...
    │   ├── context/                 # React Context
    │   │   ├── AuthContext.jsx
    │   │   └── ...
    │   ├── styles/                  # CSS files
    │   │   ├── HomePage.css         # ✨ UPDATED: Admin link & skeleton
    │   │   ├── HeroAdmin.css        # ✨ NEW: Admin panel styles
    │   │   ├── LoginPage.css
    │   │   ├── RegisterPage.css
    │   │   └── ...
    │   ├── config/                  # Configuration
    │   │   └── env.js               # Environment configuration
    │   ├── App.jsx                  # ✨ UPDATED: Admin route added
    │   ├── App.css
    │   ├── index.css
    │   ├── main.jsx                 # Entry point
    │   └── ...
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    ├── .env                         # Environment variables
    ├── .env.example
    ├── index.html
    ├── FRONTEND_INTEGRATION_COMPLETE.md  # ✨ NEW: Integration guide
    ├── README.md
    └── ...

└── Documentation Files (Root)
    ├── SETUP_AND_RUN.md             # ✨ NEW: Complete setup guide
    ├── QUICK_START.md               # ✨ NEW: 5-minute quick start
    ├── INTEGRATION_SUMMARY.md       # ✨ NEW: What was done
    ├── FEATURES_OVERVIEW.md         # ✨ NEW: Feature details
    ├── FILE_REFERENCE.md            # ✨ NEW: This file
    └── ...
```

---

## 📋 Complete File Listing

### Legend
- ✨ **NEW** = Created in this integration
- 🔄 **UPDATED** = Modified for this integration
- ➖ **EXISTING** = Pre-existing file

---

## Backend Files

### Core Models (`Backend/apps/portfolio/models.py`)
**Status**: ✨ NEW (Created during API setup)
**Purpose**: Define database models for hero sections and newsletter
```python
- HeroSection (title, subtitle, description, buttons)
- HeroStat (label, value, belongs to hero)
- NewsletterSubscriber (email, first_name, subscribed_date)
```

### API Views (`Backend/apps/portfolio/views.py`)
**Status**: ✨ NEW (Created during API setup)
**Purpose**: Define API endpoints and business logic
```python
- HeroSectionViewSet (CRUD operations for heroes)
- NewsletterSubscriberViewSet (Newsletter management)
- Endpoints: 6 total covering hero and newsletter operations
```

### Serializers (`Backend/apps/portfolio/serializers.py`)
**Status**: ✨ NEW (Created during API setup)
**Purpose**: Convert models to JSON for API responses
```python
- HeroStatSerializer (Statistics serialization)
- HeroSectionSerializer (Hero with nested stats)
- NewsletterSubscriberSerializer (Subscriber data)
```

### URL Routing (`Backend/apps/portfolio/urls.py`)
**Status**: ✨ NEW (Created during API setup)
**Purpose**: Map URLs to view functions
```
/api/portfolio/hero/latest/      -> GET latest hero
/api/portfolio/hero/              -> GET/POST all heroes
/api/portfolio/hero/{id}/         -> GET/PUT/DELETE specific hero
/api/portfolio/newsletter/check/  -> GET subscription status
/api/portfolio/newsletter/subscribe/  -> POST subscribe
/api/portfolio/newsletter/unsubscribe/ -> POST unsubscribe
/api/portfolio/newsletter/count/   -> GET subscriber count
```

### Admin Interface (`Backend/apps/portfolio/admin.py`)
**Status**: ✨ NEW (Created during API setup)
**Purpose**: Configure Django admin interface for models
- Registered HeroSection, HeroStat, NewsletterSubscriber
- Configured list displays, filters, search

### Documentation Files

#### `Backend/HERO_NEWSLETTER_API.md` ✨ NEW
**Purpose**: Complete API documentation with examples
**Contents**:
- API endpoint list
- Request/response payloads for each endpoint
- HTTP status codes and error handling
- Use case examples
- Authentication requirements
- Rate limiting info

#### `Backend/SETUP_DYNAMIC_APIS.md` ✨ NEW
**Purpose**: Step-by-step backend setup guide
**Contents**:
- Prerequisites
- Installation instructions
- Database setup
- Model creation
- API implementation
- Testing instructions

#### `Backend/QUICK_API_REFERENCE.md` ✨ NEW
**Purpose**: Quick reference for API endpoints
**Contents**:
- One-line descriptions
- HTTP methods and URLs
- Example payloads
- Expected responses

---

## Frontend Files

### Pages

#### `Frontend/src/pages/HomePage.jsx` 🔄 UPDATED
**Purpose**: Main homepage component
**Changes**:
- Added hero fetching from API
- Added loading skeleton
- Added error fallback handling
- Updated newsletter form with first name field
- Added admin link for staff users
- Added useEffect hook for data fetching
**Key Functions**:
```javascript
- useEffect: Fetch hero on mount
- handleNewsletterSubmit: Subscribe to newsletter
- renderHeroSection: Display dynamic or fallback hero
```

#### `Frontend/src/pages/HeroAdmin.jsx` ✨ NEW
**Purpose**: Admin panel for managing hero sections
**Features**:
- Create new hero sections
- Edit existing heroes
- Add/remove statistics dynamically
- View all heroes in card format
- Form validation
- Staff-only access
**Key Functions**:
```javascript
- fetchHeroes: Load all heroes from API
- handleSubmit: Create or update hero
- handleEdit: Load hero data for editing
- addStat / removeStat: Manage statistics
```

#### `Frontend/src/pages/LoginPage.jsx` ➖ EXISTING
**Purpose**: User login page
**Status**: No changes needed for integration

#### `Frontend/src/pages/RegisterPage.jsx` ➖ EXISTING
**Purpose**: User registration page
**Status**: No changes needed for integration

### Services

#### `Frontend/src/services/homeService.js` ✨ NEW
**Purpose**: Centralized API client for hero and newsletter endpoints
**API Methods**:
```javascript
homeAPI.getHeroSection()              // GET latest hero
homeAPI.getAllHeroSections()          // GET all heroes (admin)
homeAPI.createHeroSection(data)       // POST create hero
homeAPI.updateHeroSection(id, data)   // PUT update hero
homeAPI.subscribeNewsletter(email, firstName)  // POST subscribe
homeAPI.unsubscribeNewsletter(email)  // POST unsubscribe
homeAPI.checkSubscription(email)      // GET subscription status
homeAPI.getSubscriberCount()          // GET total subscribers
```

#### `Frontend/src/services/authService.js` ➖ EXISTING
**Purpose**: Authentication API calls
**Status**: No changes needed for integration

### Components

#### `Frontend/src/components/ProtectedRoute.jsx` ✨ NEW
**Purpose**: Route wrapper for access control
**Features**:
- Checks user authentication
- Optional staff-only requirement
- Redirects unauthorized users
**Usage**:
```javascript
<ProtectedRoute>
  <SomeComponent />
</ProtectedRoute>

<ProtectedRoute requireStaff={true}>
  <AdminComponent />
</ProtectedRoute>
```

### Styles

#### `Frontend/src/styles/HomePage.css` 🔄 UPDATED
**Changes**:
- Added `.admin-link` styles (navbar admin button)
- Added `.loading-skeleton` styles (skeleton loader)
- Added `.skeleton-title` and `.skeleton-text` (shimmer animation)
**New Classes**:
```css
.admin-link            /* Admin button styling */
.loading-skeleton      /* Skeleton container */
.skeleton-title        /* Animated skeleton title */
.skeleton-text         /* Animated skeleton text */
@keyframes shimmer     /* Loading animation */
@keyframes pulse       /* Pulsing animation */
```

#### `Frontend/src/styles/HeroAdmin.css` ✨ NEW
**Purpose**: Complete styling for admin panel
**Components Styled**:
- Admin header
- Form inputs and groups
- Statistics management UI
- Hero cards list
- Action buttons
- Alert messages
- Responsive design

**Key Classes**:
```css
.hero-admin            /* Main container */
.admin-header          /* Page header */
.hero-form             /* Form container */
.form-group            /* Form field group */
.stats-container       /* Statistics list */
.hero-card             /* Hero list item */
.heroes-grid           /* Grid layout */
```

#### `Frontend/src/styles/LoginPage.css` ➖ EXISTING
**Status**: No changes needed

#### `Frontend/src/styles/RegisterPage.css` ➖ EXISTING
**Status**: No changes needed

### Context

#### `Frontend/src/context/AuthContext.jsx` ➖ EXISTING
**Purpose**: Authentication state management
**Status**: No changes needed for integration
**Provides**:
- isAuthenticated state
- user object (with is_staff property)
- login/logout functions

### Configuration

#### `Frontend/src/config/env.js` ➖ EXISTING
**Purpose**: Environment configuration
**Status**: Already has PORTFOLIO_API_URL configured
```javascript
VITE_API_BASE_URL: http://localhost:8000/api/auth
VITE_PORTFOLIO_API_URL: http://localhost:8000/api/portfolio
```

### Main App Files

#### `Frontend/src/App.jsx` 🔄 UPDATED
**Changes**:
- Imported HeroAdmin component
- Added `/admin/hero` route
- Enhanced ProtectedRoute with staff check
**New Route**:
```javascript
<Route 
  path="/admin/hero" 
  element={
    <ProtectedRoute requireStaff={true}>
      <HeroAdmin />
    </ProtectedRoute>
  } 
/>
```

#### `Frontend/src/main.jsx` ➖ EXISTING
**Purpose**: React app entry point
**Status**: No changes needed

#### `Frontend/src/App.css` ➖ EXISTING
**Purpose**: Global app styles
**Status**: No changes needed

#### `Frontend/src/index.css` ➖ EXISTING
**Purpose**: Global styles and resets
**Status**: No changes needed

### Configuration Files

#### `Frontend/package.json` ➖ EXISTING
**Purpose**: Project dependencies and scripts
**Contains**:
- React, React Router, Vite
- Build scripts: dev, build, preview, lint
- Development dependencies

#### `Frontend/.env` ➖ EXISTING
**Purpose**: Environment variables
**Content**:
```env
VITE_API_BASE_URL=http://localhost:8000/api/auth
VITE_PORTFOLIO_API_URL=http://localhost:8000/api/portfolio
```

#### `Frontend/.env.example` ➖ EXISTING
**Purpose**: Template for .env file

#### `Frontend/vite.config.js` ➖ EXISTING
**Purpose**: Vite bundler configuration

#### `Frontend/index.html` ➖ EXISTING
**Purpose**: HTML entry point

---

## Documentation Files (Root)

#### `Backend/HERO_NEWSLETTER_API.md` ✨ NEW
**Purpose**: Complete backend API documentation
**Sections**:
- Overview of APIs
- Detailed endpoint documentation
- Request/response formats
- HTTP status codes
- Error handling
- Examples for each endpoint

#### `Backend/SETUP_DYNAMIC_APIS.md` ✨ NEW
**Purpose**: Backend setup instructions
**Sections**:
- Prerequisites
- Installation steps
- Database setup
- Django app configuration
- Model creation
- API implementation
- Testing guide

#### `Backend/QUICK_API_REFERENCE.md` ✨ NEW
**Purpose**: Quick reference guide
**Format**: Compact table with all endpoints

#### `Frontend/FRONTEND_INTEGRATION_COMPLETE.md` ✨ NEW
**Purpose**: Frontend integration guide
**Sections**:
- What's new
- Architecture overview
- Usage guide
- API integration details
- Configuration
- Error handling
- Testing guide
- File listing

#### `SETUP_AND_RUN.md` ✨ NEW
**Purpose**: Complete project setup and run guide
**Sections**:
- Backend setup (step-by-step)
- Frontend setup (step-by-step)
- Running the project
- Testing procedures
- Troubleshooting guide
- Project structure

#### `QUICK_START.md` ✨ NEW
**Purpose**: 5-minute quick start
**Contents**:
- Quick setup commands
- Access points
- 5-step quick test
- Important files
- Troubleshooting
- Verification checklist

#### `INTEGRATION_SUMMARY.md` ✨ NEW
**Purpose**: Complete integration overview
**Sections**:
- What was done
- Architecture diagram
- File structure
- Key features
- Data flow examples
- Testing checklist
- Next steps

#### `FEATURES_OVERVIEW.md` ✨ NEW
**Purpose**: Detailed feature overview
**Sections**:
- Core features explanation
- UI features
- Responsive design details
- Data flow architecture
- Error handling
- Configuration
- Performance optimizations
- Security features

#### `FILE_REFERENCE.md` ✨ NEW
**Purpose**: This file - complete file reference

---

## File Dependencies

### Frontend Dependencies

```
App.jsx
├── HomePage.jsx
│   ├── homeService.js
│   ├── AuthContext.jsx
│   └── HomePage.css
├── HeroAdmin.jsx
│   ├── homeService.js
│   ├── AuthContext.jsx
│   ├── ProtectedRoute.jsx
│   └── HeroAdmin.css
├── LoginPage.jsx
├── RegisterPage.jsx
└── ProtectedRoute.jsx
```

### Component Import Chain

```
HomePage.jsx
  ├── React hooks (useEffect, useState)
  ├── useAuth (AuthContext)
  ├── useNavigate (React Router)
  ├── homeService (API calls)
  └── styles (HomePage.css)

HeroAdmin.jsx
  ├── React hooks
  ├── useAuth
  ├── useNavigate
  ├── homeService
  └── styles (HeroAdmin.css)

homeService.js
  └── fetch API (native)
```

---

## Environment Variables

### Frontend `.env`
```env
# Portfolio API endpoint
VITE_PORTFOLIO_API_URL=http://localhost:8000/api/portfolio

# Auth API endpoint
VITE_API_BASE_URL=http://localhost:8000/api/auth
```

### Backend `.env` (if created)
```env
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
JWT_SECRET_KEY=your-jwt-secret
```

---

## API Endpoint Files

### Hero Endpoints
- **Model**: `Backend/apps/portfolio/models.py` (HeroSection)
- **Serializer**: `Backend/apps/portfolio/serializers.py` (HeroSectionSerializer)
- **Views**: `Backend/apps/portfolio/views.py` (HeroSectionViewSet)
- **URLs**: `Backend/apps/portfolio/urls.py`

### Newsletter Endpoints
- **Model**: `Backend/apps/portfolio/models.py` (NewsletterSubscriber)
- **Serializer**: `Backend/apps/portfolio/serializers.py` (NewsletterSubscriberSerializer)
- **Views**: `Backend/apps/portfolio/views.py` (NewsletterSubscriberViewSet)
- **URLs**: `Backend/apps/portfolio/urls.py`

---

## Usage Guide by File

### To Create a Hero Section
1. **Admin**: Go to `HeroAdmin.jsx` (accessed via HomePage)
2. **API**: Uses `homeService.js` → `createHeroSection()`
3. **Backend**: Hits `Backend/apps/portfolio/views.py` → `create()` method
4. **Database**: Stores in `Backend/apps/portfolio/models.py` → HeroSection

### To Display Hero on Homepage
1. **Component**: `HomePage.jsx` fetches on mount
2. **Service**: Calls `homeService.getHeroSection()`
3. **Backend**: `views.py` → `latest()` endpoint
4. **Return**: JSON data rendered in JSX

### To Subscribe Newsletter
1. **Form**: Newsletter form in `HomePage.jsx`
2. **Service**: Calls `homeService.subscribeNewsletter()`
3. **Backend**: `views.py` → `create()` in NewsletterViewSet
4. **Database**: Stores in `NewsletterSubscriber` model

---

## Testing Files

### Backend Tests
- Location: `Backend/apps/portfolio/tests.py` (if exists)
- Run: `python manage.py test`

### Frontend Tests
- Location: Would be in `Frontend/src/__tests__/` (if created)
- Run: `npm test` (if configured)

---

## Build & Distribution

### Frontend Build Output
- **Source**: `Frontend/src/**/*.jsx` and `Frontend/src/**/*.css`
- **Output**: `Frontend/dist/`
- **Command**: `npm run build`
- **Size**: ~200KB gzipped

### Backend
- **Framework**: Django REST Framework
- **Database**: SQLite (default) or PostgreSQL
- **Server**: Django development server or production WSGI server

---

## Maintenance Files

### Version Control
- `.gitignore` - Excludes files from git
- Node: `node_modules/`, `.env`, `dist/`
- Python: `venv/`, `__pycache__/`, `*.pyc`

### Dependencies
- Frontend: `package.json`, `package-lock.json`
- Backend: `requirements.txt`

---

## Documentation Hierarchy

```
Quick Start
    ↓
FEATURES_OVERVIEW.md / INTEGRATION_SUMMARY.md
    ↓
SETUP_AND_RUN.md / FRONTEND_INTEGRATION_COMPLETE.md
    ↓
API Documentation (Backend & Frontend)
    ↓
Individual Component Documentation (inline comments)
```

---

## File Modification Summary

| File | Status | Reason |
|------|--------|--------|
| HomePage.jsx | 🔄 UPDATED | Added dynamic hero, newsletter, admin link |
| App.jsx | 🔄 UPDATED | Added admin route |
| HomePage.css | 🔄 UPDATED | Added skeleton and admin link styles |
| HeroAdmin.jsx | ✨ NEW | Admin panel for heroes |
| HeroAdmin.css | ✨ NEW | Admin panel styling |
| homeService.js | ✨ NEW | API client |
| ProtectedRoute.jsx | ✨ NEW | Route protection |
| 5 Documentation files | ✨ NEW | Complete guides |

---

## Quick File Lookup

### I need to...
| Task | File Location |
|------|---------------|
| Edit hero display on homepage | `Frontend/src/pages/HomePage.jsx` |
| Create/edit hero admin form | `Frontend/src/pages/HeroAdmin.jsx` |
| Modify API calls | `Frontend/src/services/homeService.js` |
| Change hero API endpoint | `Backend/apps/portfolio/views.py` |
| Update database models | `Backend/apps/portfolio/models.py` |
| Change admin styling | `Frontend/src/styles/HeroAdmin.css` |
| Change homepage styling | `Frontend/src/styles/HomePage.css` |
| Setup new frontend | `SETUP_AND_RUN.md` → Frontend section |
| Setup new backend | `SETUP_AND_RUN.md` → Backend section |
| Understand features | `FEATURES_OVERVIEW.md` |
| Quick start | `QUICK_START.md` |

---

## Statistics

### Files Created: 8
- 3 React components
- 1 API service
- 2 CSS files
- 2 Documentation files

### Files Updated: 3
- 2 React components
- 1 CSS file

### Total New Lines: ~2,500+
- Frontend: ~1,200 lines
- Backend: ~1,300 lines (from API setup)
- Documentation: ~3,000+ lines

---

**Last Updated**: August 5, 2026
**Status**: ✓ Complete Reference
