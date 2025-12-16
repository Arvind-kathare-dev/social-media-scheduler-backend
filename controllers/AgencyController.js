import Agency from '../models/Agency.js';
import responseHandler from '../utils/responseHandler.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

class AgencyController {
    // Agency Login
    static async loginAgency(req, res) {
        try {
            const { email, password } = req.body;

            // Validation
            if (!email || !password) {
                return responseHandler.validationError(
                    res,
                    'Email and password are required',
                    400
                );
            }

            // Find agency by email
            const agency = await Agency.findByEmail(email);

            if (!agency) {
                return responseHandler.unauthorized(
                    res,
                    'Invalid email or password',
                    401
                );
            }

            // Check if agency is active
            if (!agency.is_active) {
                return responseHandler.unauthorized(
                    res,
                    'Agency account is deactivated',
                    401
                );
            }

            // Compare password (assuming password is stored in agency table)
            // Note: You'll need to add password field to Agency model and hash it during creation
            const isPasswordValid = await bcrypt.compare(password, agency.password || '');

            if (!isPasswordValid) {
                return responseHandler.unauthorized(
                    res,
                    'Invalid email or password',
                    401
                );
            }

            // Generate JWT token
            const token = jwt.sign(
                {
                    id: agency.id,
                    email: agency.email,
                    agency_name: agency.agency_name,
                    agency_no: agency.agency_no,
                    agency_role: agency.role, // Admin or Staff
                    role: 'agency' // User type
                },
                process.env.JWT_SECRET_KEY,
                {
                    expiresIn: '24h' // Token expires in 24 hours
                }
            );

            // Remove sensitive data from response
            const { password: _, ...agencyData } = agency;

            // Clear login attempts on successful login
            const ip = req.ip || req.connection.remoteAddress;
            // This will be handled by middleware if needed

            return responseHandler.success(
                res,
                'Login successful',
                {
                    token,
                    agency: agencyData,
                    expiresIn: '24h'
                },
                200
            );
        } catch (error) {
            console.error('Error during agency login:', error);
            return responseHandler.error(
                res,
                'Login failed',
                error.message,
                500
            );
        }
    }

    // Create new agency
    static async createAgency(req, res) {
        try {
            const {
                agency_name,
                email,
                contact_no,
                date_of_birth,
                agency_no,
                license_no,
                hospital_name,
                sign_threshold,
                is_active
            } = req.body;

            // Validation
            if (!agency_name || !email || !contact_no) {
                return responseHandler.validationError(
                    res,
                    'Agency name, email, and contact number are required',
                    400
                );
            }

            const created_by = req.user?.id || null;
            const role = req.body.role || 'Staff'; // Default to Staff if not provided

            // Validate role
            if (!['Admin', 'Staff'].includes(role)) {
                return responseHandler.validationError(
                    res,
                    'Role must be either Admin or Staff',
                    400
                );
            }

            // Hash password if provided
            let hashedPassword = null;
            if (req.body.password) {
                const saltRounds = 10;
                hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
            }

            const newAgency = await Agency.create({
                agency_name,
                email,
                contact_no,
                date_of_birth,
                agency_no,
                license_no,
                hospital_name,
                sign_threshold,
                is_active,
                created_by,
                password: hashedPassword,
                role
            });

            return responseHandler.success(
                res,
                'Agency created successfully',
                newAgency,
                201
            );
        } catch (error) {
            console.error('Error creating agency:', error);

            if (error.code === '23505') {
                return responseHandler.error(
                    res,
                    'Agency with this email or agency number already exists',
                    error.message,
                    409
                );
            }

            return responseHandler.error(
                res,
                'Failed to create agency',
                error.message,
                500
            );
        }
    }

    // Get agency by ID
    static async getAgencyById(req, res) {
        try {
            const { id } = req.params;

            const agency = await Agency.findById(id);

            if (!agency) {
                return responseHandler.notFound(
                    res,
                    'Agency not found',
                    404
                );
            }

            return responseHandler.success(
                res,
                'Agency retrieved successfully',
                agency,
                200
            );
        } catch (error) {
            console.error('Error fetching agency:', error);
            return responseHandler.error(
                res,
                'Failed to fetch agency',
                error.message,
                500
            );
        }
    }

    // Get all agencies with filters
    static async getAllAgencies(req, res) {
        try {
            const { is_active, hospital_name, search, role } = req.query;

            const filters = {};

            if (is_active !== undefined) {
                filters.is_active = is_active === 'true';
            }

            if (hospital_name) {
                filters.hospital_name = hospital_name;
            }

            if (role) {
                filters.role = role;
            }

            if (search) {
                filters.search = search;
            }

            const agencies = await Agency.findAll(filters);

            return responseHandler.success(
                res,
                'Agencies retrieved successfully',
                {
                    count: agencies.length,
                    agencies
                },
                200
            );
        } catch (error) {
            console.error('Error fetching agencies:', error);
            return responseHandler.error(
                res,
                'Failed to fetch agencies',
                error.message,
                500
            );
        }
    }

    // Update agency
    static async updateAgency(req, res) {
        try {
            const { id } = req.params;
            const {
                agency_name,
                email,
                contact_no,
                date_of_birth,
                agency_no,
                license_no,
                hospital_name,
                sign_threshold,
                is_active,
                role
            } = req.body;

            const updated_by = req.user?.id || null;

            // Validate role if provided
            if (role && !['Admin', 'Staff'].includes(role)) {
                return responseHandler.validationError(
                    res,
                    'Role must be either Admin or Staff',
                    400
                );
            }

            // Check if agency exists
            const existingAgency = await Agency.findById(id);
            if (!existingAgency) {
                return responseHandler.notFound(
                    res,
                    'Agency not found',
                    404
                );
            }

            const updatedAgency = await Agency.update(id, {
                agency_name,
                email,
                contact_no,
                date_of_birth,
                agency_no,
                license_no,
                hospital_name,
                sign_threshold,
                is_active,
                role,
                updated_by
            });

            if (!updatedAgency) {
                return responseHandler.validationError(
                    res,
                    'No fields to update',
                    400
                );
            }

            return responseHandler.success(
                res,
                'Agency updated successfully',
                updatedAgency,
                200
            );
        } catch (error) {
            console.error('Error updating agency:', error);

            if (error.code === '23505') {
                return responseHandler.error(
                    res,
                    'Agency with this email or agency number already exists',
                    error.message,
                    409
                );
            }

            return responseHandler.error(
                res,
                'Failed to update agency',
                error.message,
                500
            );
        }
    }

    // Delete agency
    static async deleteAgency(req, res) {
        try {
            const { id } = req.params;

            const agency = await Agency.findById(id);
            if (!agency) {
                return responseHandler.notFound(
                    res,
                    'Agency not found',
                    404
                );
            }

            const deletedAgency = await Agency.delete(id);

            return responseHandler.success(
                res,
                'Agency deleted successfully',
                deletedAgency,
                200
            );
        } catch (error) {
            console.error('Error deleting agency:', error);

            if (error.code === '23503') {
                return responseHandler.error(
                    res,
                    'Cannot delete agency. It has associated records (physicians, orders, etc.)',
                    error.message,
                    409
                );
            }

            return responseHandler.error(
                res,
                'Failed to delete agency',
                error.message,
                500
            );
        }
    }

    // Soft delete (deactivate) agency
    static async deactivateAgency(req, res) {
        try {
            const { id } = req.params;
            const updated_by = req.user?.id || null;

            const agency = await Agency.findById(id);
            if (!agency) {
                return responseHandler.notFound(
                    res,
                    'Agency not found',
                    404
                );
            }

            const deactivatedAgency = await Agency.update(id, {
                is_active: false,
                updated_by
            });

            return responseHandler.success(
                res,
                'Agency deactivated successfully',
                deactivatedAgency,
                200
            );
        } catch (error) {
            console.error('Error deactivating agency:', error);
            return responseHandler.error(
                res,
                'Failed to deactivate agency',
                error.message,
                500
            );
        }
    }

    // Activate agency
    static async activateAgency(req, res) {
        try {
            const { id } = req.params;
            const updated_by = req.user?.id || null;

            const agency = await Agency.findById(id);
            if (!agency) {
                return responseHandler.notFound(
                    res,
                    'Agency not found',
                    404
                );
            }

            const activatedAgency = await Agency.update(id, {
                is_active: true,
                updated_by
            });

            return responseHandler.success(
                res,
                'Agency activated successfully',
                activatedAgency,
                200
            );
        } catch (error) {
            console.error('Error activating agency:', error);
            return responseHandler.error(
                res,
                'Failed to activate agency',
                error.message,
                500
            );
        }
    }

    // Get agency statistics
    static async getAgencyStats(req, res) {
        try {
            const { id } = req.params;

            const agency = await Agency.findById(id);
            if (!agency) {
                return responseHandler.notFound(
                    res,
                    'Agency not found',
                    404
                );
            }

            // You can expand this to include more statistics
            // For now, returning basic agency info
            const stats = {
                agency_id: agency.id,
                agency_name: agency.agency_name,
                is_active: agency.is_active,
                created_at: agency.created_at
            };

            return responseHandler.success(
                res,
                'Agency statistics retrieved successfully',
                stats,
                200
            );
        } catch (error) {
            console.error('Error fetching agency stats:', error);
            return responseHandler.error(
                res,
                'Failed to fetch agency statistics',
                error.message,
                500
            );
        }
    }
}

export default AgencyController;
