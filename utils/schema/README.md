# Database Schema Setup Guide

## Quick Setup (Recommended)

### Option 1: Run Complete Setup Script in Supabase

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy the contents of `00_setup_all_tables.sql`
4. Paste and click **Run**
5. Done! ✅

This will create all tables in the correct order with proper relationships.

---

## Individual Table Scripts

If you prefer to run tables individually, use these files in order:

1. `create_agencies_table.sql` - **Must run first** (referenced by other tables)
2. `create_order_states_table.sql`
3. `create_order_types_table.sql`
4. `create_physicians_table.sql`
5. `create_inventory_table.sql`
6. `create_supplies_table.sql`
7. `add_delivered_date_to_supplies.sql` - Migration (optional if supplies table already exists)

---

## Tables Created

### 1. **agencies**

- Stores agency/user information
- Authentication and authorization
- Referenced by: order_states, order_types, physicians

### 2. **order_states**

- Order state definitions (Draft, Pending, Approved, etc.)
- Default states auto-inserted

### 3. **order_types**

- Order type definitions (Medical Supply, Equipment, etc.)
- Default types auto-inserted

### 4. **physicians**

- Physician information (agency-owned and external)
- Links to agencies
- Supports NPI, PECOS identifiers

### 5. **inventory**

- Inventory management
- Stock tracking with auto-calculated total value
- SKU-based identification

### 6. **supplies**

- Patient supply orders
- Approval/decline workflow
- Delivery tracking

---

## Environment Variables

After creating tables, update your `.env` file:

```env
# Production (Supabase)
POSTGRES_URL=your_supabase_connection_string_here

# JWT Secret
JWT_SECRET_KEY=Ordina_postgreySQL_based_project_created_by_Vinod
```

---

## Vercel Deployment

Add these environment variables in Vercel dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add:
   - `POSTGRES_URL` = Your Supabase connection string
   - `JWT_SECRET_KEY` = Your JWT secret

---

## Testing Connection

Run your app locally to test:

```bash
npm run dev
```

Check console for:

```
✅ Connected to PostgreSQL database at: [timestamp]
```

---

## Troubleshooting

### Connection Issues

- Verify `POSTGRES_URL` is correct
- Check Supabase database is active
- Ensure SSL is enabled (already configured in `connectDB.js`)

### Table Creation Errors

- Run `00_setup_all_tables.sql` instead of individual files
- Check for existing tables with same names
- Verify you have proper permissions in Supabase

---

## Notes

- All tables have auto-updating `updated_at` timestamps
- Indexes are created for performance optimization
- Foreign key constraints maintain data integrity
- Default values are set for common fields
