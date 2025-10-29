# ProjectHub - Collaborative AI-Powered Project Management Platform

A full-stack web application that combines team collaboration with AI-powered chat capabilities for intelligent project management.

## Overview

ProjectHub is an enterprise-grade platform that enables organizations to manage teams, projects, and leverage AI for intelligent assistance. The platform features a comprehensive role-based access control system, real-time AI chat with dataset integration, and multi-level organizational hierarchy.

## Architecture

```
project/
├── backend/          # Node.js/Express backend with MongoDB
├── frontend/         # React/Vite frontend with Tailwind CSS
└── README.md         # This file
```

## Key Features

### Multi-Tenant Organization System
- Organizations with custom domains
- User registration with email verification
- Dual authentication (User & Organization accounts)
- Role-based access control (User, Team Creator, Super Admin)

### Team Management
- Create and manage teams within organizations
- Hierarchical member roles (Member, Team Admin)
- Granular access levels (Read, Write, Admin)
- Dynamic member management

### Project Collaboration
- Team-based project creation
- Project descriptions and metadata
- Dataset upload and management
- Multiple chats per project

### AI-Powered Chat
- Integration with GitHub AI/Azure OpenAI
- Context-aware responses using project datasets
- Multi-file upload support (up to 3 files per message)
- Confidence scoring for AI responses
- Chat history persistence

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer with Cloudinary
- **Email**: Nodemailer
- **AI Integration**: Azure AI Inference SDK

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **HTTP Client**: Axios
- **State Management**: React Context API

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance
- Cloudinary account (for file uploads)
- GitHub AI token or Azure OpenAI credentials

### Installation

1. Clone the repository:
```bash
cd project
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Configuration

#### Backend (.env in backend/)
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI Configuration
GITHUB_TOKEN=your_github_ai_token
GITHUB_AI_ENDPOINT=https://models.inference.ai.azure.com
GITHUB_AI_MODEL=gpt-4o
```

#### Frontend (.env in frontend/)
```env
VITE_API_URL=http://localhost:3000
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## User Roles & Permissions

### Organization Account
- Manage organization settings
- View all members
- Promote users to Team Creators

### Super Admin
- Full system access
- Can access any team or project

### Team Creator
- Create teams
- Manage team membership
- Create projects under their teams

### User
- Join teams (when added by Team Admin)
- Access projects within their teams
- Use AI chat in projects

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/verify-email` - Verify email with code
- `POST /api/users/login` - User login
- `POST /api/organizations/register` - Register organization
- `POST /api/organizations/login` - Organization login

### Teams
- `POST /api/teams/create` - Create team
- `GET /api/teams/all` - List all teams
- `GET /api/teams/:id` - Get team details
- `PUT /api/teams/:id/add-member` - Add team member
- `PUT /api/teams/:id/remove-member` - Remove member
- `DELETE /api/teams/:id` - Delete team

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - List projects
- `GET /api/projects/:id` - Get project details
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/datasets` - Upload datasets

### Chat
- `POST /api/chat/chat` - Send message
- `POST /api/chat/chat/ai` - Get AI response
- `GET /api/chat/:projectId/:chatId` - Get chat history
- `POST /api/chat/chat/create` - Create new chat

## Workflow Examples

### Organization Setup
1. Register organization with domain (e.g., "company.com")
2. Users register with matching email domain
3. Users verify their email
4. Organization promotes users to Team Creators

### Team Collaboration
1. Team Creator creates a team
2. Add members with appropriate access levels
3. Create projects under the team
4. Upload datasets for AI context

### AI-Assisted Work
1. Open project chat interface
2. Select relevant datasets for context
3. Upload files if needed (max 3 per message)
4. Send questions to AI
5. Receive context-aware responses with confidence scores

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Email domain validation
- Organization-scoped data access
- Role-based authorization
- Protected routes on frontend
- Request validation and sanitization

## Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

## Database Schema

### User
- name, email, password (hashed)
- role: user | team_creator | superadmin
- organization reference
- teams array

### Organization
- name, domain, email
- password (hashed)
- Virtual members population

### Team
- name, organization reference
- members with roles and access levels

### Project
- name, description
- team reference
- chats array
- datasets array

### Chat
- project reference
- messages array

### Message
- chat reference
- sender: user | chatbot
- content, imageUrl
- confidenceScore
- selectedDatasets, tempFiles

## Future Enhancements

- Real-time websocket communication
- Advanced AI model selection
- Team analytics and reporting
- File version control
- Project templates
- Export/import functionality
- Notification system
- Mobile application

## License

This project is proprietary software.

## Support

For support and questions, please contact the development team.
