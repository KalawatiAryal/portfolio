# Portfolio Backend API

A Django REST Framework backend for a portfolio website with user authentication and portfolio management.

## Features

✅ **JWT Authentication**
- User registration and login
- Secure token-based authentication
- Refresh token mechanism
- Password change functionality

✅ **Portfolio Management**
- Create, read, update, delete (CRUD) projects
- Manage skills and proficiency levels
- Track work experience
- Contact form integration

✅ **API Documentation**
- Swagger UI documentation
- OpenAPI schema

✅ **Security Features**
- CORS configuration for frontend integration
- JWT tokens for stateless authentication
- Django security middleware

## Tech Stack

- Django 4.2.8
- Django REST Framework 3.14.0
- JWT (PyJWT) for authentication
- SQLite (default) or PostgreSQL
- django-cors-headers for CORS support
- drf-spectacular for API documentation

## Project Structure

```
Backend/
├── config/                 # Project configuration
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── auth_api/           # Authentication app
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── authentication.py
│   │   └── urls.py
│   └── portfolio/          # Portfolio app
│       ├── models.py
│       ├── views.py
│       ├── serializers.py
│       └── urls.py
├── manage.py
├── requirements.txt
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Navigate to the project directory:**
```bash
cd Backend
```

2. **Create a virtual environment:**
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Create .env file:**
```bash
cp .env.example .env
```

Edit `.env` and update sensitive values (SECRET_KEY, JWT_SECRET, etc.)

5. **Run migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

6. **Create a superuser:**
```bash
python manage.py createsuperuser
```

7. **Run the development server:**
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/register/` - Register a new user
- `POST /api/auth/login/` - Login and get tokens
- `POST /api/auth/refresh-token/` - Refresh access token
- `GET /api/auth/me/` - Get current user info
- `PUT /api/auth/update-profile/` - Update user profile
- `POST /api/auth/change-password/` - Change password
- `POST /api/auth/logout/` - Logout (token invalidation)

### Portfolio Endpoints

**Projects:**
- `GET /api/portfolio/projects/` - List all projects
- `POST /api/portfolio/projects/` - Create a new project
- `GET /api/portfolio/projects/{id}/` - Get project details
- `PUT /api/portfolio/projects/{id}/` - Update a project
- `DELETE /api/portfolio/projects/{id}/` - Delete a project
- `GET /api/portfolio/projects/featured/` - Get featured projects

**Skills:**
- `GET /api/portfolio/skills/` - List all skills
- `POST /api/portfolio/skills/` - Create a new skill
- `GET /api/portfolio/skills/{id}/` - Get skill details
- `PUT /api/portfolio/skills/{id}/` - Update a skill
- `DELETE /api/portfolio/skills/{id}/` - Delete a skill

**Experience:**
- `GET /api/portfolio/experiences/` - List all experiences
- `POST /api/portfolio/experiences/` - Create new experience
- `GET /api/portfolio/experiences/{id}/` - Get experience details
- `PUT /api/portfolio/experiences/{id}/` - Update experience
- `DELETE /api/portfolio/experiences/{id}/` - Delete experience
- `GET /api/portfolio/experiences/current/` - Get current positions

**Contact:**
- `POST /api/portfolio/contacts/` - Submit a contact message
- `GET /api/portfolio/contacts/recent/` - Get contact count

## API Documentation

Visit `http://localhost:8000/api/docs/` for interactive Swagger documentation

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Example Login Request

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your_username",
    "password": "your_password"
  }'
```

### Example Response

```json
{
  "message": "Login successful.",
  "user": {
    "id": 1,
    "username": "your_username",
    "email": "your_email@example.com",
    "first_name": "Your",
    "last_name": "Name",
    "profile": {
      "bio": null,
      "location": null
    }
  },
  "tokens": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "expires_in": 86400
  }
}
```

## Available Commands

```bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run tests
python manage.py test

# Create admin user
python manage.py createsuperuser

# Run development server
python manage.py runserver

# Collect static files (production)
python manage.py collectstatic

# Shell access
python manage.py shell
```

## Production Deployment

1. **Update settings for production:**
   - Set `DEBUG=False` in `.env`
   - Change `SECRET_KEY` to a strong value
   - Update `ALLOWED_HOSTS`
   - Configure a production database (PostgreSQL recommended)

2. **Collect static files:**
```bash
python manage.py collectstatic --noinput
```

3. **Use a production WSGI server** (e.g., Gunicorn):
```bash
gunicorn config.wsgi:application
```

## Security Checklist

- [ ] Change `SECRET_KEY` in production
- [ ] Set `DEBUG=False` in production
- [ ] Configure allowed hosts
- [ ] Use HTTPS in production
- [ ] Set strong JWT_SECRET
- [ ] Configure proper CORS origins
- [ ] Use environment variables for sensitive data
- [ ] Set up proper database backups
- [ ] Enable logging and monitoring

## Troubleshooting

**Issue: ModuleNotFoundError when importing apps**
- Make sure you're in the correct virtual environment
- Reinstall requirements: `pip install -r requirements.txt`

**Issue: Database errors**
- Run migrations: `python manage.py migrate`
- Check `.env` database configuration

**Issue: CORS errors**
- Verify `CORS_ALLOWED_ORIGINS` in settings.py
- Make sure frontend URL is included

## License

This project is open source and available under the MIT License.
