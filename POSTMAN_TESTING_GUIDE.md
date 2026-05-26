# 🧪 Complete API Testing Guide - Postman

## **STEP 1: Start Your Server**

```bash
npm run dev
# Server runs on http://localhost:3000
```

---

## **STEP 2: Setup in Postman**

### A. Create Environment Variable

1. **Click Environment Dropdown** (top-right corner)
2. **Click "Manage Environments"** → **"+"**
3. **Name:** `Dev`
4. **Add Variables:**
   | Variable | Initial Value | Current Value |
   |----------|---------------|---------------|
   | base_url | http://localhost:3000 | http://localhost:3000 |
   | admin_token | | (will fill after login) |
   | designer_token | | (will fill after login) |
   | developer_token | | (will fill after login) |
   | editor_token | | (will fill after login) |
   | task_id | | (will fill after creating task) |
   | folder_id | | (will fill after creating folder) |

5. **Save & Select this environment**

---

## **STEP 3: Register Admin Account**

### Request 1: Register Admin

```
POST {{base_url}}/api/auth/register-admin
```

**Body (raw JSON):**

```json
{
  "name": "Admin User",
  "email": "admin@scheduler.com",
  "password": "Admin@123"
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Admin registered successfully",
  "data": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@scheduler.com",
    "role": "admin",
    "is_active": true
  }
}
```

---

## **STEP 4: Admin Login**

### Request 2: Admin Login

```
POST {{base_url}}/api/auth/login
```

**Body (raw JSON):**

```json
{
  "email": "admin@scheduler.com",
  "password": "Admin@123"
}
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@scheduler.com",
      "role": "admin",
      "is_active": true
    }
  }
}
```

**✅ ACTION:** Copy the token and save it to environment variable `admin_token`

---

## **STEP 5: Create Users with Different Roles**

### Request 3: Create Designer User

```
POST {{base_url}}/api/users
```

**Headers:**

```
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "name": "John Designer",
  "email": "designer@scheduler.com",
  "password": "Designer@123",
  "role": "designer",
  "mobile_number": "+91-9876543210"
}
```

**Expected Response (201):** User created

---

### Request 4: Create Developer User

```
POST {{base_url}}/api/users
```

**Headers:**

```
Authorization: Bearer {{admin_token}}
```

**Body (raw JSON):**

```json
{
  "name": "Jane Developer",
  "email": "developer@scheduler.com",
  "password": "Developer@123",
  "role": "developer",
  "mobile_number": "+91-9876543211"
}
```

---

### Request 5: Create Editor User

```
POST {{base_url}}/api/users
```

**Headers:**

```
Authorization: Bearer {{admin_token}}
```

**Body (raw JSON):**

```json
{
  "name": "Mike Editor",
  "email": "editor@scheduler.com",
  "password": "Editor@123",
  "role": "editor",
  "mobile_number": "+91-9876543212"
}
```

---

## **STEP 6: Login with Each Role**

### Request 6: Login as Designer

```
POST {{base_url}}/api/auth/login
```

**Body:**

```json
{
  "email": "designer@scheduler.com",
  "password": "Designer@123"
}
```

**✅ ACTION:** Copy token → Save to `designer_token` environment variable

---

### Request 7: Login as Developer

```
POST {{base_url}}/api/auth/login
```

**Body:**

```json
{
  "email": "developer@scheduler.com",
  "password": "Developer@123"
}
```

**✅ ACTION:** Copy token → Save to `developer_token` environment variable

---

### Request 8: Login as Editor

```
POST {{base_url}}/api/auth/login
```

**Body:**

```json
{
  "email": "editor@scheduler.com",
  "password": "Editor@123"
}
```

**✅ ACTION:** Copy token → Save to `editor_token` environment variable

---

## **STEP 7: Create Folder (Admin)**

### Request 9: Create Folder

```
POST {{base_url}}/api/folders
```

**Headers:**

```
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "name": "Social Media Campaign 2024",
  "description": "Q1 Marketing Campaign Assets"
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Folder created successfully",
  "data": {
    "id": 1,
    "name": "Social Media Campaign 2024",
    "description": "Q1 Marketing Campaign Assets",
    "created_by": 1,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**✅ ACTION:** Copy folder ID → Save to `folder_id` environment variable

---

## **STEP 8: Get All Folders (Test All Roles)**

### Request 10: Get Folders as Admin

```
GET {{base_url}}/api/folders
```

**Headers:**

```
Authorization: Bearer {{admin_token}}
```

---

### Request 11: Get Folders as Designer

```
GET {{base_url}}/api/folders
```

**Headers:**

```
Authorization: Bearer {{designer_token}}
```

---

### Request 12: Get Folders as Developer

```
GET {{base_url}}/api/folders
```

**Headers:**

```
Authorization: Bearer {{developer_token}}
```

---

## **STEP 9: Upload Assets (Admin)**

### Request 13: Upload Assets

```
POST {{base_url}}/api/assets/upload
```

**Headers:**

```
Authorization: Bearer {{admin_token}}
```

**Body:**

- **Type:** form-data
- **Key:** `files` (type: File)
- **Value:** Select multiple image files (JPG, PNG, etc.)

**Note:** You can upload up to 10 files at once. Max 50MB per file.

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Assets uploaded successfully",
  "data": [
    {
      "id": 1,
      "filename": "1234567890-image1.jpg",
      "uploaded_by": 1,
      "created_at": "2024-01-15T10:45:00Z"
    }
  ]
}
```

---

## **STEP 10: Get All Assets**

### Request 14: Get Assets (Admin)

```
GET {{base_url}}/api/assets
```

**Headers:**

```
Authorization: Bearer {{admin_token}}
```

---

### Request 15: Get Assets (Designer)

```
GET {{base_url}}/api/assets
```

**Headers:**

```
Authorization: Bearer {{designer_token}}
```

---

## **STEP 11: Create Task (Assigned to Different Roles)**

### Request 16: Create Task - Assign to Designer

```
POST {{base_url}}/api/tasks
```

**Headers:**

```
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "title": "Design Social Media Banner",
  "description": "Create a 1920x1080 banner for Instagram campaign",
  "status": "pending",
  "priority": "high",
  "assigned_to": 2,
  "due_date": "2024-02-15T23:59:59Z"
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 1,
    "title": "Design Social Media Banner",
    "description": "Create a 1920x1080 banner for Instagram campaign",
    "status": "pending",
    "priority": "high",
    "assigned_to": 2,
    "created_by": 1,
    "due_date": "2024-02-15T23:59:59Z"
  }
}
```

**✅ ACTION:** Copy task ID → Save to `task_id` environment variable

---

### Request 17: Create Task - Assign to Developer

```
POST {{base_url}}/api/tasks
```

**Headers:**

```
Authorization: Bearer {{admin_token}}
```

**Body:**

```json
{
  "title": "Setup API Integration",
  "description": "Integrate social media APIs for posting",
  "status": "pending",
  "priority": "critical",
  "assigned_to": 3,
  "due_date": "2024-02-20T23:59:59Z"
}
```

---

### Request 18: Create Task - Assign to Editor

```
POST {{base_url}}/api/tasks
```

**Headers:**

```
Authorization: Bearer {{admin_token}}
```

**Body:**

```json
{
  "title": "Review Content Copy",
  "description": "Edit and proofread all social media captions",
  "status": "pending",
  "priority": "medium",
  "assigned_to": 4,
  "due_date": "2024-02-10T23:59:59Z"
}
```

---

## **STEP 12: Get All Tasks**

### Request 19: Get All Tasks (Admin)

```
GET {{base_url}}/api/tasks
```

**Headers:**

```
Authorization: Bearer {{admin_token}}
```

---

### Request 20: Get Tasks with Filters (by role)

```
GET {{base_url}}/api/tasks?assigned_to=2
```

**Headers:**

```
Authorization: Bearer {{admin_token}}
```

This gets tasks assigned to Designer (ID: 2)

---

### Request 21: Get Tasks by Status

```
GET {{base_url}}/api/tasks?status=pending
```

**Headers:**

```
Authorization: Bearer {{designer_token}}
```

---

## **STEP 13: Add Message/Comment to Task**

### Request 22: Add Comment as Designer

```
POST {{base_url}}/api/tasks/{{task_id}}/comments
```

**Headers:**

```
Authorization: Bearer {{designer_token}}
Content-Type: application/json
```

**Body:**

```json
{
  "message": "I've started working on the banner design. Will share draft by tomorrow."
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "id": 1,
    "task_id": 1,
    "user_id": 2,
    "message": "I've started working on the banner design. Will share draft by tomorrow.",
    "created_at": "2024-01-15T11:00:00Z"
  }
}
```

---

### Request 23: Get Comments on Task

```
GET {{base_url}}/api/tasks/{{task_id}}/comments
```

**Headers:**

```
Authorization: Bearer {{admin_token}}
```

**Response:** List of all comments on the task

---

### Request 24: Add Comment as Developer

```
POST {{base_url}}/api/tasks/{{task_id}}/comments
```

**Headers:**

```
Authorization: Bearer {{developer_token}}
```

**Body:**

```json
{
  "message": "API integration in progress. Need design assets to proceed."
}
```

---

## **STEP 14: Test Complete Flow with Different Roles**

### Flow for Designer:

1. ✅ Login as Designer → Get token
2. ✅ Get folders (design resources)
3. ✅ Get assigned tasks
4. ✅ Get assets (design templates)
5. ✅ Add comment/message on assigned task

---

### Flow for Developer:

1. ✅ Login as Developer → Get token
2. ✅ Get all tasks
3. ✅ Get assets (API documentation)
4. ✅ Create/update task assignments
5. ✅ Add technical comments

---

### Flow for Editor:

1. ✅ Login as Editor → Get token
2. ✅ Get assigned tasks
3. ✅ Add review comments
4. ✅ View all assets

---

## **STEP 15: Error Testing**

### Request 25: Test Without Token (Should Fail)

```
GET {{base_url}}/api/tasks
```

**Expected Response (401):**

```json
{
  "success": false,
  "message": "Unauthorized: No token provided"
}
```

---

### Request 26: Test Invalid Token (Should Fail)

```
GET {{base_url}}/api/tasks
```

**Headers:**

```
Authorization: Bearer invalid_token_xyz
```

**Expected Response (401):**

```json
{
  "success": false,
  "message": "Invalid token"
}
```

---

### Request 27: Test Invalid Credentials

```
POST {{base_url}}/api/auth/login
```

**Body:**

```json
{
  "email": "nonexistent@example.com",
  "password": "wrong_password"
}
```

**Expected Response (401):**

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## **Quick Reference Table**

| API            | Method | Endpoint                 | Role   | Auth Required |
| -------------- | ------ | ------------------------ | ------ | ------------- |
| Register Admin | POST   | /api/auth/register-admin | Public | ❌            |
| Login          | POST   | /api/auth/login          | All    | ❌            |
| Create User    | POST   | /api/users               | Admin  | ✅            |
| Get All Users  | GET    | /api/users               | All    | ✅            |
| Create Folder  | POST   | /api/folders             | All    | ✅            |
| Get Folders    | GET    | /api/folders             | All    | ✅            |
| Upload Assets  | POST   | /api/assets/upload       | All    | ✅            |
| Get Assets     | GET    | /api/assets              | All    | ✅            |
| Create Task    | POST   | /api/tasks               | All    | ✅            |
| Get Tasks      | GET    | /api/tasks               | All    | ✅            |
| Add Comment    | POST   | /api/tasks/{id}/comments | All    | ✅            |
| Get Comments   | GET    | /api/tasks/{id}/comments | All    | ✅            |

---

## **Testing Tips**

1. **Always use environment variables** for tokens - easier to manage
2. **Save responses** to variables - automate test flow
3. **Use tests tab** in Postman to validate responses automatically
4. **Organize requests in folders** by feature
5. **Use pre-request scripts** to set up data before tests
6. **Run collection** to execute all tests in sequence

---

## **Swagger Documentation**

You can also test all APIs directly in browser at:

```
http://localhost:3000/api-docs
```

---

## **Database Notes**

Users created:

- Admin: admin@scheduler.com
- Designer: designer@scheduler.com
- Developer: developer@scheduler.com
- Editor: editor@scheduler.com

All passwords follow: `{Role}@123` (e.g., Designer@123)
