import Physician from '../models/Physician.js';
import responseHandler from '../utils/responseHandler.js';

class PhysicianController {
    static async createPhysician(req, res) {
        try {
            // Get agency_id from authenticated token
            const agency_id = req.user.id;

            const {
                physician_type, status,
                first_name, last_name, display_name,
                primary_email, secondary_email, phone_number, fax_number, preferred_contact_method,
                login_enabled, login_email, role, account_status,
                specialty, department, tags, internal_notes,
                npi_number, npi_source, pecos_id, pecos_status, pecos_source,
                default_delivery_method, auto_notify, reminder_enabled, preferred_sla
            } = req.body;

            // Validation
            if (!physician_type || !first_name || !last_name || !primary_email) {
                return responseHandler.validationError(
                    res,
                    'Physician type, first name, last name, and primary email are required',
                    400
                );
            }

            // Check if physician already exists
            const existingPhysician = await Physician.findByEmail(primary_email);
            if (existingPhysician) {
                return responseHandler.error(
                    res,
                    'Physician with this email already exists',
                    null,
                    409
                );
            }

            // Create physician
            const physician = await Physician.create({
                agency_id,
                physician_type,
                status,
                first_name,
                last_name,
                display_name,
                primary_email,
                secondary_email,
                phone_number,
                fax_number,
                preferred_contact_method,
                login_enabled,
                login_email,
                role,
                account_status,
                specialty,
                department,
                tags,
                internal_notes,
                npi_number,
                npi_source,
                pecos_id,
                pecos_status,
                pecos_source,
                default_delivery_method,
                auto_notify,
                reminder_enabled,
                preferred_sla,
                created_by: agency_id
            });

            return responseHandler.success(
                res,
                'Physician created successfully',
                physician,
                201
            );
        } catch (error) {
            console.error('Error creating physician:', error);
            return responseHandler.error(
                res,
                'Failed to create physician',
                error.message,
                500
            );
        }
    }

    static async getAllPhysicians(req, res) {
        try {
            // Get agency_id from authenticated token
            const agency_id = req.user.id;
            const { physician_type, status, search } = req.query;

            const physicians = await Physician.findAll({
                agency_id,
                physician_type,
                status,
                search
            });

            return responseHandler.success(
                res,
                'Physicians retrieved successfully',
                {
                    count: physicians.length,
                    physicians
                },
                200
            );
        } catch (error) {
            console.error('Error retrieving physicians:', error);
            return responseHandler.error(
                res,
                'Failed to retrieve physicians',
                error.message,
                500
            );
        }
    }

    static async getPhysicianById(req, res) {
        try {
            const { physician_id } = req.params;
            const agency_id = req.user.id;

            const physician = await Physician.findById(physician_id);

            if (!physician) {
                return responseHandler.notFound(
                    res,
                    'Physician not found',
                    404
                );
            }

            // Check if physician belongs to the authenticated agency
            if (physician.agency_id !== agency_id) {
                return responseHandler.error(
                    res,
                    'You do not have permission to access this physician',
                    null,
                    403
                );
            }

            return responseHandler.success(
                res,
                'Physician retrieved successfully',
                physician,
                200
            );
        } catch (error) {
            console.error('Error retrieving physician:', error);
            return responseHandler.error(
                res,
                'Failed to retrieve physician',
                error.message,
                500
            );
        }
    }

    static async getPhysiciansByAgency(req, res) {
        try {
            // Get agency_id from authenticated token
            const agency_id = req.user.id;
            const { physician_type, status, search } = req.query;

            const physicians = await Physician.findByAgency(agency_id, {
                physician_type,
                status,
                search
            });

            return responseHandler.success(
                res,
                'Physicians retrieved successfully',
                {
                    count: physicians.length,
                    physicians
                },
                200
            );
        } catch (error) {
            console.error('Error retrieving physicians by agency:', error);
            return responseHandler.error(
                res,
                'Failed to retrieve physicians',
                error.message,
                500
            );
        }
    }

    static async updatePhysician(req, res) {
        try {
            const { physician_id } = req.params;
            const agency_id = req.user.id;
            const updateData = { ...req.body, updated_by: agency_id };

            const physician = await Physician.findById(physician_id);
            if (!physician) {
                return responseHandler.notFound(
                    res,
                    'Physician not found',
                    404
                );
            }

            // Check if physician belongs to the authenticated agency
            if (physician.agency_id !== agency_id) {
                return responseHandler.error(
                    res,
                    'You do not have permission to update this physician',
                    null,
                    403
                );
            }

            const updatedPhysician = await Physician.update(physician_id, updateData);

            return responseHandler.success(
                res,
                'Physician updated successfully',
                updatedPhysician,
                200
            );
        } catch (error) {
            console.error('Error updating physician:', error);
            return responseHandler.error(
                res,
                'Failed to update physician',
                error.message,
                500
            );
        }
    }

    static async deactivatePhysician(req, res) {
        try {
            const { physician_id } = req.params;
            const agency_id = req.user.id;
            const { deactivation_reason } = req.body;

            const physician = await Physician.findById(physician_id);
            if (!physician) {
                return responseHandler.notFound(
                    res,
                    'Physician not found',
                    404
                );
            }

            // Check if physician belongs to the authenticated agency
            if (physician.agency_id !== agency_id) {
                return responseHandler.error(
                    res,
                    'You do not have permission to deactivate this physician',
                    null,
                    403
                );
            }

            const deactivatedPhysician = await Physician.deactivate(physician_id, {
                deactivated_by: agency_id,
                deactivation_reason
            });

            return responseHandler.success(
                res,
                'Physician deactivated successfully',
                deactivatedPhysician,
                200
            );
        } catch (error) {
            console.error('Error deactivating physician:', error);
            return responseHandler.error(
                res,
                'Failed to deactivate physician',
                error.message,
                500
            );
        }
    }

    static async deletePhysician(req, res) {
        try {
            const { physician_id } = req.params;
            const agency_id = req.user.id;

            const physician = await Physician.findById(physician_id);
            if (!physician) {
                return responseHandler.notFound(
                    res,
                    'Physician not found',
                    404
                );
            }

            // Check if physician belongs to the authenticated agency
            if (physician.agency_id !== agency_id) {
                return responseHandler.error(
                    res,
                    'You do not have permission to delete this physician',
                    null,
                    403
                );
            }

            const deletedPhysician = await Physician.delete(physician_id);

            return responseHandler.success(
                res,
                'Physician deleted successfully',
                deletedPhysician,
                200
            );
        } catch (error) {
            console.error('Error deleting physician:', error);

            // Check if error is due to foreign key constraint
            if (error.code === '23503') {
                return responseHandler.error(
                    res,
                    'Cannot delete physician. It has associated orders or other records.',
                    null,
                    409
                );
            }

            return responseHandler.error(
                res,
                'Failed to delete physician',
                error.message,
                500
            );
        }
    }
}

export default PhysicianController;
