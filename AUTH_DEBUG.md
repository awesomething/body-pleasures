# Auth Debugging Guide

## Issues Identified & Resolved

### 1. ✅ Hook Auto-Redirect Issue
**Problem:** The `useAuth()` hook was calling `router.push()` directly, which could cause race conditions or redirects before state updates.

**Solution:** 
- Removed auto-navigation from `register()` and `login()` functions
- Now they return the user object so the component can handle navigation
- Pages explicitly call `router.push()` after successful auth

### 2. ✅ Missing Error Details
**Problem:** Error responses were generic, making it hard to debug failures.

**Solution:**
- Added detailed console logging to all auth endpoints
- Enhanced error messages to include specific failure reasons
- Added logging to `lib/auth.ts` for bcrypt operations

### 3. ✅ Password Hashing & Comparison
**Problem:** No visibility into whether bcrypt was working correctly.

**Solution:**
- Added logging for password hash creation
- Added logging for password comparison results
- Created test endpoint at `/api/test/register-test`

## How to Test Registration

### Method 1: Direct API Test
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

Expected response:
```json
{
  "user": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User",
    "role": "customer"
  },
  "token": "eyJ..."
}
```

### Method 2: Automated Test Endpoint
```bash
curl -X POST http://localhost:3000/api/test/register-test
```

This will:
1. Create a test user with random email
2. Hash a password
3. Test password comparison (correct and wrong)
4. Generate a JWT token
5. Simulate a login

Watch the console logs to see detailed step-by-step output.

### Method 3: UI Registration
1. Navigate to `http://localhost:3000/auth/register`
2. Fill in email, name, password
3. Watch browser console for errors
4. Check server logs for detailed debugging info

## Checking User in Database

```bash
# Access database directly
DATABASE_URL="file:./prisma/dev.db" npx prisma studio

# Or query with:
DATABASE_URL="file:./prisma/dev.db" npx prisma db execute --stdin
# Then type: SELECT * FROM User;
```

## If oyedey@gmail.com User Exists

If the user was previously created (from earlier failed attempts):

```bash
# Delete and recreate
DATABASE_URL="file:./prisma/dev.db" npx prisma db push --skip-generate

# Or manually delete:
# DELETE FROM User WHERE email = 'oyedey@gmail.com';
```

## Troubleshooting Checklist

- [ ] `.env.local` has `JWT_SECRET` set
- [ ] `.env.local` has `DATABASE_URL` pointing to `file:./prisma/dev.db`
- [ ] Prisma migration was run: `npx prisma migrate dev --name add_user_auth`
- [ ] `pnpm dev` is running (check server logs while testing)
- [ ] Browser dev tools open (check Network and Console tabs)
- [ ] Try test endpoint first: `/api/test/register-test`
- [ ] Check for database connection errors in server logs
- [ ] Verify bcrypt is installed: `pnpm ls bcrypt`
- [ ] Verify JWT is installed: `pnpm ls jsonwebtoken`

## Expected Behavior After Fix

1. **Registration:**
   - Enter email/password/name
   - Click "Sign Up"
   - User is created in database
   - JWT cookie is set
   - Redirected to `/profile`
   - Profile page shows user info and order history

2. **Login:**
   - Enter email/password
   - Click "Log In"
   - Password is compared with hash
   - JWT cookie is set
   - Redirected to `/profile`
   - Profile page shows user info

3. **Logout:**
   - Click "Log Out"
   - Cookie is cleared
   - Redirected to home
   - Navigation shows "Log In" and "Sign Up" again

## Server Console Output

When testing, you should see logs like:

```
✅ Password hashed, hash length: 60
✅ User created: [userId] oyedey@gmail.com
✅ Comparing password, hash length: 60
✅ bcrypt.compare result: true
✅ Password comparison complete, match: true
✅ User found: oyedey@gmail.com
```

If any step fails, the logs will show `❌` and error details.
