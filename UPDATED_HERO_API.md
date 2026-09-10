# ✅ Updated Hero Section API - Complete Reference

## What Was Fixed

### Backend Changes
1. **Updated HeroSection Model** - Added all required fields:
   - `description` - Full hero description
   - `logo` - Hero image/logo upload
   - `primary_btn_text` & `primary_btn_link` - Primary CTA button
   - `secondary_btn_text` & `secondary_btn_link` - Secondary CTA button
   - `background_color` & `text_color` - Styling options

2. **Updated HeroStat Model** - Changed field names:
   - `number` → `value` (e.g., "1000+")
   - Kept `label` (e.g., "Active Users")

3. **Updated Serializers** - Includes all new fields in responses

4. **Updated Views** - Handles nested stats creation/update

5. **Updated Admin Interface** - Shows all new fields

---

## Complete API Reference

### 1. Get Latest Hero Section
```
GET /api/portfolio/hero/latest/
Authorization: Not required (public)
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Hello, I'm Kala",
  "subtitle": "Full-Stack Developer",
  "description": "I build modern web applications...",
  "logo": "http://localhost:8000/media/hero/logo.png",
  "primary_btn_text": "Get Started Now",
  "primary_btn_link": "/register",
  "secondary_btn_text": "Sign In",
  "secondary_btn_link": "/login",
  "background_color": "#ffffff",
  "text_color": "#000000",
  "is_active": true,
  "stats": [
    {
      "id": 1,
      "label": "Active Users",
      "value": "1000+",
      "order": 0
    },
    {
      "id": 2,
      "label": "Projects Shared",
      "value": "5000+",
      "order": 1
    },
    {
      "id": 3,
      "label": "User Satisfaction",
      "value": "98%",
      "order": 2
    }
  ],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### 2. Get All Hero Sections
```
GET /api/portfolio/hero/
Authorization: Bearer {token} (Staff only for all, public for active)
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Hello, I'm Kala",
    "subtitle": "Full-Stack Developer",
    "description": "I build modern web applications...",
    "logo": "http://localhost:8000/media/hero/logo.png",
    "primary_btn_text": "Get Started Now",
    "primary_btn_link": "/register",
    "secondary_btn_text": "Sign In",
    "secondary_btn_link": "/login",
    "background_color": "#ffffff",
    "text_color": "#000000",
    "is_active": true,
    "stats": [...],
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

---

### 3. Create Hero Section
```
POST /api/portfolio/hero/
Authorization: Bearer {token} (Authenticated users only)
Content-Type: application/json
```

**Request Payload:**
```json
{
  "title": "Hello, I'm Kala",
  "subtitle": "Full-Stack Developer",
  "description": "I build modern web applications using React, Django, Python and modern web technologies.",
  "logo": null,
  "primary_btn_text": "Get Started Now",
  "primary_btn_link": "/register",
  "secondary_btn_text": "Sign In",
  "secondary_btn_link": "/login",
  "background_color": "#ffffff",
  "text_color": "#000000",
  "is_active": true,
  "stats": [
    {
      "label": "Active Users",
      "value": "1000+"
    },
    {
      "label": "Projects Shared",
      "value": "5000+"
    },
    {
      "label": "User Satisfaction",
      "value": "98%"
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "title": "Hello, I'm Kala",
  "subtitle": "Full-Stack Developer",
  "description": "I build modern web applications...",
  "logo": null,
  "primary_btn_text": "Get Started Now",
  "primary_btn_link": "/register",
  "secondary_btn_text": "Sign In",
  "secondary_btn_link": "/login",
  "background_color": "#ffffff",
  "text_color": "#000000",
  "is_active": true,
  "stats": [
    {
      "id": 1,
      "label": "Active Users",
      "value": "1000+",
      "order": 0
    },
    {
      "id": 2,
      "label": "Projects Shared",
      "value": "5000+",
      "order": 1
    },
    {
      "id": 3,
      "label": "User Satisfaction",
      "value": "98%",
      "order": 2
    }
  ],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### 4. Update Hero Section
```
PUT /api/portfolio/hero/{id}/
Authorization: Bearer {token} (Authenticated users only)
Content-Type: application/json
```

**Request Payload:** (Same as create, all fields optional for updates)
```json
{
  "title": "Updated Title",
  "subtitle": "Updated Subtitle",
  "description": "Updated description...",
  "stats": [
    {
      "label": "New Stat",
      "value": "2000+"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Updated Title",
  "subtitle": "Updated Subtitle",
  "description": "Updated description...",
  "logo": null,
  "primary_btn_text": "Get Started Now",
  "primary_btn_link": "/register",
  "secondary_btn_text": "Sign In",
  "secondary_btn_link": "/login",
  "background_color": "#ffffff",
  "text_color": "#000000",
  "is_active": true,
  "stats": [
    {
      "id": 1,
      "label": "New Stat",
      "value": "2000+",
      "order": 0
    }
  ],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### 5. Delete Hero Section
```
DELETE /api/portfolio/hero/{id}/
Authorization: Bearer {token} (Authenticated users only)
```

**Response (204 No Content):**
```
(Empty response)
```

---

## Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer | No (auto) | Hero section ID |
| `title` | String | Yes | Main headline |
| `subtitle` | String | No | Secondary headline |
| `description` | String | Yes | Detailed description |
| `logo` | File | No | Hero image/logo |
| `primary_btn_text` | String | No | Primary button label |
| `primary_btn_link` | String | No | Primary button URL |
| `secondary_btn_text` | String | No | Secondary button label |
| `secondary_btn_link` | String | No | Secondary button URL |
| `background_color` | String | No | Hex color (e.g., #ffffff) |
| `text_color` | String | No | Hex color (e.g., #000000) |
| `is_active` | Boolean | No | Is this hero active? |
| `stats` | Array | No | Array of statistics |
| `created_at` | DateTime | No (auto) | Creation timestamp |
| `updated_at` | DateTime | No (auto) | Last update timestamp |

---

## Statistics Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer | No (auto) | Statistic ID |
| `label` | String | Yes | Statistic label |
| `value` | String | Yes | Statistic value |
| `order` | Integer | No | Display order |

---

## Error Responses

### 400 Bad Request
```json
{
  "title": ["This field is required."],
  "description": ["This field is required."]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

---

## Frontend Integration

### Using homeService

```javascript
// Get latest hero
const hero = await homeAPI.getHeroSection()

// Get all heroes
const heroes = await homeAPI.getAllHeroSections()

// Create hero with stats
const newHero = await homeAPI.createHeroSection({
  title: "Hello, I'm Kala",
  subtitle: "Full-Stack Developer",
  description: "Build amazing things...",
  primary_btn_text: "Get Started",
  primary_btn_link: "/register",
  secondary_btn_text: "Sign In",
  secondary_btn_link: "/login",
  background_color: "#ffffff",
  text_color: "#000000",
  is_active: true,
  stats: [
    { label: "Active Users", value: "1000+" },
    { label: "Projects", value: "50+" }
  ]
})

// Update hero
const updated = await homeAPI.updateHeroSection(1, {
  title: "Updated Title",
  stats: [...]
})
```

---

## Testing with cURL

### Get Latest Hero
```bash
curl -X GET http://localhost:8000/api/portfolio/hero/latest/
```

### Create Hero (with auth)
```bash
curl -X POST http://localhost:8000/api/portfolio/hero/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hello, I'\''m Kala",
    "subtitle": "Full-Stack Developer",
    "description": "Build amazing things...",
    "stats": [
      {"label": "Active Users", "value": "1000+"},
      {"label": "Projects", "value": "50+"}
    ]
  }'
```

---

## What Changed from Previous

| Before | After | Why |
|--------|-------|-----|
| `cta_button_text` | `primary_btn_text` | Clearer naming |
| `cta_button_link` | `primary_btn_link` | Clearer naming |
| `secondary_button_text` | `secondary_btn_text` | Consistency |
| `secondary_button_link` | `secondary_btn_link` | Consistency |
| No `description` | `description` | Required field |
| No `logo` | `logo` | Support hero images |
| No colors | `background_color`, `text_color` | Styling options |
| HeroStat `number` | HeroStat `value` | Clearer naming |

---

## Database Migrations

New migrations have been created for these changes. Run:
```bash
python manage.py migrate
```

All fields have default values, so existing heroes won't break.

---

**Status**: ✅ Complete and Tested
**Date**: August 5, 2026
