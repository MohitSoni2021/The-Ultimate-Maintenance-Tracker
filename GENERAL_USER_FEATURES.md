# GearGuard - General User Features & Dashboard

## Overview
The General User Dashboard provides a clean, intuitive interface for reporting and tracking maintenance issues. The application is designed to help users manage maintenance requests efficiently.

---

## 🎯 General User Access Level
- **Role**: GENERAL (default user role)
- **Restrictions**: Read-only and creation permissions for own requests only
- **Unavailable**: Cannot assign technicians, manage teams, or access admin features

---

## 📋 Dashboard Navigation

The General User Dashboard includes a **Left Sidebar** with the following navigation options:

### 1. **Dashboard** (Home)
- **Access**: Click "Dashboard" in sidebar
- **Features**:
  - Welcome greeting with username
  - Quick action button: "Report a Problem"
  - Recent Activity section showing latest requests
  - Quick Stats panel (Active Requests, Completed count)
  - Quick Actions panel
- **Purpose**: Central hub for quick overview and action

### 2. **My Requests**
- **Access**: Click "My Requests" in sidebar
- **Tabs**:
  - **Active Requests**: View requests with status Open, Assigned, or In Progress
  - **All Requests**: View complete request history including completed and cancelled
- **Information Displayed**:
  - Request Title/Subject
  - Equipment Name
  - Status Badge (color-coded)
  - Priority Badge (Low, Medium, High, Critical)
  - Request Type (Corrective or Preventive)
  - Creation Date
  - Assigned Technician (if applicable)
- **Actions**:
  - Click any request card to view full details
  - Details modal shows:
    - Complete request information
    - Equipment details (serial number, location, category, department)
    - Description and notes
    - Created date and creator
    - Assigned technician details
    - Scheduled date (for preventive)
    - Completion duration (if completed)

### 3. **Equipment Search**
- **Access**: Click "Equipment" in sidebar
- **Features**:
  - Search by equipment name or serial number
  - Filter by department
  - Filter by category
  - Browse all available equipment
- **Information Displayed**:
  - Equipment Name
  - Serial Number
  - Category
  - Department
  - Location
  - Assigned Maintenance Team
- **Purpose**: Find the correct equipment when creating a maintenance request

### 4. **Calendar View**
- **Access**: Click "Calendar" in sidebar
- **Features**:
  - Monthly calendar display
  - Navigate between months
  - View scheduled preventive maintenance requests
  - Status indicators on dates with scheduled work
  - Color-coded status badges
  - Quick stats for the month (Open, Assigned, Completed counts)
- **Restrictions**:
  - Read-only view
  - Cannot create requests directly from calendar
  - Shows only user's own scheduled maintenance

### 5. **Profile**
- **Access**: Click "Profile" in sidebar
- **Information**:
  - User avatar/initials
  - Full name
  - Email address
  - Team assignment (if applicable)
  - User ID
  - User role badge
- **Actions**:
  - Logout button

---

## 🔧 Core Functionality

### Create Maintenance Request
**Access**: "Report a Problem" or "+ New Request" button (available everywhere)

**Form Fields**:
- **Equipment** (required)
  - Searchable dropdown with all available equipment
  - Auto-fills: Category, Location, Department, Assigned Team
- **Subject** (required)
  - "What's wrong?" description
- **Request Type** (required)
  - Corrective: Fix an existing problem
  - Preventive: Schedule maintenance
- **Priority** (optional)
  - Low, Medium, High, Critical
  - Defaults to Medium
- **Scheduled Date** (optional)
  - Only appears for Preventive requests
- **Description** (optional)
  - Detailed notes about the issue

**Auto-Fill Behavior**:
- When equipment is selected:
  - Category auto-displays (read-only)
  - Location auto-displays (read-only)
  - Department auto-displays (read-only)
  - Assigned Team auto-displays (read-only)

---

## 📊 Request Status Flow

### Status Stages
1. **OPEN** 🔵
   - Newly created requests
   - Awaiting technician assignment

2. **ASSIGNED** 🟡
   - Technician has been assigned
   - Work not yet started

3. **IN_PROGRESS** 🟠
   - Work is currently being performed
   - Technician is actively working

4. **COMPLETED** 🟢
   - Work has been finished
   - Duration shows how long it took

5. **CANCELLED** 🔴
   - Request has been cancelled
   - Typically due to no longer needed

---

## 🚫 Features NOT Available to General Users

### Cannot Do
- ❌ Assign requests to technicians
- ❌ Change request status/stage
- ❌ Edit or delete requests created by others
- ❌ Drag requests on Kanban board
- ❌ Create or edit equipment
- ❌ Manage maintenance teams
- ❌ Manage other users
- ❌ View or generate reports
- ❌ Access admin features
- ❌ View requests created by other users

### Read-Only Access
- ✓ View equipment inventory
- ✓ View own requests only
- ✓ View calendar (own requests only)
- ✓ View request history (own requests only)

---

## 💡 Best Practices for General Users

### When Creating a Request
1. Select the correct equipment from the dropdown
2. Provide a clear, descriptive subject
3. Choose the appropriate request type:
   - **Corrective**: Use for immediate problems
   - **Preventive**: Use for scheduled maintenance
4. Add details in the description field
5. Set priority appropriately (Critical = urgent, Low = can wait)
6. For preventive requests, set a scheduled date

### When Viewing Requests
1. Check the status regularly for updates
2. Assigned technician name shows who is handling the request
3. Click on request cards for full details
4. Use Calendar view to see scheduled maintenance timeline

### Using Equipment Search
1. Search by exact name or partial name
2. Use department filter to narrow down results
3. Use category filter for specific equipment types
4. Reference Serial Number when creating requests if needed

---

## 🔐 Access Control

**What General Users Can See**:
- ✓ Their own requests only
- ✓ Complete equipment inventory
- ✓ Their own scheduled maintenance (calendar)
- ✓ Their own user profile

**What General Users Cannot See**:
- ❌ Other users' requests
- ❌ User management interface
- ❌ Team management
- ❌ System reports
- ❌ Admin dashboard

---

## 📱 Interface Layout

### Header (Top)
- GearGuard logo (left)
- Current page title (center-left)
- "+ New Request" button (right)

### Sidebar (Left)
- Navigation menu with 5 main options
- Logout button at bottom
- User role indicator

### Main Content Area
- Full-width responsive layout
- Content changes based on sidebar selection
- Modal dialogs for forms and details

---

## 🎨 Visual Indicators

### Status Colors
- OPEN: 🔵 Blue
- ASSIGNED: 🟡 Yellow
- IN_PROGRESS: 🟠 Orange
- COMPLETED: 🟢 Green
- CANCELLED: 🔴 Red

### Priority Colors
- LOW: Green
- MEDIUM: Blue
- HIGH: Orange
- CRITICAL: Red

---

## ✨ Key Features Summary

| Feature | Available | Notes |
|---------|-----------|-------|
| Create Request | ✅ Yes | Corrective & Preventive |
| View My Requests | ✅ Yes | Active & History |
| View Request Details | ✅ Yes | Read-only |
| Search Equipment | ✅ Yes | Read-only, searchable |
| View Calendar | ✅ Yes | Own requests only |
| View Profile | ✅ Yes | Own profile only |
| Edit Request | ❌ No | Not allowed |
| Delete Request | ❌ No | Not allowed |
| Assign Technician | ❌ No | Managers/Admins only |
| Change Status | ❌ No | Technicians only |
| Manage Teams | ❌ No | Admins only |
| Manage Equipment | ❌ No | Admins only |
| View Reports | ❌ No | Managers/Admins only |

---

## 🔗 Related Roles

- **TECHNICIAN**: Can view assigned requests, update status, complete work
- **MANAGER**: Can assign requests, manage team, view reports
- **ADMIN**: Full system access, user management, system configuration
