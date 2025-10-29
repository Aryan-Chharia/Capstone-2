# System Architecture - Project Management & AI Chat Platform

## 🎯 System Overview

This is a **multi-tenant organization-based project management platform** with integrated AI chatbot capabilities. The system enables organizations to manage teams, projects, and leverage AI-powered conversations with dataset integration for data analysis and insights.

---

## 🏗️ Architecture Pattern

**Type**: Multi-Tenant B2B SaaS Platform  
**Pattern**: Hierarchical Organization-Team-Project Structure  
**Authentication**: JWT-based with role-based access control (RBAC)  
**Database**: MongoDB (NoSQL Document Store)  
**AI Integration**: Azure AI / GitHub Models API

---

## 📊 Data Models & Hierarchy

### 1. **Organization** (Top-level Entity)
- **Purpose**: Root entity representing a company/institution
- **Key Fields**:
  - `name`: Organization name
  - `domain`: Unique domain (e.g., "company.com")
  - `email`: Admin email
  - `password`: Hashed password
- **Relationships**: 
  - One-to-Many with Users
  - One-to-Many with Teams (indirect)
- **Access Level**: Organization owners can manage all resources

### 2. **User** (Member Entity)
- **Purpose**: Individual users within an organization
- **Key Fields**:
  - `name`, `email`, `password` (hashed)
  - `isVerified`: Email verification status
  - `role`: `"user"`, `"team_creator"`, or `"superadmin"`
  - `organization`: Reference to parent organization
  - `teams`: Array of team memberships
- **Verification Flow**: 
  - Registration → PendingUser → Email verification (6-digit code) → User
- **Access Control**: Users can only access resources within their organization

### 3. **PendingUser** (Temporary Entity)
- **Purpose**: Temporary storage for unverified registrations
- **Key Features**:
  - Auto-expires after 1 hour (TTL index)
  - Stores verification code
  - Password pre-hashed before User creation
- **Flow**: Created on registration → Deleted after email verification or expiration

### 4. **Team** (Collaboration Unit)
- **Purpose**: Groups of users working together on projects
- **Key Fields**:
  - `name`: Team name (unique within organization)
  - `organization`: Parent organization reference
  - `members`: Array of member objects with:
    - `user`: User reference
    - `role`: `"member"` or `"team_admin"`
    - `accessLevel`: `"read"`, `"write"`, or `"admin"`
- **Access Control**:
  - Team admins can add/remove members, manage access levels
  - Members inherit permissions from their access level
- **Constraints**: 
  - At least one team_admin must always exist
  - Team names unique per organization

### 5. **Project** (Work Container)
- **Purpose**: Individual projects with datasets and chat conversations
- **Key Fields**:
  - `name`, `description`: Project metadata
  - `team`: Parent team reference
  - `chats`: Array of chat conversations
  - `datasets`: Array of uploaded files with:
    - `name`, `url`, `uploadedBy`, `uploadedAt`
- **Access Control**: 
  - Accessible only to team members
  - Dataset uploads restricted to team admins
- **Features**:
  - Multiple chat sessions per project
  - Dataset management (CSV, Excel files via Cloudinary)

### 6. **Chat** (Conversation Container)
- **Purpose**: Individual chat sessions within a project
- **Key Fields**:
  - `project`: Parent project reference
  - `messages`: Array of message references
  - `dataset`: Optional dataset reference for context
- **Multi-Chat Support**: Projects can have multiple independent chat sessions

### 7. **Message** (Chat Content)
- **Purpose**: Individual messages in chat conversations
- **Key Fields**:
  - `chat`: Parent chat reference
  - `sender`: `"user"` or `"chatbot"`
  - `content`: Text content
  - `imageUrl`: Optional image attachment (Cloudinary)
  - `messageType`: `"text"`, `"image"`, or `"both"`
  - `confidenceScore`: AI confidence (0-1)
  - `references`: Array of reference links
  - `selectedDatasets`: Dataset IDs used for this message
  - `tempFiles`: Temporary files (max 3) not saved in DB
- **AI Integration**: Bot responses include confidence scores

---

## 🔐 Authentication & Authorization

### Authentication Layers

#### 1. **Organization Authentication**
- Separate login system for organization admins
- JWT token contains: `orgId`, `name`, `email`
- Can view all members and organization details

#### 2. **User Authentication**
- Email/password authentication
- Email verification required before login
- JWT token contains: `userId`, `organization`, `email`, `role`
- Token expiry: 24 hours

### Authorization Hierarchy

```
Superadmin (Global Access)
    ↓
Organization Owner (Org-level Access)
    ↓
Team Creator/Team Admin (Team-level Access)
    ↓
Team Member (Project-level Access based on accessLevel)
    - Admin Access: Full control
    - Write Access: Can modify
    - Read Access: View only
```

### Middleware Stack

1. **verifyToken**: Validates JWT and attaches user context
2. **isOrgOwner**: Ensures organization-level permissions
3. **requireTeamAdmin**: Ensures team admin role
4. **teamAuth**: Validates team membership and access
5. **loadTeam**: Middleware to load and validate team context
6. **loadProject**: Middleware to load and validate project context

### Access Control Rules

- **Organization Isolation**: Users can only access resources within their organization
- **Email Domain Validation**: User emails must match organization domain
- **Team Membership**: Project access requires team membership
- **Role-Based Actions**:
  - Dataset upload: Team admins only
  - Team creation: Users with `team_creator` role
  - Member promotion: Organization owners only

---

## 🚀 Core Features & Components

### 1. **Organization Management**
**Capabilities**:
- Organization registration and authentication
- Member listing and management
- User role promotion (user → team_creator)
- Organization CRUD operations

**API Endpoints**:
- `POST /api/organizations/register` - Create organization
- `POST /api/organizations/login` - Org admin login
- `GET /api/organizations/:id` - Get org details with members
- `GET /api/organizations/:orgId/members` - List all members
- `PUT /api/organizations/:orgId/users/:userId/make-creator` - Promote user
- `PUT /api/organizations/:id` - Update organization
- `DELETE /api/organizations/:id` - Delete organization
- `GET /api/organizations` - List all organizations

### 2. **User Management**
**Capabilities**:
- User registration with email verification
- 6-digit verification code via email (1-hour expiry)
- Login with verified credentials
- User listing and profile retrieval

**API Endpoints**:
- `POST /api/users/register` - Register pending user
- `POST /api/users/verify` - Verify email with code
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout
- `GET /api/users` - List all users in organization
- `GET /api/users/:id` - Get user by ID

**Email System**:
- Uses Nodemailer with Gmail SMTP
- Verification code format: 6-digit number
- Auto-cleanup of expired pending users (TTL index)

### 3. **Team Management**
**Capabilities**:
- Create teams within organization
- Add/remove members with role assignment
- Change team admin
- Adjust member access levels
- Team listing and details

**API Endpoints**:
- `POST /api/teams` - Create team
- `POST /api/teams/:id/members` - Add member
- `DELETE /api/teams/:id/members` - Remove member
- `GET /api/teams/:id` - Get team details
- `GET /api/teams/user` - Get current user's teams
- `GET /api/teams` - List all teams in organization
- `DELETE /api/teams/:id` - Delete team
- `PUT /api/teams/:id/change-admin` - Change team admin
- `PUT /api/teams/:id/access-level` - Change member access

**Team Features**:
- Unique team names per organization
- Multi-admin support (can have multiple team_admins)
- Granular access control (read/write/admin)
- Protection against removing last admin

### 4. **Project Management**
**Capabilities**:
- Create projects under teams
- Project CRUD operations
- Multiple chat sessions per project
- Dataset management (upload, list)
- Project listing with organization filtering

**API Endpoints**:
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project (cascades chats/messages)
- `GET /api/projects` - List all projects
- `POST /api/projects/chat` - Create new chat for project
- `POST /api/projects/:projectId/datasets` - Upload datasets
- `GET /api/projects/:projectId/datasets` - List datasets

**Dataset Features**:
- File upload to Cloudinary
- Supported formats: CSV, XLS, XLSX
- Stored in "project-datasets" folder
- Metadata tracking (uploader, timestamp)
- Admin-only upload permission

### 5. **AI Chat System**
**Capabilities**:
- Project-based chat conversations
- Multi-chat support per project
- Text and image message support
- Dataset-aware AI responses
- Temporary file uploads (max 3 per message)
- Chat history retrieval

**API Endpoints**:
- `POST /api/chat` - Send user message (text/files/datasets)
- `POST /api/chat/ai` - Get AI response
- `GET /api/chat/:projectId/:chatId` - Get chat history
- `POST /api/chat/create` - Create chat manually

**AI Integration**:
- **Provider**: Azure AI / GitHub Models API
- **Model**: Configurable (from environment)
- **Features**:
  - Context-aware responses using selected datasets
  - Temporary file context inclusion
  - Confidence scoring on responses
  - System prompts for behavior tuning
- **Message Flow**:
  1. User sends message with optional datasets/files
  2. Message saved to database
  3. AI request includes dataset info and file context
  4. Bot response saved with confidence score

**Chat Features**:
- Auto-create chat on first message (if not specified)
- Access control via team membership
- Message history with timestamps
- Support for multiple concurrent chats
- Dataset selection per message
- Temporary file uploads (not persisted)

---

## 🔌 External Integrations

### 1. **Cloudinary**
- **Purpose**: File storage for datasets and images
- **Configuration**:
  - Cloud name, API key, API secret from environment
  - Folder: "project-datasets"
  - Formats: CSV, XLS, XLSX (for datasets), images
- **Usage**:
  - Project dataset uploads
  - Message image attachments

### 2. **Azure AI / GitHub Models**
- **Purpose**: AI-powered chat responses
- **Configuration**:
  - Token: `GITHUB_TOKEN`
  - Endpoint: `GITHUB_AI_ENDPOINT`
  - Model: `GITHUB_AI_MODEL`
- **Implementation**: REST API via `@azure-rest/ai-inference`
- **Features**: 
  - Chat completions
  - Confidence scoring
  - Context injection (datasets, files)

### 3. **Nodemailer (Email)**
- **Purpose**: Send verification emails
- **Provider**: Gmail SMTP
- **Configuration**:
  - User: `EMAIL_USER`
  - Password: `EMAIL_PASS`
- **Usage**: 6-digit verification codes for user registration

### 4. **MongoDB Atlas**
- **Purpose**: Primary database
- **Connection**: Mongoose ODM
- **Features**:
  - TTL indexes for auto-cleanup (pending users)
  - Compound unique indexes (team names per org)
  - Virtual population (organization members)
  - Reference-based relationships

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer + Cloudinary
- **Email**: Nodemailer
- **AI Integration**: Azure AI REST client
- **Validation**: express-validator

### Key Dependencies
```json
{
  "@azure-rest/ai-inference": "^1.0.0-beta.6",
  "express": "^4.21.2",
  "mongoose": "^8.15.2",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^3.0.2",
  "multer": "^2.0.2",
  "cloudinary": "^1.41.3",
  "nodemailer": "^6.10.0"
}
```

### Middleware Stack
1. **cors**: Cross-origin resource sharing
2. **body-parser**: JSON/URL-encoded parsing
3. **cookie-parser**: Cookie handling
4. **express-session**: Session management
5. **multer**: File uploads
6. **Custom auth middlewares**: JWT verification, role checks

---

## 🌐 API Structure

### Base Routes
```
/api/users          - User authentication & management
/api/organizations  - Organization CRUD & admin functions
/api/teams          - Team management & membership
/api/projects       - Project CRUD & dataset management
/api/chat           - AI chat conversations
```

### Authentication Flow
```
1. Organization registers → receives JWT
2. Users register with org domain email → pending state
3. Email verification code sent → user verifies
4. User can login → receives JWT
5. All subsequent requests include JWT in Authorization header
```

### Request Flow Example
```
Client Request
    ↓
Express Middleware (CORS, body-parser, etc.)
    ↓
JWT Verification Middleware (verifyToken)
    ↓
Authorization Middleware (role/access checks)
    ↓
Route Handler (controller)
    ↓
Database Operations (Mongoose models)
    ↓
External API Calls (AI, Cloudinary, Email)
    ↓
Response to Client
```

---

## 📁 Project Structure

```
backend/
├── config/
│   ├── cloudinary.js       # Cloudinary configuration
│   ├── db.js                # MongoDB connection
│   ├── expressConfig.js     # Express middleware setup
│   ├── google.js            # Google OAuth (optional)
│   ├── open-ai.js           # OpenAI config
│   └── openaiRunner.js      # OpenAI runner
├── controllers/
│   ├── chatController.js           # Chat & AI logic
│   ├── organizationController.js   # Org management
│   ├── projectController.js        # Project CRUD
│   ├── teamController.js           # Team operations
│   └── userController.js           # User auth & verification
├── middlewares/
│   ├── auth.js              # JWT verification
│   ├── isOrgOwner.js        # Org-level authorization
│   ├── requireTeamAdmin.js  # Team admin check
│   ├── teamAuth.js          # Team membership check
│   └── upload.js            # File upload middleware
├── models/
│   ├── adminSchema.js
│   ├── chatSchema.js        # Chat sessions
│   ├── messageSchema.js     # Chat messages
│   ├── organizationSchema.js
│   ├── pendingUserSchema.js # Unverified users
│   ├── projectSchema.js
│   ├── teamSchema.js
│   └── userSchema.js
├── routes/
│   ├── chatRoutes.js
│   ├── organizationRoutes.js
│   ├── projectRoutes.js
│   ├── teamRoutes.js
│   ├── userRoutes.js
│   └── index.js             # Route aggregator
└── index.js                  # App entry point
```

---

## 🔒 Security Features

### 1. **Password Security**
- Bcrypt hashing with salt rounds (10)
- Pre-save hooks for automatic hashing
- Password comparison methods on user models

### 2. **Authentication Security**
- JWT tokens with 24-hour expiry
- Token verification on protected routes
- Bearer token format

### 3. **Authorization Security**
- Multi-level access control (org, team, project)
- Role-based permissions
- Access level granularity (read/write/admin)

### 4. **Data Isolation**
- Organization-level data segregation
- Team membership validation
- Project access restricted to team members

### 5. **Input Validation**
- Email domain validation against organization
- Required field checks
- Unique constraint enforcement (emails, domains, team names)

### 6. **Email Verification**
- Required before account activation
- Time-limited verification codes (1 hour)
- Auto-cleanup of expired pending users

---

## 🎨 Key Design Patterns

### 1. **Hierarchical Multi-Tenancy**
- Organization → Teams → Projects → Chats → Messages
- Data isolation at organization level
- Cascading permissions down the hierarchy

### 2. **Middleware Chain Pattern**
- Modular authentication and authorization
- Reusable middleware components
- Request context enrichment (req.user, req.team, req.project)

### 3. **Repository Pattern**
- Mongoose models as data access layer
- Business logic in controllers
- Clean separation of concerns

### 4. **Virtual Population**
- Organization members populated virtually
- Efficient relationship traversal
- Lazy loading of related data

### 5. **Soft Verification**
- Pending user pattern for email verification
- Temporary storage with auto-expiry
- State transition (pending → verified)

---

## 📊 Data Flow Diagrams

### User Registration Flow
```
User submits registration
    → Email domain validated against Organization
    → PendingUser created with verification code
    → Email sent with 6-digit code
    → User enters code
    → PendingUser validated
    → User created (verified)
    → PendingUser deleted
    → User can login
```

### Chat Message Flow
```
User sends message + selects datasets + uploads temp files
    → Team membership validated
    → Message saved to database
    → AI request prepared with:
        - Message content
        - Dataset metadata
        - Temporary file info
    → AI processes and responds
    → Bot message saved with confidence score
    → Response returned to user
```

### Project Access Flow
```
User requests project
    → JWT verified
    → Project loaded
    → Team populated with members
    → Organization match checked
    → User membership verified
    → Access level determined
    → Access granted/denied
```

---

## 🎯 Use Cases

### 1. **Enterprise Team Collaboration**
- Companies can register with their domain
- Create multiple teams for different departments
- Teams work on isolated projects
- Role-based access control for data security

### 2. **AI-Powered Data Analysis**
- Upload datasets (CSV, Excel) to projects
- Chat with AI about data insights
- Select specific datasets for context
- Get confidence-scored responses

### 3. **Multi-Project Management**
- Teams manage multiple projects simultaneously
- Each project has independent chat sessions
- Dataset library per project
- Organized conversation history

### 4. **Educational Institutions**
- Schools/universities as organizations
- Teams represent classes or research groups
- Projects for assignments or research
- AI assistant for data interpretation

### 5. **Consulting Firms**
- Organization represents consultancy
- Teams for client accounts
- Projects for client engagements
- Secure data isolation per client

---

## 🚀 Scalability Considerations

### Current Architecture
- **Database**: MongoDB with indexing for performance
- **Authentication**: Stateless JWT (horizontally scalable)
- **File Storage**: Cloud-based (Cloudinary)
- **AI Integration**: External API (scalable independently)

### Potential Bottlenecks
1. MongoDB connections under high load
2. Large message history retrieval
3. AI API rate limits
4. Cloudinary storage limits

### Optimization Opportunities
1. **Caching**: Redis for frequently accessed data
2. **Pagination**: Implement cursor-based pagination for large lists
3. **Message Archiving**: Move old messages to cold storage
4. **Load Balancing**: Distribute across multiple server instances
5. **CDN**: Use CDN for static assets and uploaded files
6. **Database Sharding**: Organization-based sharding for multi-tenancy

---

## 📋 Environment Configuration

### Required Environment Variables
```env
# Database
CONNECTION_STRING=mongodb+srv://...

# JWT Authentication
JWT_SECRET=your_secret_key

# Email Service (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Azure AI / GitHub Models
GITHUB_TOKEN=your_github_token
GITHUB_AI_ENDPOINT=https://models.inference.ai.azure.com
GITHUB_AI_MODEL=gpt-4o

# Server
PORT=3000
```

---

## 🎓 Summary

This platform is a **sophisticated multi-tenant B2B SaaS application** that combines:
- **Organization Management**: Multi-tenant architecture with domain-based isolation
- **Team Collaboration**: Hierarchical team structures with granular permissions
- **Project Management**: Dataset-enabled projects with CRUD operations
- **AI Chat Integration**: Context-aware AI conversations with dataset intelligence
- **Robust Security**: JWT authentication, RBAC, email verification, and data isolation

The system is designed for **enterprise use cases** where organizations need to:
1. Manage multiple teams and projects securely
2. Collaborate on data-driven projects
3. Leverage AI for insights and analysis
4. Maintain strict access control and data isolation

**Key Strengths**:
- Clean separation of concerns
- Scalable architecture
- Comprehensive authorization system
- Rich AI integration capabilities
- Production-ready security features

