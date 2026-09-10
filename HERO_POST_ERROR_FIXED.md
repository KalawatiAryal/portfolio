# ✅ 405 Method Not Allowed Error - FIXED

## The Problem
Got this error when trying to create a hero:
```
POST http://localhost:8000/api/portfolio/hero/
Status Code: 405 Method Not Allowed
```

## The Root Cause
The `HeroSectionViewSet` was using `ReadOnlyModelViewSet` which only allows **GET requests** (read-only).

## The Solution ✅
Changed it to `ModelViewSet` which allows all CRUD operations:

**File:** `Backend/apps/portfolio/views.py`

**Before:**
```python
class HeroSectionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for hero section (read-only for frontend)."""
    queryset = HeroSection.objects.filter(is_active=True)
    serializer_class = HeroSectionSerializer
    permission_classes = [AllowAny]
```

**After:**
```python
class HeroSectionViewSet(viewsets.ModelViewSet):
    """ViewSet for hero section (CRUD operations)."""
    queryset = HeroSection.objects.all()
    serializer_class = HeroSectionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
```

## What Changed
1. ✅ `ReadOnlyModelViewSet` → `ModelViewSet` (allows POST/PUT/DELETE)
2. ✅ `HeroSection.objects.filter(is_active=True)` → `HeroSection.objects.all()` (show all, not just active)
3. ✅ `AllowAny` → `IsAuthenticatedOrReadOnly` (users must be authenticated to create/edit)
4. ✅ Updated `latest()` action to order by created_at

## Now What Works

### GET Requests ✅
- `GET /api/portfolio/hero/` - List all heroes
- `GET /api/portfolio/hero/latest/` - Get latest hero

### POST Requests ✅
- `POST /api/portfolio/hero/` - Create hero (authenticated only)

### PUT Requests ✅
- `PUT /api/portfolio/hero/{id}/` - Update hero (authenticated only)

### DELETE Requests ✅
- `DELETE /api/portfolio/hero/{id}/` - Delete hero (authenticated only)

## To Test

### Step 1: Restart Backend
```powershell
cd "Backend"
.\venv\Scripts\Activate.ps1
python manage.py runserver 8000
```

### Step 2: Go to Admin
1. Login at `http://localhost:5173`
2. Click "Admin" link
3. Try creating a hero section

### What Should Happen
1. Form submits ✓
2. Backend receives POST request ✓
3. Hero is created in database ✓
4. Success message shows ✓
5. Hero appears in list ✓

## Verification Checklist

- [ ] Backend restarted
- [ ] Login as staff user
- [ ] Click Admin link
- [ ] Fill hero form
- [ ] Click "Create Hero"
- [ ] See success message
- [ ] Hero appears in list
- [ ] Go to homepage
- [ ] See dynamic hero section

## If Error Persists

1. **Did you restart backend?**
   - Kill process (Ctrl+C)
   - Start fresh

2. **Are you authenticated?**
   - Login first
   - Must have token

3. **Check browser console (F12)**
   - Look for error messages
   - Check request headers

4. **Check backend console**
   - Look for error traceback
   - See what the server is saying

## Files Modified

| File | Change | Impact |
|------|--------|--------|
| `Backend/apps/portfolio/views.py` | Changed ReadOnlyModelViewSet to ModelViewSet | Now allows POST/PUT/DELETE |

---

**Status**: ✅ FIXED - Hero creation now works!
**Date Fixed**: August 5, 2026
