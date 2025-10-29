# Frontend - ProjectHub

A comprehensive React-based frontend for the ProjectHub platform with AI chat capabilities.

## Features

### Authentication
- User registration with email verification
- Organization registration
- Dual login system (User/Organization accounts)
- Protected routes with JWT authentication

### Organization Management
- View organization members
- Promote users to team creators
- Organization dashboard

### Team Management
- Create teams (for team creators)
- View all teams in organization
- Add/remove team members
- Assign access levels (read, write, admin)
- Change team admins
- Delete teams

### Project Management
- Create projects under teams
- View all projects
- Project details with description
- Link projects to teams
- Upload datasets to projects
- Delete projects

### AI Chat Interface
- Real-time chat with AI assistant
- Multi-chat support per project
- Dataset selection for context
- File upload support (up to 3 files per message)
- Confidence scores for AI responses
- Chat history

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Context API** - State management

## Getting Started

### Prerequisites

- Node.js 18+
- Backend server running on port 3000

### Installation

```bash
cd frontend
npm install
```

### Configuration

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout.jsx      # Main layout with navigation
│   │   └── ProtectedRoute.jsx  # Route guard
│   ├── context/            # React context
│   │   └── AuthContext.jsx # Authentication state
│   ├── pages/              # Page components
│   │   ├── auth/           # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Dashboard.jsx   # Main dashboard
│   │   ├── Teams.jsx       # Team list
│   │   ├── TeamDetail.jsx  # Team details
│   │   ├── Projects.jsx    # Project list
│   │   ├── ProjectDetail.jsx  # Project details with chat
│   │   └── Organization.jsx   # Organization management
│   ├── services/           # API services
│   │   ├── api.js          # Axios instance
│   │   ├── authService.js  # Auth endpoints
│   │   ├── organizationService.js
│   │   ├── teamService.js
│   │   ├── projectService.js
│   │   └── chatService.js
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── .env                    # Environment variables
└── package.json
```

## Usage

### User Account Flow
1. Register with organization domain
2. Verify email with 6-digit code
3. Login to access dashboard
4. Join teams and projects
5. Use AI chat in projects

### Organization Account Flow
1. Register organization with domain
2. Login to organization dashboard
3. View and manage members
4. Promote users to team creators

### Team Creator Flow
1. Create teams
2. Add members with access levels
3. Create projects under teams
4. Manage team settings

### Project Workflow
1. Create project under a team
2. Upload datasets
3. Start chat with AI
4. Select datasets for context
5. Upload files with messages
6. Get AI responses with confidence scores

## API Integration

All API calls are made through service modules that use the centralized Axios instance with:
- Automatic JWT token injection
- Request/response interceptors
- Error handling
- 401 redirect to login

## Styling

The application uses Tailwind CSS with a clean, professional design featuring:
- Blue color scheme for primary actions
- Responsive design for all screen sizes
- Smooth transitions and hover effects
- Card-based layouts
- Modal dialogs
