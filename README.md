# Portfolio Website - Full Stack Application

A modern, full-stack portfolio website built with React (frontend) and Django (backend) with complete JWT authentication system.

## 🎯 Project Overview

### What's Included

✅ **Frontend (React + Vite)**
- Beautiful responsive homepage
- Complete authentication system (Login/Register)
- Modern UI with gradient design
- Mobile-friendly interface
- Environment-based configuration

✅ **Backend (Django REST Framework)**
- JWT-based authentication
- User registration and login
- Portfolio management (Projects, Skills, Experience)
- Contact form
- Admin dashboard
- Interactive API documentation

✅ **Database**
- SQLite (included)
- Pre-configured models
- Ready to migrate to PostgreSQL

✅ **Authentication**
- User registration with validation
- JWT token-based login
- Automatic token refresh
- Secure password storage
- Profile management

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm

### Run Backend (Terminal 1)

```bash
cd "c:\Users\Dell\Downloads\Sample Web\Backend"
venv\Scripts\activate
python manage.py runserver
```

Backend runs at: **http://localhost:8000**

### Run Frontend (Terminal 2)

```bash
cd "c:\Users\Dell\Downloads\Sample Web\Frontend"
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

### Access Application

- **Homepage:** http://localhost:5173
- **Login:** http://localhost:5173/login
- **Register:** http://localhost:5173/register
- **Admin:** http://localhost:8000/admin
- **API Docs:** http://localhost:8000/api/docs

### Test Credentials

```
Username: kala
Password: Kala@1234
```

---

## 📁 Project Structure

```
Sample Web/
├── Backend/
│   ├── config/                  # Django configuration
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── apps/
│   │   ├── auth_api/           # Authentication app
│   │   │   ├── models.py
│   │   │   ├── views.py
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   └── authentication.py
│   │   └── portfolio/          # Portfolio app
│   │       ├── models.py
│   │       ├── views.py
│   │       ├── serializers.py
│   │       └── urls.py
│   ├── manage.py
│   ├── requirements.txt
│   ├── db.sqlite3
│   ├── README.md
│   ├── API_TESTING_GUIDE.md
│   └── venv/
│
└── Frontend/
    ├── src/
    │   ├── pages/              # React pages
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   └── RegisterPage.jsx
    │   ├── context/            # State management
    │   │   └── AuthContext.jsx
    │   ├── services/           # API services
    │   │   ├── authService.js
    │   │   └── portfolioService.js
    │   ├── config/             # Configuration
    │   │   └── env.js
    │   ├── styles/             # CSS files
    │   │   ├── LoginPage.css
    │   │   ├── RegisterPage.css
    │   │   └── HomePage.css
    │   └── App.jsx
    ├── .env                    # Environment variables
    ├── .env.example            # Environment template
    ├── .env.production         # Production config
    ├── package.json
    ├── vite.config.js
    ├── AUTHENTICATION_SETUP.md
    ├── ENV_SETUP.md
    └── node_modules/

├── RUN_PROJECT.md              # Detailed run guide
├── STARTUP_GUIDE.md            # Quick startup guide
└── README.md                   # This file
```

---

## 🔑 Key Features

### Authentication
- ✅ User registration with validation
- ✅ Secure login with JWT tokens
- ✅ Automatic token refresh
- ✅ Password change functionality
- ✅ Profile management
- ✅ Logout with token invalidation

### Portfolio Management
- ✅ Create/Edit/Delete projects
- ✅ Manage skills with proficiency levels
- ✅ Track work experience
- ✅ Contact form submissions

### API Features
- ✅ RESTful API design
- ✅ JWT authentication
- ✅ CORS enabled
- ✅ Pagination support
- ✅ Filtering and search
- ✅ Interactive API documentation

### Frontend Features
- ✅ Responsive design
- ✅ Modern gradient UI
- ✅ Smooth animations
- ✅ Error handling
- ✅ Loading states
- ✅ Form validation
- ✅ Token persistence

---

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/register/         - Register new user
POST   /api/auth/login/            - Login user
POST   /api/auth/refresh-token/    - Refresh access token
GET    /api/auth/me/               - Get current user
PUT    /api/auth/update-profile/   - Update profile
POST   /api/auth/change-password/  - Change password
POST   /api/auth/logout/           - Logout
```

### Portfolio
```
GET    /api/portfolio/projects/         - List projects
POST   /api/portfolio/projects/         - Create project
GET    /api/portfolio/projects/{id}/    - Get project
PUT    /api/portfolio/projects/{id}/    - Update project
DELETE /api/portfolio/projects/{id}/    - Delete project

GET    /api/portfolio/skills/       - List skills
POST   /api/portfolio/skills/       - Create skill

GET    /api/portfolio/experiences/  - List experiences
POST   /api/portfolio/experiences/  - Create experience

POST   /api/portfolio/contacts/     - Submit contact
```

---

## 🔧 Environment Configuration

### Development (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api/auth
VITE_PORTFOLIO_API_URL=http://localhost:8000/api/portfolio
```

### Production (.env.production)
```env
VITE_API_BASE_URL=https://your-domain.com/api/auth
VITE_PORTFOLIO_API_URL=https://your-domain.com/api/portfolio
```

---

## 🛠️ Available Commands

### Backend
```bash
python manage.py runserver           # Start dev server
python manage.py makemigrations      # Create migrations
python manage.py migrate             # Apply migrations
python manage.py createsuperuser     # Create admin
python manage.py test                # Run tests
python manage.py shell               # Django shell
```

### Frontend
```bash
npm run dev                           # Start dev server
npm run build                         # Build for production
npm run preview                       # Preview production
npm install <package>                # Install package
npm update                            # Update packages
```

---

## 📖 Documentation

- **[RUN_PROJECT.md](RUN_PROJECT.md)** - Comprehensive run guide with troubleshooting
- **[STARTUP_GUIDE.md](STARTUP_GUIDE.md)** - Quick step-by-step startup
- **[Backend/README.md](Backend/README.md)** - Backend documentation
- **[Backend/API_TESTING_GUIDE.md](Backend/API_TESTING_GUIDE.md)** - API testing examples
- **[Frontend/AUTHENTICATION_SETUP.md](Frontend/AUTHENTICATION_SETUP.md)** - Auth setup details
- **[Frontend/ENV_SETUP.md](Frontend/ENV_SETUP.md)** - Environment setup guide

---

## 🔒 Security Features

- ✅ JWT token-based authentication
- ✅ Password hashing with Django's built-in system
- ✅ CORS protection
- ✅ Environment variable management
- ✅ SQL injection protection (ORM)
- ✅ CSRF protection
- ✅ Secure password validation

---

## 🧪 Testing

### Test Login
1. Visit http://localhost:5173/login
2. Enter: `kala` / `Kala@1234`
3. Click "Sign In"

### Test Registration
1. Visit http://localhost:5173/register
2. Fill form and submit
3. Auto-login on success

### Test API
1. Visit http://localhost:8000/api/docs/
2. Try endpoints interactively
3. Check response format

---

## 🚀 Deployment

### Backend Deployment
1. Change `DEBUG=False` in settings
2. Update `SECRET_KEY`
3. Configure database (PostgreSQL)
4. Set `ALLOWED_HOSTS`
5. Collect static files: `python manage.py collectstatic`
6. Use production WSGI server (Gunicorn)

### Frontend Deployment
1. Update `.env.production` with actual domain
2. Build: `npm run build`
3. Deploy `dist/` folder to hosting
4. Configure server for SPA routing

---

## 🐛 Troubleshooting

### Backend Issues
- **Django not found:** Activate virtual environment
- **Port in use:** Run on different port with `python manage.py runserver 8001`
- **Database errors:** Run `python manage.py migrate`

### Frontend Issues
- **npm not found:** Restart terminal after Node.js installation
- **Port in use:** Run on different port with `npm run dev -- --port 5174`
- **API errors:** Check Network tab in DevTools

### Common Issues
- **CORS errors:** Backend needs to be running on port 8000
- **Login not working:** Check credentials and backend status
- **Tokens not saving:** Check localStorage is enabled

See [RUN_PROJECT.md](RUN_PROJECT.md) for detailed troubleshooting.

---

## 📦 Technology Stack

### Frontend
- React 18
- Vite
- React Router
- CSS3 with animations
- fetch API

### Backend
- Django 4.2
- Django REST Framework
- JWT (PyJWT)
- SQLite / PostgreSQL
- CORS

### Development Tools
- npm
- pip
- Virtual Environment

---

## 🤝 Contributing

To add features:
1. Create a new branch
2. Make changes
3. Test thoroughly
4. Commit with clear messages
5. Create pull request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 📞 Support

If you encounter issues:
1. Check the [RUN_PROJECT.md](RUN_PROJECT.md) troubleshooting section
2. Review the relevant documentation file
3. Check browser console (F12) for errors
4. Check terminal output for server errors
5. Verify both backend and frontend are running

---

## 🎯 Next Steps

After running the project:
1. ✅ Test login with demo account
2. ✅ Create new account via registration
3. ✅ Explore admin panel
4. ✅ Check API documentation
5. ✅ Customize design and features
6. ✅ Add more portfolio content
7. ✅ Deploy to production

---

## 📈 Future Enhancements

Potential features to add:
- [ ] Email verification
- [ ] Password reset
- [ ] Social login (Google, GitHub)
- [ ] Image uploads
- [ ] Blog functionality
- [ ] Analytics dashboard
- [ ] Notifications
- [ ] Dark mode
- [ ] Comments system
- [ ] Search functionality

---

## ✅ Checklist Before Production

- [ ] Change `SECRET_KEY` in Django settings
- [ ] Set `DEBUG=False`
- [ ] Update `ALLOWED_HOSTS`
- [ ] Configure PostgreSQL
- [ ] Update `.env.production`
- [ ] Test all authentication flows
- [ ] Test all API endpoints
- [ ] Set up HTTPS
- [ ] Configure domain
- [ ] Set up error logging
- [ ] Set up monitoring
- [ ] Backup database strategy

---

**Happy coding! 🚀**

For a quick start, read [STARTUP_GUIDE.md](STARTUP_GUIDE.md)
#   p o r t f o l i o  
 