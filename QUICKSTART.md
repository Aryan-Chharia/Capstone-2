# Quick Start Guide

## Prerequisites

Before running the application, ensure you have:

1. ✅ Node.js 18+ installed
2. ✅ MongoDB installed and running
3. ✅ Gmail account for sending verification emails
4. ✅ Cloudinary account (for file uploads)
5. ✅ GitHub AI token or Azure OpenAI credentials

## Setup Steps

### 1. Backend Configuration

Navigate to the backend directory and create a `.env` file:

```bash
cd backend
```

Create `backend/.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/projecthub
JWT_SECRET=your_super_secret_jwt_key_here

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI Configuration
GITHUB_TOKEN=your_github_ai_token
GITHUB_AI_ENDPOINT=https://models.inference.ai.azure.com
GITHUB_AI_MODEL=gpt-4o

# Session Secret
SESSION_SECRET=your_session_secret_here
```

Install dependencies:
```bash
npm install
```

### 2. Frontend Configuration

Navigate to the frontend directory:

```bash
cd ../frontend
```

The `.env` file should already exist with:
```env
VITE_API_URL=http://localhost:3000
```

Install dependencies:
```bash
npm install
```

### 3. Start the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
✅ Backend running at: http://localhost:3000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend running at: http://localhost:5173

## First Time Setup

### Step 1: Create an Organization

1. Open http://localhost:5173 in your browser
2. Click "Sign up" link
3. Select "Organization" tab
4. Fill in:
   - Organization Name: "My Company"
   - Domain: "mycompany.com"
   - Email: "admin@mycompany.com"
   - Password: (choose a strong password)
5. Click "Create account"
6. Login with organization credentials

### Step 2: Register Your First User

1. Logout from organization account
2. Click "Sign up"
3. Select "User" tab
4. Fill in:
   - Full Name: "John Doe"
   - Organization Domain: "mycompany.com" (must match organization)
   - Email: "john@mycompany.com" (must use organization domain)
   - Password: (choose a password)
5. Check your email for 6-digit verification code
6. Enter the code and verify
7. Login with user credentials

### Step 3: Promote User to Team Creator

1. Login as organization
2. Go to "Organization" page
3. Find the user in members list
4. Click "Promote to Creator"
5. User can now create teams

### Step 4: Create a Team

1. Login as the promoted user
2. Go to "Teams" page
3. Click "Create Team"
4. Enter team name
5. Team is created with you as admin

### Step 5: Add Team Members

1. From team detail page
2. Click "Add Member"
3. Select a user from dropdown
4. Choose access level (read/write)
5. Click "Add Member"

### Step 6: Create a Project

1. Go to "Projects" page
2. Click "Create Project"
3. Fill in:
   - Project Name
   - Description (optional)
   - Select a Team
4. Click "Create Project"

### Step 7: Use AI Chat

1. Open a project
2. Upload datasets if needed (click "Upload" in datasets panel)
3. Select datasets you want AI to use as context
4. Type your message in chat
5. Upload files if needed (up to 3 files)
6. Click "Send"
7. AI will respond with contextual information

## Common Issues

### CORS Error
- Make sure backend CORS includes `http://localhost:5173`
- Check `backend/config/expressConfig.js`

### Email Not Sending
- Enable "Less secure app access" or use App Password for Gmail
- Check EMAIL_USER and EMAIL_PASS in backend/.env

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod`
- Check MONGODB_URI in backend/.env

### AI Not Responding
- Verify GITHUB_TOKEN is valid
- Check AI configuration in backend/.env
- Ensure you have API credits

## Environment Variables Checklist

### Backend Required Variables
- [ ] PORT
- [ ] MONGODB_URI
- [ ] JWT_SECRET
- [ ] EMAIL_USER
- [ ] EMAIL_PASS
- [ ] CLOUDINARY_CLOUD_NAME
- [ ] CLOUDINARY_API_KEY
- [ ] CLOUDINARY_API_SECRET
- [ ] GITHUB_TOKEN
- [ ] GITHUB_AI_ENDPOINT
- [ ] GITHUB_AI_MODEL
- [ ] SESSION_SECRET

### Frontend Required Variables
- [ ] VITE_API_URL

## Testing the Application

### Test Authentication
1. Register organization ✅
2. Register user with verification ✅
3. Login/logout ✅

### Test Team Management
1. Create team ✅
2. Add members ✅
3. Remove members ✅
4. Change access levels ✅

### Test Project Management
1. Create project ✅
2. Upload datasets ✅
3. View project details ✅

### Test AI Chat
1. Send text message ✅
2. Select datasets ✅
3. Upload files ✅
4. Receive AI response ✅

## Support

If you encounter any issues:
1. Check browser console for errors
2. Check backend terminal for error messages
3. Verify all environment variables are set
4. Ensure MongoDB is running
5. Check CORS configuration

## Production Deployment

For production deployment:
1. Build frontend: `cd frontend && npm run build`
2. Update CORS to include production domain
3. Use production MongoDB instance
4. Set secure JWT_SECRET
5. Use environment-specific .env files
6. Enable HTTPS
7. Set up proper logging
8. Configure backup strategy
