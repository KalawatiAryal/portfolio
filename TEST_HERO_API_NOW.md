# 🧪 Test Updated Hero API NOW

## What's Fixed

✅ Hero model now has `description`, `logo`, `primary_btn_text`, etc.
✅ HeroStat uses `value` instead of `number`
✅ All fields properly included in responses
✅ Nested stats creation working

---

## Step 1: Restart Backend (Fresh)

```powershell
cd "c:\Users\Dell\Downloads\Sample Web\Backend"
.\venv\Scripts\Activate.ps1

# Kill and restart
python manage.py runserver 8000
```

---

## Step 2: Test Create Hero

1. Go to **Admin** page: `http://localhost:5173/admin/hero`
2. Fill form:
   ```
   Title: Hello, I'm Kala
   Subtitle: Full-Stack Developer
   Description: I build modern web applications with React and Django
   Primary Button: Get Started Now
   Secondary Button: Sign In
   Stats:
     - Active Users = 1000+
     - Projects = 50+
     - Success Rate = 98%
   ```
3. Click "Create Hero"
4. ✅ Should see success message
5. ✅ Hero appears in list

---

## Step 3: Verify in Browser DevTools

1. Open browser console (F12)
2. Go to **Network** tab
3. Click "Create Hero"
4. Find the POST request to `/api/portfolio/hero/`
5. Check **Response** - should have:
   ```json
   {
     "id": 1,
     "title": "Hello, I'm Kala",
     "subtitle": "Full-Stack Developer",
     "description": "I build modern...",
     "logo": null,
     "primary_btn_text": "Get Started Now",
     "primary_btn_link": "/register",
     "secondary_btn_text": "Sign In",
     "secondary_btn_link": "/login",
     "background_color": "#ffffff",
     "text_color": "#000000",
     "is_active": true,
     "stats": [
       {"id": 1, "label": "Active Users", "value": "1000+", "order": 0},
       {"id": 2, "label": "Projects", "value": "50+", "order": 1},
       {"id": 3, "label": "Success Rate", "value": "98%", "order": 2}
     ],
     "created_at": "2024-01-15T...",
     "updated_at": "2024-01-15T..."
   }
   ```

---

## Step 4: Test Homepage Display

1. Go to homepage: `http://localhost:5173`
2. Should see hero section with:
   - ✅ Title: "Hello, I'm Kala"
   - ✅ Subtitle: "Full-Stack Developer"
   - ✅ Description text
   - ✅ Stats with values (1000+, 50+, 98%)
   - ✅ Buttons

---

## Step 5: Test Edit Hero

1. Go to Admin: `http://localhost:5173/admin/hero`
2. Find hero in list
3. Click "Edit"
4. Form should populate with:
   - ✅ All fields (title, subtitle, description, etc.)
   - ✅ All stats
5. Change something (e.g., title)
6. Click "Update Hero"
7. ✅ Should see updated hero in list

---

## Step 6: Check Database

```powershell
# In Django shell
cd Backend
.\venv\Scripts\Activate.ps1
python manage.py shell
```

```python
from apps.portfolio.models import HeroSection, HeroStat

# Check heroes
hero = HeroSection.objects.first()
print(hero.title)  # Should print "Hello, I'm Kala"
print(hero.description)  # Should print description
print(hero.logo)  # Should be None or file path

# Check stats
stats = hero.stats.all()
for stat in stats:
    print(f"{stat.label}: {stat.value}")
    # Should print:
    # Active Users: 1000+
    # Projects: 50+
    # Success Rate: 98%
```

---

## Checklist

- [ ] Backend restarted
- [ ] Create hero form works
- [ ] All fields showing in form
- [ ] Stats can be added
- [ ] Hero creates successfully
- [ ] Response has all fields
- [ ] Homepage displays hero
- [ ] Stats showing correctly
- [ ] Can edit hero
- [ ] Database has data

---

## If Something's Wrong

### Stats not saving?
- Check POST request payload in Network tab
- Verify `stats` array format

### Response missing fields?
- Restart backend (might be caching)
- Check serializer includes all fields

### Homepage not showing hero?
- Ensure hero is `is_active=true`
- Check browser console for errors
- Go to `/api/portfolio/hero/latest/` to verify data

### Can't create hero?
- Check you're authenticated (token in headers)
- Check error response in Network tab
- Verify all required fields filled

---

**All tests passing?** You're ready! 🎉
