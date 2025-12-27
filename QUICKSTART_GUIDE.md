# Department Management System - Quick Start Guide

## What's New?

The maintenance tracker now has a complete **Department Management System** that allows:
- ✅ Create, read, update, and delete departments
- ✅ Assign users to departments
- ✅ Filter team members by department when assigning tasks
- ✅ Manage all from the new "Departments" admin panel

---

## Getting Started (5 Minutes)

### 1. Start the Backend Server
```bash
cd server
npx prisma generate          # Sync database schema
npm run dev                  # Start server on localhost:5000
```

### 2. Start the Frontend
```bash
cd ../client
npm run dev                  # Start app on localhost:5173 (or configured port)
```

### 3. Access Admin Panel
- Login as an ADMIN user
- Navigate to Dashboard → Departments tab

### 4. Create Your First Department
```
Click "Create New Department"
Name: "Warehouse"
Description: "Warehouse equipment maintenance"
Submit
✅ Department created!
```

### 5. Assign Users to Departments
- Go to Users Management
- Click "Create User" or "Edit User"
- Select department from dropdown
- Save
✅ User assigned to department!

### 6. Create Maintenance Request
- Go to Requests
- Create new request
- Select equipment (e.g., Forklift in Warehouse)
- In "Assigned To" dropdown, only warehouse team members appear
✅ Smart filtering based on department!

---

## API Quick Reference

### Get All Departments
```bash
curl http://localhost:5000/api/departments \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Department (ADMIN ONLY)
```bash
curl -X POST http://localhost:5000/api/departments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Warehouse",
    "description": "Warehouse equipment"
  }'
```

### Update Department (ADMIN ONLY)
```bash
curl -X PATCH http://localhost:5000/api/departments/DEPT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Updated Name",
    "description": "Updated description"
  }'
```

### Delete Department (ADMIN ONLY)
```bash
curl -X DELETE http://localhost:5000/api/departments/DEPT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Key Features

### 🎯 Smart Member Filtering
When creating a maintenance request, the "Assigned To" dropdown automatically shows only team members from the same department as the equipment.

**Example**:
- Equipment: "Forklift" (Department: "Warehouse")
- Available members: Only users with departmentId = "Warehouse"
- Result: Manager sees only relevant team members

### 🔒 Admin-Only Operations
Only users with ADMIN role can:
- Create departments
- Edit department names
- Delete departments

Regular users can:
- View all departments
- Be assigned to departments

### ✅ Safety Validations
- Prevents duplicate department names
- Prevents deletion of departments with assigned users
- Validates department assignment before creating users
- Ensures member filtering shows only available staff

### 📊 Department Dashboard
See all departments at a glance:
- Department names and descriptions
- Number of users in each department
- Quick edit/delete actions
- Search by department name

---

## Common Tasks

### Create a New Department
1. Admin Dashboard → Departments
2. Click "Create New Department"
3. Enter name (required) and description (optional)
4. Click Create
5. ✅ Department appears in list

### Add User to Department
1. Admin Dashboard → Users
2. Click "Create User" or edit existing user
3. Select department from dropdown
4. Click Create/Update
5. ✅ User now assigned to department

### Update Department Name
1. Admin Dashboard → Departments
2. Click edit icon on department
3. Change name and/or description
4. Click Update
5. ✅ Department updated

### Delete Department
1. Admin Dashboard → Departments
2. Make sure no users are assigned
3. Click delete icon
4. Confirm
5. ✅ Department deleted

### Assign Equipment to Department
1. Admin Dashboard → Equipment
2. When creating/editing equipment
3. Select or enter department (used for filtering)
4. Save
5. ✅ Equipment now filtered by this department

---

## File Locations

### Backend
- **Department Controller**: `server/src/controllers/departmentController.ts`
- **Department Routes**: `server/src/routes/departmentRoutes.ts`
- **Database Schema**: `server/prisma/schema.prisma`

### Frontend
- **Department Management UI**: `client/src/components/AdminDepartmentsManagement.jsx`
- **User Creation/Edit**: `client/src/components/CreateUserModal.jsx`, `EditUserModal.jsx`
- **Member Filtering**: `client/src/components/RequestModal.jsx`
- **Admin Panel**: `client/src/components/AdminDashboard.jsx`

---

## Troubleshooting

### Empty Department Dropdown
**Problem**: Department list not showing in user creation
**Solution**: 
1. Check if `/api/departments` endpoint returns data
2. Ensure user is logged in
3. Verify departments were created in admin panel

### Member Filtering Not Working
**Problem**: Assigned To dropdown showing all members
**Solution**:
1. Verify equipment has department field set
2. Check if team members have departmentId assigned
3. Ensure departmentId matches equipment.department

### Cannot Delete Department
**Problem**: Delete button shows error
**Solution**:
1. Check how many users are assigned
2. Edit those users and assign to different department
3. Then try deleting again

### TypeScript Errors
**Problem**: "Department does not exist on type"
**Solution**:
1. Run: `npx prisma generate` in server folder
2. Restart backend server
3. Errors should clear

---

## Data Model

```
Department
├── id: unique identifier
├── name: department name (unique)
├── description: optional details
└── users: array of assigned users

User
├── id: user identifier
├── name: user name
├── email: unique email
├── departmentId: which department user belongs to
├── teamId: which team user is in
└── other fields...

Equipment
├── id: equipment identifier
├── name: equipment name
├── department: department where equipment is located
└── other fields...

MaintenanceRequest
├── id: request identifier
├── equipmentId: which equipment needs maintenance
├── assignedToId: which user is assigned (must be from same department as equipment)
└── other fields...
```

---

## Best Practices

1. **Create Departments First**
   - Set up all your departments before creating users
   - Examples: "Warehouse", "Factory", "Assembly", "Office"

2. **Assign Users to Departments**
   - When creating users, immediately assign to department
   - Group team members by physical location/department

3. **Match Equipment to Departments**
   - When adding equipment, set its department
   - Ensures correct team members see assignment opportunities

4. **Use Descriptive Names**
   - Department names: "Warehouse", "Factory Floor", "Assembly Line"
   - Avoid abbreviations that might be unclear

5. **Regular Review**
   - Review department assignments monthly
   - Update when team members change departments
   - Archive unused departments

---

## Next Steps

After setup, consider:
- [ ] Create initial departments (3-5 typical)
- [ ] Import existing users and assign departments
- [ ] Update all equipment with correct department location
- [ ] Test member filtering with a maintenance request
- [ ] Train admin users on department management
- [ ] Set up backup/disaster recovery procedures

---

## Support

For issues or questions:
1. Check DEPARTMENT_SYSTEM_IMPLEMENTATION_SUMMARY.md for detailed documentation
2. Review VERIFICATION_REPORT.md for technical details
3. Check browser console for errors (F12)
4. Check server logs for API errors

---

**Version**: 1.0.0
**Last Updated**: 2025-12-27
**Status**: ✅ Production Ready
