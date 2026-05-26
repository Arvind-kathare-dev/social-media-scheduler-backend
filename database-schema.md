# Social Scheduler - Database Schema

## Overview

This document defines the PostgreSQL database schema for the Social Media Scheduler application. The system manages users with different roles (admin, designer, developer, editor), tasks for social media scheduling, folders for organizing content, assets for storing media files, and comments for team collaboration.

---

## Database Tables

### 1. users

Stores user account information including authentication and role management.

```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'editor',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**

- `id`: Primary key - Unique identifier
- `name`: Full name of the user
- `email`: Unique email address for login
- `password`: Hashed password using bcrypt
- `mobile_number`: Contact phone number (optional)
- `role`: User role - Values: `admin`, `designer`, `developer`, `editor`
- `is_active`: Account activation status (true/false)
- `created_at`: Record creation timestamp
- `updated_at`: Last modification timestamp

**Indexes:**

- Unique constraint on `email`

**Roles & Permissions:**

- **admin**: Full system access, create/manage users, create tasks, upload assets
- **designer**: Create/edit design tasks, upload assets, add comments
- **developer**: Manage development tasks, integrate APIs, add comments
- **editor**: Review content, add comments, limited task access

---

### 2. tasks

Stores task information for social media content scheduling and management.

```sql
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo',
    priority VARCHAR(50) DEFAULT 'medium',
    assigned_to INT REFERENCES users(id) ON DELETE SET NULL,
    assigned_to_multi JSONB DEFAULT '[]',
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    due_date TIMESTAMP,
    tone VARCHAR(100),
    hashtags JSONB,
    platforms JSONB,
    visual_reference TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**

- `id`: Primary key
- `title`: Task title/name (required)
- `description`: Detailed task description
- `status`: Task status - Values: `todo`, `in_progress`, `in_review`, `completed`, `pending`
- `priority`: Priority level - Values: `low`, `medium`, `high`, `critical`
- `assigned_to`: Single user assignment (user ID)
- `assigned_to_multi`: Multiple team members assigned (JSON array of user IDs)
- `created_by`: User who created the task (user ID)
- `due_date`: Task deadline
- `tone`: Content tone/style (e.g., professional, casual, humorous)
- `hashtags`: JSON array of hashtags for the post
- `platforms`: JSON array of social media platforms (Instagram, Facebook, Twitter, LinkedIn, etc.)
- `visual_reference`: URL or description of visual assets
- `notes`: Additional internal notes
- `created_at`: Record creation timestamp
- `updated_at`: Last modification timestamp

**Indexes:**

- Foreign key index on `assigned_to`
- Foreign key index on `created_by`

**Example JSON Fields:**

```json
// hashtags
["#socialmedia", "#marketing", "#branding"]

// platforms
["instagram", "facebook", "twitter"]
```

---

### 3. folders

Stores folder structure for organizing tasks and assets.

```sql
CREATE TABLE IF NOT EXISTS folders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to JSONB DEFAULT '[]',
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**

- `id`: Primary key
- `name`: Folder name
- `description`: Folder description (optional)
- `assigned_to`: JSON array of user IDs who have access to this folder
- `created_by`: User who created the folder (user ID)
- `created_at`: Record creation timestamp
- `updated_at`: Last modification timestamp

**Example JSON Field:**

```json
// assigned_to
[1, 2, 3] // User IDs with access
```

---

### 4. assets

Stores uploaded media files and content assets.

```sql
CREATE TABLE IF NOT EXISTS assets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    folder_id INT REFERENCES folders(id) ON DELETE CASCADE,
    platform VARCHAR(100),
    copy TEXT,
    author_id INT REFERENCES users(id) ON DELETE SET NULL,
    files JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**

- `id`: Primary key
- `title`: Asset title/name
- `folder_id`: Parent folder ID (optional)
- `platform`: Target platform (Instagram, Facebook, Twitter, etc.)
- `copy`: Asset description or caption text
- `author_id`: User who uploaded the asset (user ID)
- `files`: JSON array of uploaded file metadata
- `created_at`: Record creation timestamp
- `updated_at`: Last modification timestamp

**Example JSON Field:**

```json
// files
[
  {
    "filename": "1234567890-image1.jpg",
    "originalname": "banner.jpg",
    "mimetype": "image/jpeg",
    "size": 245678,
    "path": "uploads/1234567890-image1.jpg"
  }
]
```

---

### 5. comments

Stores comments and messages on tasks for team collaboration.

```sql
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    parent_id INT REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**

- `id`: Primary key
- `task_id`: Associated task ID
- `user_id`: User who posted the comment (user ID)
- `parent_id`: Parent comment ID for nested/threaded comments (optional)
- `content`: Comment text content (required)
- `created_at`: Record creation timestamp
- `updated_at`: Last modification timestamp

**Indexes:**

- Foreign key index on `task_id`
- Foreign key index on `user_id`

---

### 6. notifications

Stores user notifications for task updates and team activity.

```sql
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    type VARCHAR(50),
    task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**

- `id`: Primary key
- `user_id`: Recipient user ID
- `message`: Notification message text
- `type`: Notification type - Values: `task_assigned`, `task_updated`, `comment_added`, `task_completed`
- `task_id`: Associated task ID (optional)
- `is_read`: Read status (true/false)
- `created_at`: Record creation timestamp

**Indexes:**

- Foreign key index on `user_id`
- Foreign key index on `task_id`

---

## Relationships & Constraints

### Foreign Key Relationships:

```
users → tasks (created_by)
users → tasks (assigned_to, assigned_to_multi)
users → folders (created_by)
users → assets (author_id)
users → comments (user_id)
users → notifications (user_id)

tasks → comments (task_id)
tasks → notifications (task_id)

folders → assets (folder_id)

comments → comments (parent_id) - Self-referencing for nested comments
```

### Cascade Rules:

- **ON DELETE CASCADE**: Comments and assets are deleted when parent task/folder is deleted
- **ON DELETE SET NULL**: User references become NULL if user is deleted (preserves history)
- **ON DELETE RESTRICT**: Prevents deletion of parent records referenced by children

---

## Data Types & Constraints

### JSON Fields:

- `hashtags` (JSONB): Array of string hashtags
- `platforms` (JSONB): Array of platform names
- `assigned_to_multi` (JSONB): Array of user IDs
- `assigned_to` (JSONB): Array of user IDs for folder access
- `files` (JSONB): Array of file metadata objects

### Enumerations:

**User Roles:**

- `admin`
- `designer`
- `developer`
- `editor`

**Task Status:**

- `todo` (default)
- `in_progress`
- `in_review`
- `completed`
- `pending`

**Task Priority:**

- `low`
- `medium` (default)
- `high`
- `critical`

**Notification Types:**

- `task_assigned`
- `task_updated`
- `comment_added`
- `task_completed`
- `task_mentioned`

---

## Indexes

```sql
-- Users
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Tasks
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Folders
CREATE INDEX idx_folders_created_by ON folders(created_by);

-- Assets
CREATE INDEX idx_assets_folder_id ON assets(folder_id);
CREATE INDEX idx_assets_author_id ON assets(author_id);

-- Comments
CREATE INDEX idx_comments_task_id ON comments(task_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_task_id ON notifications(task_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
```

---

## Setup Instructions

### Create all tables:

```bash
# Run individual setup scripts
node setupDb.js        # Users, Tasks, Notifications
node setupFolders.js   # Folders
node setupAssets.js    # Assets
node setupComments.js  # Comments
```

### Or use migration:

```bash
npm run migrate
```

---

## Example Queries

### Get all tasks for a specific user:

```sql
SELECT * FROM tasks
WHERE assigned_to = $1 OR assigned_to_multi @> $2::jsonb
ORDER BY due_date ASC;
```

### Get all folders accessible to a user:

```sql
SELECT * FROM folders
WHERE created_by = $1 OR assigned_to @> $2::jsonb
ORDER BY created_at DESC;
```

### Get task comments with user info:

```sql
SELECT c.*, u.name, u.email
FROM comments c
LEFT JOIN users u ON c.user_id = u.id
WHERE c.task_id = $1
ORDER BY c.created_at ASC;
```

### Get unread notifications for a user:

```sql
SELECT * FROM notifications
WHERE user_id = $1 AND is_read = false
ORDER BY created_at DESC;
```

---

## Performance Considerations

1. **JSONB Indexes**: Consider adding GIN indexes on JSONB columns if queries on those arrays are frequent
2. **Task Filters**: Index on `status`, `priority`, and `due_date` for common queries
3. **User Lookup**: Email index is unique and should be used for login queries
4. **Notification Archive**: Consider archiving old notifications to maintain performance

---

## Future Enhancements

- [ ] Full-text search on task titles/descriptions
- [ ] Task history/audit logging
- [ ] Attachment storage for comments
- [ ] Task templates
- [ ] Recurring tasks
- [ ] Task dependencies
