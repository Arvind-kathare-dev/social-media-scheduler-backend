import User from '../models/User.js';
import responseHandler from '../utils/responseHandler.js';
import bcrypt from 'bcrypt';

class UserController {
    // Create a new user (Team Member)
    static async createUser(req, res) {
        try {
            const { name, email, password, role, mobile_number } = req.body;

            // Basic validation
            if (!name || !email || !password || !role) {
                return responseHandler.validationError(res, 'Name, email, password, and role are required', 400);
            }

            // Check if user already exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return responseHandler.validationError(res, 'User with this email already exists', 400);
            }

            // Hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create the user in database
            const newUser = await User.create({
                name,
                email,
                password: hashedPassword,
                role,
                mobile_number: mobile_number || null,
                is_active: true
            });

            // Omit password from response
            const { password: _, ...userData } = newUser;

            return responseHandler.success(res, 'User created successfully', userData, 201);
        } catch (error) {
            console.error('Error creating user:', error);
            return responseHandler.error(res, 'Failed to create user', error.message, 500);
        }
    }

    // Get all users
    static async getUsers(req, res) {
        try {
            // Optional query filters
            const { role, is_active } = req.query;
            
            const users = await User.findAll({ 
                role, 
                is_active: is_active !== undefined ? is_active === 'true' : undefined 
            });

            // Omit passwords from all users
            const safeUsers = users.map(user => {
                const { password, ...safeUser } = user;
                return safeUser;
            });

            return responseHandler.success(res, 'Users retrieved successfully', safeUsers, 200);
        } catch (error) {
            console.error('Error fetching users:', error);
            return responseHandler.error(res, 'Failed to fetch users', error.message, 500);
        }
    }

    // Get user by ID
    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findById(id);

            if (!user) {
                return responseHandler.notFound(res, 'User not found', 404);
            }

            const { password, ...safeUser } = user;
            return responseHandler.success(res, 'User retrieved successfully', safeUser, 200);
        } catch (error) {
            console.error('Error fetching user:', error);
            return responseHandler.error(res, 'Failed to fetch user', error.message, 500);
        }
    }

    // Update a user
    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { name, email, role, mobile_number, password, is_active } = req.body;

            // Check if user exists
            const user = await User.findById(id);
            if (!user) {
                return responseHandler.notFound(res, 'User not found', 404);
            }

            // If updating email, check for duplicates
            if (email && email !== user.email) {
                const existingEmail = await User.findByEmail(email);
                if (existingEmail) {
                    return responseHandler.validationError(res, 'Email is already in use by another user', 400);
                }
            }

            const updateData = { name, email, role, mobile_number, is_active };

            // If password is provided, hash it before updating
            if (password) {
                const saltRounds = 10;
                updateData.password = await bcrypt.hash(password, saltRounds);
            }

            const updatedUser = await User.update(id, updateData);

            if (!updatedUser) {
                return responseHandler.error(res, 'No fields provided to update', null, 400);
            }

            const { password: _, ...safeUser } = updatedUser;
            return responseHandler.success(res, 'User updated successfully', safeUser, 200);
        } catch (error) {
            console.error('Error updating user:', error);
            return responseHandler.error(res, 'Failed to update user', error.message, 500);
        }
    }

    // Delete a user
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findById(id);
            if (!user) {
                return responseHandler.notFound(res, 'User not found', 404);
            }

            await User.delete(id);

            return responseHandler.success(res, 'User deleted successfully', null, 200);
        } catch (error) {
            console.error('Error deleting user:', error);
            return responseHandler.error(res, 'Failed to delete user', error.message, 500);
        }
    }
}

export default UserController;
