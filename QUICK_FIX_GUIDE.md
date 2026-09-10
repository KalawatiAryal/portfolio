# ⚡ Quick Fix Guide - Do This NOW

## You Got This Error?
```
POST http://localhost:8000/api/portfolio/hero/
Status Code: 405 Method Not Allowed
```

## Fix It in 2 Steps

### Step 1: Restart Backend
```powershell
cd "c:\Users\Dell\Downloads\Sample Web\Backend"
.\venv\Scripts\Activate.ps1
python manage.py runserver 8000
```

Kill the old one first (Ctrl+C), then start fresh.

### Step 2: Try Again
1. Go to Admin: http://localhost:5173/admin/hero
2. Fill hero form
3. Click "Create Hero"
4. ✅ Should work now!

---

## What Was Fixed
Backend ViewSet was read-only (couldn't POST). Changed it to allow create/edit/delete.

**File changed:** `Backend/apps/portfolio/views.py` line 20

---

## Still Getting Error?

### Make sure you:
- ✅ Are logged in as staff user
- ✅ Restarted backend (killed old process)
- ✅ Are using correct URL: `http://localhost:5173/admin/hero`
- ✅ Have both frontend and backend running

### If still stuck:
1. Open browser console (F12)
2. Look at Network tab
3. Check backend console for errors
4. Paste error here

---

**That's it!** Your admin page should now work perfectly. 🎉
