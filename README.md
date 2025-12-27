# GearGuard: The Ultimate Maintenance Tracker

## Project Overview

**GearGuard** is a comprehensive maintenance tracking system designed to streamline asset management, maintenance request handling, and team coordination. Built with modern web technologies, it provides an intuitive platform for organizations to track equipment, manage maintenance workflows, and ensure optimal operational efficiency.

**Core Philosophy:** Connect Equipment, Teams, and Requests—creating a seamless ecosystem where maintenance activities are tracked, prioritized, and executed with precision.

### Key Objectives

- **Track Assets**: Maintain a centralized inventory of all equipment with lifecycle management (active, repaired, or scrapped)
- **Manage Requests**: Create, assign, and track maintenance requests through various stages (new, in-progress, repaired, scrap)
- **Team Coordination**: Organize technicians into departments and teams for efficient workload distribution
- **Role-Based Access**: Enforce security through granular permission controls for different user roles
- **Smart Automation**: Implement business logic for auto-fill suggestions, equipment deactivation, and overdue tracking

---

## Tech Stack

### Frontend
- **React 19** with **Vite** for fast development and optimized builds
- **Tailwind CSS** for responsive, utility-first styling
- **Redux Toolkit** for state management
- **Axios** for HTTP requests with interceptors
- **@dnd-kit** for drag-and-drop Kanban board functionality
- **react-big-calendar** for calendar view of maintenance activities
- **react-hot-toast** for user notifications
- **lucide-react** for icon components
- **date-fns** for date manipulation and formatting

### Backend
- **Node.js** (v20+) with **Express.js** for RESTful API
- **TypeScript** for type-safe server code
- **Prisma ORM** for database management with full type safety, automatic migrations, and relationship management
- **JWT (JSON Web Tokens)** with **bcrypt** for secure authentication and password hashing
- **Middleware** for authentication validation and role-based access control

### Database
- **PostgreSQL 18+** with **Prisma Client**
  - **ACID Compliance**: Guarantees data integrity for critical maintenance records
  - **Scalability**: Designed to handle enterprise-level data volumes
  - **Reliability**: Proven stability for mission-critical applications
  - **Type Safety**: Prisma generates TypeScript types from schema automatically
  - **Migrations**: Version-controlled database schema evolution

---

## Features

### User Interface
- **Kanban Board**: Visualize maintenance requests with drag-and-drop status management
- **Calendar View**: Track maintenance activities across time with intuitive scheduling
- **Equipment Search**: Quick lookup of assets with advanced filtering
- **Smart Buttons**: Context-aware actions based on request status and equipment availability
- **User Dashboard**: Role-specific views (General User, Technician, Manager, Admin)
- **Team Management**: Create and organize maintenance teams by department

### Backend Features

#### RESTful API Endpoints
The backend provides a complete REST API with endpoints for:
- **Authentication**: `/auth/login`, `/auth/logout`
- **Users**: `/api/users` (CRUD operations)
- **Teams**: `/api/teams` (create, assign, manage)
- **Equipment**: `/api/equipment` (inventory management)
- **Requests**: `/api/requests` (maintenance request lifecycle)
- **Departments**: `/api/departments` (organizational structure)
- **Analytics**: Admin analytics endpoints for reporting

#### Authentication System
- **JWT-Based Authentication**: Tokens issued on login with configurable expiration
- **Bcrypt Password Hashing**: Passwords hashed with salt rounds for maximum security
- **Middleware Protection**: All protected routes validate JWT tokens before access
- **Role-Based Guards**: Middleware enforces role-based access control (RBAC) on specific endpoints
- **Admin-Only Creation**: User, team, and equipment creation restricted to administrators
- **Secure Session Management**: No plaintext passwords stored; tokens refreshed securely

#### Database Integration with PostgreSQL
- **Relational Models**: User, MaintenanceTeam, Equipment, MaintenanceRequest
- **Type-Safe Queries**: Prisma Client generates TypeScript types for all database operations
- **Enum Types**: Role (ADMIN, MANAGER, TECHNICIAN, USER), RequestType (PREVENTIVE, CORRECTIVE, EMERGENCY), Stage (NEW, IN_PROGRESS, REPAIRED, SCRAP)
- **Relations**: One-to-Many (Equipment → Team, Request → Equipment), Many-to-Many (User ↔ Team)
- **Computed Fields**: Automatic calculation of `openRequestCount`, `totalEquipmentCount`
- **Indexing & Constraints**: Performance optimization and data integrity enforcement

#### Business Logic & Automation
- **Auto-Fill Suggestions**: Recommend technicians based on department and past requests
- **Equipment Lifecycle**: Automatic deactivation when requests are marked as scrap
- **Overdue Tracking**: Identify maintenance requests exceeding SLA times
- **Request Stage Management**: Enforce valid transitions (NEW → IN_PROGRESS → REPAIRED or SCRAP)
- **Team Restrictions**: Technicians only view equipment and requests assigned to their team

#### Security Features
- **Department Isolation**: Teams and their members are scoped to departments
- **Technician Permissions**: Limited to their assigned team's equipment and requests
- **Admin Controls**: Full system access with user/team/equipment management
- **Data Validation**: Server-side validation of all inputs
- **CORS Protection**: Cross-origin requests validated

---

## Database Schema

```prisma
// Enums for structured data
enum Role {
  ADMIN
  MANAGER
  TECHNICIAN
  USER
}

enum RequestType {
  PREVENTIVE
  CORRECTIVE
  EMERGENCY
}

enum Stage {
  NEW
  IN_PROGRESS
  REPAIRED
  SCRAP
}

// User model
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Bcrypt hashed
  name      String
  role      Role     @default(USER)
  department Department?
  departmentId String?
  teams     MaintenanceTeam[]
  requests  MaintenanceRequest[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Department model
model Department {
  id    String @id @default(cuid())
  name  String @unique
  users User[]
  teams MaintenanceTeam[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// MaintenanceTeam model
model MaintenanceTeam {
  id              String   @id @default(cuid())
  name            String
  department      Department @relation(fields: [departmentId], references: [id])
  departmentId    String
  users           User[]
  equipment       Equipment[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([name, departmentId])
}

// Equipment model
model Equipment {
  id                  String   @id @default(cuid())
  name                String
  description         String?
  team                MaintenanceTeam @relation(fields: [teamId], references: [id])
  teamId              String
  isActive            Boolean  @default(true)
  requests            MaintenanceRequest[]
  openRequestCount    Int      @default(0)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}

// MaintenanceRequest model
model MaintenanceRequest {
  id          String   @id @default(cuid())
  title       String
  description String?
  type        RequestType @default(CORRECTIVE)
  stage       Stage    @default(NEW)
  equipment   Equipment @relation(fields: [equipmentId], references: [id])
  equipmentId String
  assignedTo  User?    @relation(fields: [assignedToId], references: [id])
  assignedToId String?
  createdBy   User?    @relation("RequestCreatedBy", fields: [createdById], references: [id])
  createdById String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  completedAt DateTime?
}
```

### Key Relations
- **User ↔ MaintenanceTeam**: Many-to-Many (users assigned to teams)
- **User → Department**: One-to-Many (users belong to departments)
- **Equipment → MaintenanceTeam**: Many-to-One (team manages equipment)
- **MaintenanceRequest → Equipment**: Many-to-One (multiple requests per equipment)
- **MaintenanceRequest → User**: Many-to-One (user assigned to request)

---

## Role-Based Access Control (RBAC)

### Admin
- **Full System Access**: Create, read, update, and delete all resources
- **User Management**: Add/remove users, assign roles and departments
- **Team Management**: Create teams, assign technicians and equipment
- **Equipment Management**: Add, modify, or deactivate assets
- **Request Oversight**: View all requests, reassign, and track system-wide metrics
- **Analytics Dashboard**: Access to system-wide analytics and reporting

### Manager
- **Department Oversight**: Manage users and teams within their department
- **Request Monitoring**: View requests for their teams, track metrics
- **Analytics**: Department-level analytics and performance tracking
- **Team Assignment**: Assign requests to technicians in their teams

### Technician
- **Team-Scoped Access**: View only equipment and requests assigned to their team
- **Request Management**: Create requests, update status (NEW → IN_PROGRESS → REPAIRED/SCRAP)
- **Team Equipment**: View and maintain equipment assigned to their team
- **Limited Profile**: Cannot create users, teams, or manage other technicians

### General User
- **Request Creation**: Create maintenance requests for equipment
- **Profile Management**: View and update personal information
- **Request History**: View requests they have created
- **Equipment Browsing**: Search and view equipment inventory

---

## Installation & Setup

### Prerequisites
- **Node.js** 20.x or higher
- **npm** 10.x or higher
- **PostgreSQL** 18.x or higher
- **Git** for version control

### Step-by-Step Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/gearguard-maintenance-tracker.git
   cd gearguard-maintenance-tracker
   ```

2. **Install Server Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure Environment Variables**
   
   Create `.env` file in the `server/` directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/gearguard
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   PORT=5000
   NODE_ENV=development
   ```

5. **Set Up Database**
   ```bash
   cd server
   npx prisma migrate dev --name init
   ```

6. **Seed Initial Data**
   ```bash
   npm run seed
   ```
   This creates an admin user with credentials:
   - Email: `admin@example.com`
   - Password: `Admin@123456`

7. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

---

## Running the App

### Development Mode

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm run dev
```
Server runs on `http://localhost:5000`

**Terminal 2 - Start Frontend Development Server:**
```bash
cd client
npm run dev
```
Frontend runs on `http://localhost:5173`

### Production Build

**Backend:**
```bash
cd server
npm run build
npm start
```

**Frontend:**
```bash
cd client
npm run build
```
Generated static files in `dist/` ready for deployment.

### Database Management

View database in Prisma Studio:
```bash
cd server
npx prisma studio
```

---

## Deployment Suggestions

### Database Hosting
- **Supabase** (PostgreSQL managed service with free tier)
- **AWS RDS** (Amazon Relational Database Service)
- **Railway** (Simple PostgreSQL hosting)
- **Render** (PostgreSQL databases with automatic backups)

### Backend Deployment
- **Vercel** (Serverless Node.js with PostgreSQL support)
- **Heroku** (Classic application hosting)
- **Railway** (Modern deployment platform)
- **DigitalOcean App Platform** (VPS alternative)

### Frontend Deployment
- **Vercel** (Optimized for Next.js, but works with Vite)
- **Netlify** (Excellent GitHub integration, auto-deployment)
- **GitHub Pages** (Free static hosting for SPA)
- **CloudFlare Pages** (High-performance CDN)

### Recommended Stack
- **Database**: Supabase (PostgreSQL + Auth)
- **Backend**: Vercel with Node.js runtime
- **Frontend**: Netlify or Vercel

---

## Development Workflow

### API Testing
Use Postman or Thunder Client to test API endpoints:
- Import collection from `./postman-collections/` (if available)
- Authenticate with login endpoint to get JWT token
- Use token in Authorization header for protected routes

### Code Standards
- **TypeScript**: Strictly typed server code for reliability
- **ESLint**: Run `npm run lint` to check code quality
- **Prisma Best Practices**: Always run migrations before changes
- **Git Commits**: Use conventional commits (feat:, fix:, docs:)

---

## File Structure

```
gearguard-maintenance-tracker/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── store/            # Redux state management
│   │   ├── api/              # Axios HTTP client
│   │   └── main.jsx
│   └── package.json
├── server/                    # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Auth & RBAC middleware
│   │   ├── routes/            # API routes
│   │   ├── utils/             # Helper functions
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Database migrations
│   └── package.json
└── README.md
```

---

## Troubleshooting

### "Prisma Client not generated"
```bash
cd server
npx prisma generate
```

### "Cannot connect to PostgreSQL"
- Verify PostgreSQL is running: `psql -U postgres`
- Check DATABASE_URL in `.env`
- Ensure database exists: `createdb gearguard`

### JWT Token Errors
- Ensure JWT_SECRET is set in `.env` (minimum 32 characters)
- Clear browser localStorage and re-login

### Port Already in Use
- Change PORT in `.env` (e.g., PORT=5001)
- Or kill existing process: `lsof -i :5000`

---

## Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "feat: add new feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a Pull Request

Please ensure all tests pass and code follows project standards before submitting.

---

## License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review API endpoints in backend routes

---

**GearGuard: Maintain Excellence. Track Everything.**
