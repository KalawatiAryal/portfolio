# ⚡ Fix 403 Error NOW - 1 Minute

## You Got This Error?
```
POST http://localhost:8000/api/portfolio/hero/
Status Code: 403 Forbidden
```

## Fix It in 30 Seconds

### Step 1: Restart Frontend (Kill & Restart)
```powershell
cd "c:\Users\Dell\Downloads\Sample Web\Frontend"
# Kill if running (Ctrl+C first)
npm run dev
```

Wait for:
```
VITE v5.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Step 2: Try Again
1. Go to Admin: `http://localhost:5173/admin/hero`
2. Fill hero form
3. Click "Create Hero"
4. ✅ Should work!

---

## What Was Fixed
Frontend wasn't sending JWT token. Now it does!

**File changed:** `Frontend/src/services/homeService.js`

Added:
```javascript
const getAuthHeaders = () => {
  const token = tokenService.getAccessToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}
```

---

## Checklist
- [ ] Killed old frontend process
- [ ] Ran `npm run dev` fresh
- [ ] Logged in as staff
- [ ] Trying to create hero
- [ ] It works! ✅

---

**That's it!** Your admin should now work perfectly. 🚀
