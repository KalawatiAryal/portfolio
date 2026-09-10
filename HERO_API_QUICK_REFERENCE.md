# ⚡ Hero API Quick Reference Card

## Endpoints

```
GET    /api/portfolio/hero/latest/        ✅ Get latest hero
GET    /api/portfolio/hero/               ✅ List all heroes  
POST   /api/portfolio/hero/               ✅ Create hero
PUT    /api/portfolio/hero/{id}/          ✅ Update hero
DELETE /api/portfolio/hero/{id}/          ✅ Delete hero
```

## Hero Fields

| Field | Type | Required | Example |
|-------|------|----------|---------|
| title | String | ✅ | "Hello, I'm Kala" |
| subtitle | String | ❌ | "Full-Stack Developer" |
| description | String | ✅ | "I build modern apps..." |
| logo | File | ❌ | image.png |
| primary_btn_text | String | ❌ | "Get Started" |
| primary_btn_link | String | ❌ | "/register" |
| secondary_btn_text | String | ❌ | "Sign In" |
| secondary_btn_link | String | ❌ | "/login" |
| background_color | String | ❌ | "#ffffff" |
| text_color | String | ❌ | "#000000" |
| is_active | Boolean | ❌ | true |

## Stat Fields

| Field | Type | Example |
|-------|------|---------|
| label | String | "Active Users" |
| value | String | "1000+" |
| order | Integer | 0 |

## Create Hero Example

```bash
curl -X POST http://localhost:8000/api/portfolio/hero/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hello, I'\''m Kala",
    "subtitle": "Full-Stack Developer",
    "description": "Build amazing things",
    "stats": [
      {"label": "Users", "value": "1000+"},
      {"label": "Projects", "value": "50+"}
    ]
  }'
```

## Response Structure

```json
{
  "id": 1,
  "title": "...",
  "subtitle": "...",
  "description": "...",
  "logo": null,
  "primary_btn_text": "...",
  "primary_btn_link": "...",
  "secondary_btn_text": "...",
  "secondary_btn_link": "...",
  "background_color": "...",
  "text_color": "...",
  "is_active": true,
  "stats": [
    {"id": 1, "label": "...", "value": "...", "order": 0}
  ],
  "created_at": "...",
  "updated_at": "..."
}
```

## Frontend Usage

```javascript
// Get latest
const hero = await homeAPI.getHeroSection()

// Create
await homeAPI.createHeroSection({
  title: "...",
  description: "...",
  stats: [{label: "...", value: "..."}]
})

// Update
await homeAPI.updateHeroSection(1, {...})

// List
const heroes = await homeAPI.getAllHeroSections()
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | ✅ Success |
| 201 | ✅ Created |
| 400 | ❌ Bad request |
| 401 | ❌ Not authenticated |
| 403 | ❌ Not authorized |
| 404 | ❌ Not found |

## Key Changes from V1

- `number` → `value` (in HeroStat)
- Added `description` field (required)
- Added `logo` field
- Renamed button fields
- Added color fields
- All responses include stats

## Quick Test

1. Start servers
2. Go to Admin: http://localhost:5173/admin/hero
3. Fill form with hero data
4. Add stats
5. Click "Create"
6. Check homepage: http://localhost:5173
7. Should see hero section!

---

**All fields working!** Ready for production. 🚀
